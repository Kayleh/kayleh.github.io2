---
title: SpringMVC@ModelAttribute的使用
tags: [frame]
categories: [SpringMVC]
translate_title: use-of-springmvcmodelattribute
date: 2020-04-19T21:04:07+08:00
---

## @ModelAttribute？

<!-- more -->

@ModelAttribute的原理比较复杂，需要对源码有一定的理解。它可以使被

@ModelAttribute修饰的方法在控制器的处理方法之前调用。
但如果@ModelAttribute标注在方法的入参前，它可以从隐含对象中获取隐含的模型数据中获取对象，再将请求参数绑定到对象中，再传入入参。

---

### 实际场景：

Spring在进行数据库update全字段更新操作提交表单的时候，从页面获取的数据会封装成一个new的pojo对象，没有带的值为null；所以我们只能更新我们提交的数据。ModelAttribute暂时保存表单pojo对象，覆盖数据库保存的pojo对象的数据即可。




``` bash
ModelAttribute提前与目标方法运行
/**
 * @author Kayleh
 */
@Controller
public class ModelAttributeTest {
  
  @RequestMapping("/update")
  public String update(){     
    System.out.println("页面update的bean对象："+bean);  
  }
  @ModelAttribute
  public void modelAttribute(){     
    System.out.println("ModelAttribute调用了...");  
  }


===========输出=========
ModelAttribute调用了...
页面update的bean对象：bean{......}
```

###### 可以得出：ModelAttribute标注的方法总会在目标方法(update)前执行。


### ModelAttribute可以取出隐含对象的值

``` bash
@ModelAttribute
  public void TestModelAttribute(Map<String, Object> map){
    
    POJO pojo = new POJO("kayleh", 1104);
    map.put("value",pojo);
    System.out.println("modelAttribute方法...);
  }
@RequestMapping("/updateBook")
  public String updateBook(@RequestParam(value="author")String author,
      Map<String, Object> model,
      HttpServletRequest request,
      @ModelAttribute("value")POJO pojo
      ){
   
    System.out.println(pojo);
    return "ok";
  }
```

 @ModelAttribute("value")这里如果指定的"value",value就是从map取出参数的key.如果是@ModelAttribute,没有指定key,SpringMVC会默认使用返回值类型的首字母小写作为key.如pOJO.

