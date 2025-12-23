$(document).ready(function() {
    // 焦点图列表，定义一个数组images，存储所有轮播图的图片路径
    var images = [
        './images/banner/banner_1.jpg',
        './images/banner/banner_2.jpg',
        './images/banner/banner_3.jpg',
    ];
    var currentIndex = 0;//定义一个索引变量currentIndex，表示当前显示的轮播图在数组中的位置，0为第一张照片。
    
    // 左箭头_切换到上一个焦点图
    $('.prev').on('click', function(e) {//选择器找到页面中类名为prev的元素为其绑定点击事件，当点击左箭头时，执行内部的回调函数。
        e.preventDefault(); // 防止链接跳转
        //索引减 1，指向数组的上一个元素，+ images.length：防止索引变为负数（如当前是第 0 张，减 1 后为 - 1，加上数组长度 3，变为 2，
        // % images.length：取模运算，保证索引始终在0 ~ 数组长度-1范围内（如索引 3 取模 3 得 0，回到第一张）。
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        var imagePath = images[currentIndex];
        //attr('src', imagePath)修改<img>的src属性，将图片路径替换为新的路径，实现图片切换。
        $('#imageContainer img').attr('src', imagePath);//attr() 获取属性
    });
    
    // 右箭头_切换到下一个焦点图
    $('.next').on('click', function(e) {
        e.preventDefault(); // 防止链接跳转
        currentIndex = (currentIndex + 1) % images.length;
        var imagePath = images[currentIndex];
        $('#imageContainer img').attr('src', imagePath);
    });
});