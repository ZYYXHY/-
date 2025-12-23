//验证11位纯数字
function is11Digit(val){
    const reg = /^\d{11}$/;// 正则：开头到结尾必须是11个数字
    return reg.test(val);// 返回布尔值：符合返回true，否则false
}

// 显示错误提示（给提示元素赋值文案+显示样式）
function showError(tipId,msg){
    $(`#${tipId}`).text(msg).addClass('show');
}
// 隐藏错误提示（移除显示样式）
function hideError(tipId){
    $(`#${tipId}`).removeClass('show');
}



// ===============基础交互==============
$(function(){
//购物车点击→新开窗口打开购物车页面，.on()事件绑定方法
    $(document).on('click','.car',function(){
        window.open('cart.html','_blank');
    })
//导航栏“快速登录/注册”→切换到对应表单标签，function(e)：事件触发后的回调函数，e是事件对象
    $('.quick-login').click(function(e){
        e.preventDefault();
        $('.auth-tab[data-tab="login"]').click();//选中页面中类名为auth-tab且data-tab属性值为login的元素
    });
     $('.quick-register').click(function(e){
        e.preventDefault();
        $('.auth-tab[data-tab="register"]').click();
    });
//登录/注册标签切换→显示对应表单，隐藏另一个
    $(document).on('click','.auth-tab',function(){//页面中任何带有.auth-tab类的标签被点击时，都会触发后续的回调函数。
        const tab = $(this).data('tab');// 获取标签的data-tab属性（login/register）
        $('.auth-tab').removeClass('active');// 移除所有标签的激活样式
        $(this).addClass('active');// 给当前标签加激活样式
        if(tab==='login'){
            $('#login-form').show();
            $('#register-form').hide();
        }else{
            $('#login-form').hide();
            $('#register-form').show();
        }
    });
//切换表单底下a链接（“去注册”/“去登录”）→同上，切换标签
    $('.switch-to-register').click(function(e){
        e.preventDefault();
        $('.auth-tab[data-tab="register"]').click();
    });
    $('.switch-to-login').click(function(e){
        e.preventDefault();
        $('.auth-tab[data-tab="login"]').click();
    });
//忘记密码→弹出客服提示
    $('#forget-pwd').click(function(e){
        e.preventDefault();
        alert('请联系客服重置密码，客服电话：888-888-8888');
    });


     // ========== 表单实时验证 ==========
//登录账号验证（只保留数字+校验11位）
     $('#login-username').on('input blur',function(){
        const val = $(this).val().trim().replace(/\D/g,'');// 过滤非数字字符
        $(this).val(val);// 把过滤后的值回显到输入框
        if(val === ''){
            hideError('login-username-error');
            return;
        }
        if(!is11Digit(val)){// 非11位数字→显示错误
            showError('login-username-error','会员账号必须是11位数字！');
        }else{
            hideError('login-username-error');
        }
     });
//登录密码验证（非空校验）
     $('#login-password').on('input blur',function(){
        const val = $(this).val().trim();
        if(val === ''){
            showError('login-password-error','密码不能为空！');
        }else{
            hideError('login-password-error');
        }
     });
 //注册用户名验证（长度 2-10 位）
     $('#register-username').on('input blur',function(){
        const val = $(this).val().trim();
        if(val === ''){
            showError('register-username-error','用户名不能为空！');
            return;
        }
        if(val.length < 2 || val.length >10){
            showError('register-username-error','用户名长度需在2-10位之间！');
        }
        else{
            hideError('register-username-error');
        }
     });

// 注册密码验证 + 强度提示
     $('#register-password').on('input blur', function() {
        const val = $(this).val().trim();// 获取密码输入框的内容，去掉前后空格
        if (val === '') {  //空值校验：如果密码为空
             showError('register-password-error', '密码不能为空！');
             return;
        }
        if(val.length < 6){
            showError('register-password-error', '密码长度不能少于6位！');
        }else{
            hideError('register-password-error');
        }
     });

//注册会员账号验证（同登录账号，11 位数字）
     $('#register-member-id').on('input blur', function() {
        const val = $(this).val().trim().replace(/\D/g, ''); // 过滤非数字
        $(this).val(val);
        if(val === ''){
            showError('register-member-error', '会员账号不能为空！');
            return;
        }
        if(!is11Digit(val)){
            showError('register-member-error', '会员账号必须是11位纯数字！');
        }else{
            hideError('register-member-error');
        }
     });


// ================== 表单提交验证 =================
    // 登录表单提交
    $('#login-form').on('submit',function(e){
        e.preventDefault();// 阻止表单默认提交（核心，避免页面跳转）
        const username = $('#login-username').val().trim();
        const password = $('#login-password').val().trim();

    // 前置全量验证：有一个不通过则终止
    let isValid = true;
    if(!is11Digit(username)){
        showError('login-username-error', '会员账号必须是11位纯数字！');
        isValid = false;
    }
    if(password === ''){
        showError('login-password-error', '密码不能为空！');
        isValid = false;
    }
    if(!isValid) return;// 验证失败则终止

// 模拟登录请求（实际项目替换为AJAX/axios请求后端接口）
       $('#login-btn').prop('disabled', true).text('登录中...');// 禁用按钮防重复提交
       setTimeout(() =>{
        // 从本地存储读取注册的账号密码，模拟校验
        const savedRegAccount = localStorage.getItem('memberAccount');
        const savedRegPwd = localStorage.getItem('memberRegPwd');
        if(username === savedRegAccount && password === savedRegPwd){
             alert('登录成功!');
             window.location.href = 'index.html';// 跳转到首页
        }else{
            alert('账号或密码错误!');// 登录失败
            $('#login-btn').prop('disabled', false).text('登录');// 恢复按钮
        }
    },1000);// 模拟网络延迟1秒
    });

 //注册表单提交（模拟注册逻辑）
    $('#register-form').on('submit',function(e){
        e.preventDefault();
        // 获取所有注册表单字段值
        const username = $('#register-username').val().trim();
        const password = $('#register-password').val().trim();
        const memberId = $('#register-member-id').val().trim();
        // 前置全量验证
        let isValid = true;
        if (username.length < 2 || username.length > 10) {
            showError('register-username-error', '用户名长度需在2-10位之间！');
            isValid = false;
        }
        if (password.length < 6) {
            showError('register-password-error', '密码长度不能少于6位！');
             isValid = false;
        }
        if (!is11Digit(memberId)) {
            showError('register-member-error', '会员账号必须是11位纯数字！');
            isValid = false;
        }
        if(!isValid)return;
        
        // 模拟注册请求
        $('#register-btn').prop('disabled', true).text('注册中...');
        setTimeout(()=>{
             // 保存注册信息到本地存储（实际项目替换为后端接口）
            localStorage.setItem('memberAccount', memberId);
            localStorage.setItem('memberRegPwd', password);
            alert('注册成功！请登录');
            // 切回登录表单
            $('.auth-tab[data-tab="login"]').click();
            // 重置注册表单
            $('#register-form')[0].reset();
            $('#register-btn').prop('disabled', false).text('立即注册');
        },1000);
    });
});
