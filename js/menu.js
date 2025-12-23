// 等待页面DOM完全加载后执行
$(document).ready(function() {
    // 1. 鼠标移入主菜单（如“首页”“在线视频”）
    $('.nav > ul > li').mouseenter(function() {
        // 找到当前主菜单下的子菜单.sub-menu，停止之前的动画，淡入显示（300毫秒动画时长）
        $(this).find('.sub-menu').stop(true, true).fadeIn(300);
    });

    // 2. 鼠标移出主菜单
    $('.nav > ul > li').mouseleave(function() {
        // 找到当前主菜单下的子菜单.sub-menu，停止之前的动画，淡出隐藏
        $(this).find('.sub-menu').stop(true, true).fadeOut(300);
    });
});