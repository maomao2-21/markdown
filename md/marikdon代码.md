
**Preface:**  
Markdown 是一种轻量级标记语言，由 2004 年创建， markdown 编写的文档可导出为 HTML， Word， 图像，PDF，Epub 等多种格式的文档。  
markdown 文件后缀名为 .md, .markdown。

**目录:**

[1. 标题](#1)  
[2. 段落格式](#2)  
[3. 列表](#3)  
[4. 区块](#4)  
[5. 插入代码](#5)  
[6. 插入链接](#6)  
[7. 插入图片](#7)  
[8. 插入表格](#8)  
[9. 设置跳转](#9)

1. 标题
=====

**1. 示例语法:**

```
一级标题
=
二级标题
-
使用#可标记多级标题：
# 一级标题
## 二级标题
### 三级标题
```

**2. 显示效果：**

一级标题
====

二级标题
----

一级标题
====

二级标题
----

### 三级标题

2. 段落
=====

**1. 示例语法：**

```
*斜体文字*
**粗体文字**
***粗斜文字***
```

**2. 显示效果：**

_斜体文字_  
**粗体文字**  
_**粗斜文字**_

3. 列表
=====

**1. 示例语法：**

```
* 第一项
* 第二项
* 第三项


3. 第一项
    - 嵌套1
    - 嵌套2
    - 嵌套3
        - 嵌套套1
        - 套套2
        - 套套3
5. 第二项
6. 第三项
```

**2. 显示效果:**

*   第一项
*   第二项
*   第三项

3.  第一项
    *   嵌套 1
    *   嵌套 2
    *   嵌套 3
        *   嵌套套 1
        *   套套 2
        *   套套 3
4.  第二项
5.  第三项

4. 插入区块
=======

**1. 示例代码:**

```
* 第一项
    >巴拉巴拉巴拉
    >巴拉拉
 * 第二项
     >巴拉巴拉巴拉
     >巴拉巴拉巴拉
```

**2. 显示效果：**

*   第一项
    
    > 巴拉巴拉巴拉  
    > 巴拉拉
    
*   第二项
    
    > 巴拉巴拉巴拉  
    > 巴拉巴拉巴拉
    

5. 插入代码块
========

**示例插入 java 代码:**

```
···java （此处换成任意语言的名字，如python, csharp）
public static void main(String[] args) {
        HashSet<Circle> hashSet = new HashSet<>();
        TreeSet<Circle> treeSet = new TreeSet<>();
        
        for (int i = 1; i < 10; i++){
            hashSet.add(new Circle(i));
            treeSet.add(new Circle(i));
        }
		System.out.println("HashSet:");
        for (Circle circle : hashSet){
            System.out.println(circle);
        }
        System.out.println("TreeSet:");
        for (Circle circle : treeSet){
            System.out.println(circle);
        }
    }
···
```

**2. 显示效果：**

```
public static void main(String[] args) {
        HashSet<Circle> hashSet = new HashSet<>();
        TreeSet<Circle> treeSet = new TreeSet<>();
        
        for (int i = 1; i < 10; i++){
            hashSet.add(new Circle(i));
            treeSet.add(new Circle(i));
        }
		System.out.println("HashSet:");
        for (Circle circle : hashSet){
            System.out.println(circle);
        }
        System.out.println("TreeSet:");
        for (Circle circle : treeSet){
            System.out.println(circle);
        }
    }
```

6. 插入链接
=======

**1. 示例代码:**

```
我的博客链接: <https://blog.csdn.net/weixin_45967200/article/details/106743407>
```

**2. 显示效果:**  
我的博客链接: [https://blog.csdn.net/weixin_45967200/article/details/106743407](https://blog.csdn.net/weixin_45967200/article/details/106743407)

7. 插入图片 **
==========

**1. 示例代码**

```
![菜鸟教程](http://static.runoob.com/images/runoob-logo.png)
```

**2. 显示效果：**

![](https://imgconvert.csdnimg.cn/aHR0cDovL3N0YXRpYy5ydW5vb2IuY29tL2ltYWdlcy9ydW5vb2ItbG9nby5wbmc?x-oss-process=image/format,png)

8. 插入表格
=======

**1. 示例代码：**

```
| stu_name | stu_age | stu_address |
| ---- | ---- | ---- |
| 张钢蛋 |  18 | 火星 |
| 王铁锤 | 19 |  水星 |
| 李二丫 | 20 | 97星云 |
```

**2. 显示效果：**

<table><thead><tr><th>stu_name</th><th>stu_age</th><th>stu_address</th></tr></thead><tbody><tr><td>张钢蛋</td><td>18</td><td>火星</td></tr><tr><td>王铁锤</td><td>19</td><td>水星</td></tr><tr><td>李二丫</td><td>20</td><td>97 星云</td></tr></tbody></table>

9. 设置跳转
=======

1.  示例代码:

```
<a href =  "#1" target= "_self">1. 标题</a>
<h1 id = "1" >1.标题</h1>
```

2.  显示效果：

[1. 标题](#1) （点击此将会跳转到 1. 标题 )，这是因为标题 设置了 id 属性 为 1