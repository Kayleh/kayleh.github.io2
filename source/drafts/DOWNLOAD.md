---
title: Download 
mathjax: false
date: 2021-03-16T01:18:07+08:00
tags: [C]
slugs: Download
drafts: true
---

# Java 多线程下载器的设计与实现

应用并发的场景有很多，下载文件就是一个很常见的并发场景。

为什么会想写多线程下载器呢？不知道你用过 IDM（Internet Download Manager）没，我刚使用 IDM 时，就被它的下载方式吸引了。

用 IDM 下载文件时，能够直观地看到它的下载过程：固定用 N 个线程下载文件，一开始先将文件分为 N 段，每段用一个线程下载，当某一段下载完成之后，对应的线程就空闲了，此时怎么做呢？从剩余的 N - 1 段中取出最大的一段，一分为二，这样就又有了 N 段的数据，让空闲的线程去下载新划分出来的这一段。

每当有一个线程完成下载任务时，就不断从剩余的部分中划分出一段给它下载，直到整个文件的所有部分都下载完毕。

当然，文件并不能被无限地分段，IDM 会设定一个段的阈值，当剩余的最大段小于这个阈值的时候，就不再分段了给空闲的线程了，只等待活动中的所有线程下载完毕。

![img](https://cdn.kayleh.top/gh/kayleh/cdn4/DOWNLOAD/idm.png)

说完 IDM 的下载策略，我们大致有了思路。不过优秀的软件不是一蹴而就的，虽然我们想写出像 IDM 的下载器，但还需要从简单的实现开始，不断迭代优化。

所以我们一开始采用的策略是：固定 N 个线程，并将文件划分为 N 段，每个线程负责下载一段数据。

### 实现步骤

**判断服务器是否支持断点续传**

首先要明确的是，多线程下载文件利用的是每个线程下载文件的一部分，那么就需要 HTTP 服务器支持请求部分数据，或者说断点续传，因此第一步需要判断目标文件是否支持断点续传。

HTTP 请求头中有一个 `Range` 字段，可以用来指定要请求的数据范围，例如我们要请求从第 10 字节到第 20 字节的数据，可以将该字段写为 `Range:bytes=10-20`。

相应的，如果 HTTP 服务器支持断点续传，那么对于指定了 `Range` 字段的请求，会返回 206 状态码。

我们用 Curl 来测试一下：

```bash
curl -I --header "Range: bytes=0-" http://mirrors.163.com/debian/ls-lR.gz
```

得到的响应：

```null
HTTP/1.1 206 Partial Content
Server: nginx
Date: Wed, 25 Apr 2018 02:57:56 GMT
Content-Type: application/octet-stream
Content-Length: 15316619
Connection: keep-alive
Last-Modified: Mon, 23 Apr 2018 14:38:44 GMT
ETag: "5addeff4-e9b68b"
Content-Range: bytes 0-15316618/15316619
```

我们设置 `Range: bytes=0-` ，表示请求从第 0 字节到最后一字节的数据，那为什么还要指定该字段呢？这是出于两方面的原因：一是判断响应的状态码是否为 206，二是得到文件的大小。

如果服务器支持断点续传，那么我们采用多线程进行下载，如果不支持断点续传，就采用单线程下载。

**文件分段**

我们得到了文件的大小 fileSize，将其分为 N 段，则每一段的大小为 `fileSize / N`，由于文件通常不会正好被分为 N 段，因此最后一段就等于剩余的部分的大小。

我们用一个数组 endPoint 来存放每一段的起止位置，例如一个 10 B 的文件，起止范围是 0~9，如果分为 3 段下载，那么 `endPoint = {0, 3, 6, 10}`，对每段来说是左闭右开区间。

解释：对于第 i 段（i 从 0 开始）来说，从 `endPoint[i]` 开始下载，在 `endPoint[i + 1] - 1` 处停止。同理，对第 i + 1 段来说，从 `endPoint[i + 1]` 开始，在 `endPoint[i + 2] - 1` 处停止。

**创建下载线程**

我们为每一段创建一个下载线程进行下载，每一段都存放在一个单独的临时文件中。

下载线程需要做的事情可以总结如下：

- 设置请求头的 `Range` 字段来指定请求范围
- 设置超时时间
- 连接 HTTP 服务器
- 创建临时文件（第一次下载该段）
- 读取服务器返回的数据，写入到临时文件，直到读取的字节数等于该段的大小
- 关闭临时文件

上面是顺利下载的流程，我们还需要在出现下列问题时进行重试：

- 如果连接时间或读取时间超时
- 临时文件读写出错

这样又有问题了，对于该线程来说，重试时是重新下载整段，还是接着下载剩余部分？我们知道，最好就是接着下载还没下完的那部分，那如何实现呢？

我们可以这么做：每个线程保存自己负责部分的起止位置，在刚启动线程时，起止位置就是段的起止位置，创建临时文件写出已下载的数据。在下载数据时，实时更新线程的起始位置为当前已下载字节的下一个字节，当出错需要重试时，直接从该位置开始，并且写出到之前创建的临时文件中。

**创建监视线程**

我们创建一个守护线程，负责监视文件的下载进度、下载速度、当前活跃线程数，在各线程下载结束后，通知主线程做下一步处理。

**处理临时文件**

当主线程收到通知，所有部分都下载完成时，就需要对临时文件进行清理。

如果是多线程下载的文件，那么需要对多个临时文件进行合并。

如果是单线程下载的文件，则对临时文件进行重命名。

### 具体实现

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.concurrent.atomic.AtomicInteger;


public class HttpDownloader {

    private boolean resumable;
    private URL url;
    private File localFile;
    private int[] endPoint;
    private Object waiting = new Object();
    private AtomicInteger downloadedBytes = new AtomicInteger(0);
    private AtomicInteger aliveThreads = new AtomicInteger(0);
    private boolean multithreaded = true;
    private int fileSize = 0;
    private int THREAD_NUM = 5;
    private int TIME_OUT = 5000;
    private final int MIN_SIZE = 2 << 20;

    public static void main(String[] args) throws IOException {
        String url = "http://mirrors.163.com/debian/ls-lR.gz";
        new HttpDownloader(url, "D:/ls-lR.gz", 5, 5000).get();
    }

    public HttpDownloader(String Url, String localPath) throws MalformedURLException {
        this.url = new URL(Url);
        this.localFile = new File(localPath);
    }

    public HttpDownloader(String Url, String localPath,
            int threadNum, int timeout) throws MalformedURLException {
        this(Url, localPath);
        this.THREAD_NUM = threadNum;
        this.TIME_OUT = timeout;
    }

    //开始下载文件
    public void get() throws IOException {
        long startTime = System.currentTimeMillis();

        resumable = supportResumeDownload();
        if (!resumable || THREAD_NUM == 1|| fileSize < MIN_SIZE) multithreaded = false;
        if (!multithreaded) {
            new DownloadThread(0, 0, fileSize - 1).start();;
        }
        else {
            endPoint = new int[THREAD_NUM + 1];
            int block = fileSize / THREAD_NUM;
            for (int i = 0; i < THREAD_NUM; i++) {
                endPoint[i] = block * i;
            }
            endPoint[THREAD_NUM] = fileSize;
            for (int i = 0; i < THREAD_NUM; i++) {
                new DownloadThread(i, endPoint[i], endPoint[i + 1] - 1).start();
            }
        }

        startDownloadMonitor();

        //等待 downloadMonitor 通知下载完成
        try {
            synchronized(waiting) {
                waiting.wait();
            }
        } catch (InterruptedException e) {
            System.err.println("Download interrupted.");
        }

        cleanTempFile();

        long timeElapsed = System.currentTimeMillis() - startTime;
        System.out.println("* File successfully downloaded.");
        System.out.println(String.format("* Time used: %.3f s, Average speed: %d KB/s",
                timeElapsed / 1000.0, downloadedBytes.get() / timeElapsed));
    }

    //检测目标文件是否支持断点续传，以决定是否开启多线程下载文件的不同部分
    public boolean supportResumeDownload() throws IOException {
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestProperty("Range", "bytes=0-");
        int resCode;
        while (true) {
            try {
                con.connect();
                fileSize = con.getContentLength();
                resCode = con.getResponseCode();
                con.disconnect();
                break;
            } catch (ConnectException e) {
                System.out.println("Retry to connect due to connection problem.");
            }
        }
        if (resCode == 206) {
            System.out.println("* Support resume download");
            return true;
        } else {
            System.out.println("* Doesn't support resume download");
            return false;
        }
    }

    //监测下载速度及下载状态，下载完成时通知主线程
    public void startDownloadMonitor() {
        Thread downloadMonitor = new Thread(() -> {
            int prev = 0;
            int curr = 0;
            while (true) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {}

                curr = downloadedBytes.get();
                System.out.println(String.format("Speed: %d KB/s, Downloaded: %d KB (%.2f%%), Threads: %d",
                        (curr - prev) >> 10, curr >> 10, curr / (float) fileSize * 100, aliveThreads.get()));
                prev = curr;

                if (aliveThreads.get() == 0) {
                    synchronized (waiting) {
                        waiting.notifyAll();
                    }
                }
            }
        });

        downloadMonitor.setDaemon(true);
        downloadMonitor.start();
    }

    //对临时文件进行合并或重命名
    public void cleanTempFile() throws IOException {
        if (multithreaded) {
            merge();
            System.out.println("* Temp file merged.");
        } else {
            Files.move(Paths.get(localFile.getAbsolutePath() + ".0.tmp"),
                    Paths.get(localFile.getAbsolutePath()), StandardCopyOption.REPLACE_EXISTING);
        }
    }

    //合并多线程下载产生的多个临时文件
    public void merge() {
        try (OutputStream out = new FileOutputStream(localFile)) {
            byte[] buffer = new byte[1024];
            int size;
            for (int i = 0; i < THREAD_NUM; i++) {
                String tmpFile = localFile.getAbsolutePath() + "." + i + ".tmp";
                InputStream in = new FileInputStream(tmpFile);
                while ((size = in.read(buffer)) != -1) {
                    out.write(buffer, 0, size);
                }
                in.close();
                Files.delete(Paths.get(tmpFile));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //一个下载线程负责下载文件的某一部分，如果失败则自动重试，直到下载完成
    class DownloadThread extends Thread {
        private int id;
        private int start;
        private int end;
        private OutputStream out;

        public DownloadThread(int id, int start, int end) {
            this.id = id;
            this.start = start;
            this.end = end;
            aliveThreads.incrementAndGet();
        }

        //保证文件的该部分数据下载完成
        @Override
        public void run() {
            boolean success = false;
            while (true) {
                success = download();
                if (success) {
                    System.out.println("* Downloaded part " + (id + 1));
                    break;
                } else {
                    System.out.println("Retry to download part " + (id + 1));
                }
            }
            aliveThreads.decrementAndGet();
        }

        //下载文件指定范围的部分
        public boolean download() {
            try {
                HttpURLConnection con = (HttpURLConnection) url.openConnection();
                con.setRequestProperty("Range", String.format("bytes=%d-%d", start, end));
                con.setConnectTimeout(TIME_OUT);
                con.setReadTimeout(TIME_OUT);
                con.connect();
                int partSize = con.getHeaderFieldInt("Content-Length", -1);
                if (partSize != end - start + 1) return false;
                if (out == null) out = new FileOutputStream(localFile.getAbsolutePath() + "." + id + ".tmp");
                try (InputStream in = con.getInputStream()) {
                    byte[] buffer = new byte[1024];
                    int size;
                    while (start <= end && (size = in.read(buffer)) > 0) {
                        start += size;
                        downloadedBytes.addAndGet(size);
                        out.write(buffer, 0, size);
                        out.flush();
                    }
                    con.disconnect();
                    if (start <= end) return false;
                    else out.close();
                }
            } catch(SocketTimeoutException e) {
                System.out.println("Part " + (id + 1) + " Reading timeout.");
                return false;
            } catch (IOException e) {
                System.out.println("Part " + (id + 1) + " encountered error.");
                return false;
            }

            return true;
        }
    }

}
//https://github.com/wrayzheng/java-multithread-downloader
```

这里将 DownloadThread 定义为 HttpDownloader 的内部类，这是因为一个 HttpDownloader 实例对应一个文件下载任务，该实例中存放了该任务的各种数据，而下载线程是与该任务是关联的，需要用到这些数据，因此定义为内部类可以直接共享这些数据，从而避免过多的参数传递和存储。

要下载一个文件，首先创建一个 HttpDownloader 实例，必须传入的参数是目标文件 URL 和本地的存储位置，可选参数是线程数和超时时间。

HttpDownloader 的入口方法为 get()，它的工作如下：

- 调用 supportResumeDownload() 方法判断目标文件是否支持断点续传以及是否大于设定的文件最小值，以决定是否采取多线程的下载方式；
- 计算每一段的起止位置，存入 endPoint；
- 创建 DownloadThread 线程进行下载；
- 调用 startDownloadMonitor() 方法启动监视线程；
- 等待文件下载完毕；
- 调用 cleanTempFile() 处理临时文件；
- 输出结束信息。

再来介绍一下 DownloadThread，它的入口方法是 run()，工作如下：

- 调用 download() 方法下载指定部分的数据;
- 如果成功，则线程结束，如果失败，则回到上一步。

### 下载测试

对于单个连接限速的服务器，多线程下载才能体现其优势，如果服务器本身不对连接限速，那么单个连接也能接近带宽上限。

我们来看看，对于单个连接速度远小于带宽时，单线程与多线程的对比。

首先是单个线程进行下载：

![img](https://cdn.kayleh.top/gh/kayleh/cdn4/DOWNLOAD/downloader-one-threads.gif)

用时 54.133 秒，平均下载速度 42 KB/s。

开启 10 个线程进行下载：

![img](https://cdn.kayleh.top/gh/kayleh/cdn4/DOWNLOAD/downloader-ten-threads.gif)

用时 10.144 秒，平均下载速度 228 KB/s。

可以看到，相比单线程下载，开启多线程之后下载速度有了巨大的提升。

在实际下载时，根据网络状况不同，设置不同的超时时间，对下载速度也有不小的影响。如果超时时间设置过小，会导致线程频繁建立连接，而建立连接是相对耗时的操作，导致下载效率低下；如果超时时间设置过长，可能连接已经失效，而客户端却长时间等待，无谓地消耗时间。

### 结语

这是一个最基本的多线程下载器的实现，将文件划分为固定的 N 段，分配给 N 个线程下载，当一个线程下载完成后，该线程就随之结束了，没有被再次利用。

之后我会对该程序做进一步的优化，一方面会采取和 IDM 类似的下载策略，进一步提高下载效率，另一方面，也会在功能和鲁棒性方面进行加强，完善异常处理。
