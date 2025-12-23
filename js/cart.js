function renderCart(){//renderCart函数名，()函数体
    // 1. 读取本地存储的购物车数据（无则为空数组）
    const cartList = JSON.parse(localStorage.getItem('cartList')) || [];//localStorage.getItem('cartList')从本地存储中获取键为 cartList 的数据（这是图书选购页添加商品时存入的购物车数据）关闭浏览器后数据不丢失。
    const $tbody = $('#cart-tbody');//const声明常量的关键字，$tbody：变量名，用 $ 开头表示该变量是 jQuery 获取的 DOM 元素对象，$()选择器

//购物车为空时的提示
if (cartList.length === 0) {//cartList.length：获取数组的长度，即购物车中商品的数量
	$tbody.html(`
		<tr>
			<td colspan="6" style="text-align:center; padding:30px; color:#999; font-size:16px;">
				🛒 购物车空空如也~<br>快去<a href="pink.html" style="color:orange;">图书选购页</a>添加商品吧！
			</td>
		</tr>
	`);
	// 清空统计数据
	$('.amount-sum em').text(0);// 清空总数量
	$('.price-sum em').text('￥0.00');// 清空总价
	return;
}

// 3. 购物车有商品：拼接商品行HTML
let trHtml = '';//声明变量trHtml，用于拼接所有商品行的HTML字符串，初始值为空
cartList.forEach(goods => {//cartList.forEach()数组的遍历方法，依次遍历 cartList 中的每个商品对象。

    const subtotal = (Number(goods.price) * goods.num).toFixed(2); //Number()：将字符串类型的单价转换为数字类型，toFixed(n)是将数字保留 n 位小数，并转换为字符串类型。

    trHtml += `
		<tr class="cart-item" data-id="${goods.id}">

			<td> <input type="checkbox" class="good-checked" checked> </td>
			<td>  <!-- 商品图片+名称 -->
				<div class="goods">
					<img src="${goods.img}" style="width:80px; border-radius:4px;">
					<div>
						<p class="name ellipsis">${goods.name}</p>
					</div>
				</div>
			</td>

			<td class="tc p-price">￥${goods.price}</td>  <!-- 单价 -->

			<td class="tc p-num"> <!-- 数量增减控件 -->
				<div class="wrap-input">
					<a class="btn-reduce">-</a> <!--数量减按钮-->
					<input class="text quantity-text buy-num" value="${goods.num}"> <!--数量输入框-->
					<a class="btn-add">+</a> <!--数量增按钮-->
				</div>
			</td>

			<td class="tc p-sum">￥${subtotal}</td>  <!-- 小计 -->
			<td class="tc p-action"> <a class="del-goods">删除</a> </td> <!-- 删除按钮 -->
		</tr>
	`;
})
$tbody.html(trHtml); // 将拼接好的所有商品行HTML插入tbody，完成商品列表渲染
calcTotal();// 渲染后计算总价/总数量
}

//计算选中商品的总数量、总价，并同步全选框状态。
function calcTotal(){
	const cartList = JSON.parse(localStorage.getItem('cartList')) || [];
	const $checkedItems = $('.cart-item:has(.good-checked:checked)');//:has(.good-checked:checked包含（:has）被勾选（:checked）的类名为 good-checked 的元素
	let totalNum = 0;   // 初始值 0，用于存储 选中商品的总数量
	let totalPrice = 0; // 选中商品总价

	// 遍历选中的商品,右侧小计
	$checkedItems.each(function() {//function() 是遍历的回调函数，每次遍历都会执行，this 指向当前遍历到的 “商品行”（cart-item 元素）。
		const goodsId = $(this).data('id');// 获取商品ID,.data('id')：读取当前商品行上存储的 data-id 属性值（商品 ID）；
		const currentGoods = cartList.find(item => item.id === goodsId);// item => item.id === goodsId：箭头函数，意思是 “数组中的元素（商品）的 id 属性，等于当前商品行的 goodsId（即匹配同一个商品）
		if (currentGoods) {
			totalNum += currentGoods.num;
			totalPrice += Number(currentGoods.price) * currentGoods.num;
		}
	});


	//更新页面显示，.text(...)：将拼接后的字符串设置为总价显示区域的文本。
	$('.amount-sum em').text(totalNum);
	$('.price-sum em').text(`￥${totalPrice.toFixed(2)}`);

	// 同步全选框：所有商品都选中 → 勾选全选
	const $allCheck = $('#checkAll');
	//$('.good-checked').length：页面上所有 “单个商品勾选框” 的总数，
	//$checkedItems.length：当前选中的商品行个数（即用户勾选的商品个数）
	$allCheck.prop('checked', $('.good-checked').length === $checkedItems.length);
}


//减少数量
//$(document)事件绑定的 “容器”，.on('click', 选择器, 回调函数)，click点击事件
$(document).on('click', '.btn-reduce', function(){
	//$(this)：当前点击的 “减少按钮”.closest('.cart-item'）从当前元素（按钮）往上查找 “最近的、类名为 cart-item 的父元素”
	//也就是按钮所在的 “商品行”，因为按钮是商品行里的子元素
	const goodsId = $(this).closest('.cart-item').data('id');// 找到当前商品行的ID
	let cartList = JSON.parse(localStorage.getItem('cartList')) || [];
	const currentGoods = cartList.find(item => item.id === goodsId);//匹配购物车中当前商品的数据
	if(currentGoods.num <= 1) return; // 数量不能小于1
	currentGoods.num--;//数量-1并保存
	localStorage.setItem('cartList', JSON.stringify(cartList));//保存更新后的数据到本地存储
	renderCart()//重新渲染购物车
});
// 增加数量
$(document).on('click', '.btn-add', function() {
	const goodsId = $(this).closest('.cart-item').data('id');
	let cartList = JSON.parse(localStorage.getItem('cartList')) || [];
	const currentGoods = cartList.find(item => item.id === goodsId);
	currentGoods.num++;// 数量+1并保存
	localStorage.setItem('cartList', JSON.stringify(cartList));
	renderCart();// 重新渲染购物车
});



//删除商品
$(document).on('click', '.del-goods', function(){
	//confirm('提示文字')：浏览器内置的确认对话框函数，弹出一个带有 “确定” 和 “取消” 按钮的弹窗
	if(!confirm('确定要删除该商品吗？')) return;
	const goodsId = $(this).closest('.cart-item').data('id');
	let cartList = JSON.parse(localStorage.getItem('cartList')) || [];
	//cartList.filter(...)：数组的 filter 方法（过滤函数），遍历数组并返回 “满足条件的元素组成的新数组”；
	//条件 item => item.id !== goodsId：箭头函数，意思是 “保留数组中 id 不等于当前商品 ID（goodsId）的元素”—— 也就是过滤掉要删除的商品（id 相等的元素被排除）
	cartList = cartList.filter(item => item.id !== goodsId); // 过滤掉要删除的商品
	localStorage.setItem('cartList',JSON.stringify(cartList));//保存修改后的数据
	renderCart();//重新渲染购物车
});


// 全选框变化：同步所有商品复选框，.on('change', ...)：绑定“变化事件”（change 事件：复选框从 “勾选” 变 “未勾选”，或反之，都会触发）；
$(document).on('change','#checkAll',function(){
	const isChecked = $(this).prop('checked');
	$('.good-checked').prop('checked',isChecked);//同步所以商品的勾选状态
	calcTotal();//重新计算总价
})
//单个商品勾选状态
$(document).on('change','.good-checked',function(){
	calcTotal();
});


// 页面DOM加载完成后，自动调用renderCart渲染购物车
$(function() {
				renderCart();
});


// 下单结算
$(document).on('click','.settlement',function(){
	const totalNum = $('.amount-sum em').text();
	if(totalNum==0){//无商品时提示
		alert('请先选择商品再结算！');
		return;
	}
	// 1. 提示下单成功
	alert('下单成功！');
	// 2. 获取已选中的商品ID，从购物车中移除
	let cartList = JSON.parse(localStorage.getItem('cartList')) || [];
	const $checkedItems = $('.cart-item:has(.good-checked:checked)'); // 选中的商品行
	const checkedGoodsIds = $checkedItems.map(function() {
		return $(this).data('id'); // 提取选中商品的ID
	}).get(); // 转为普通数组
	// 3. 过滤掉已选中的商品（保留未选中的）
	cartList = cartList.filter(item => !checkedGoodsIds.includes(item.id));	
	// 4. 保存修改后的购物车数据到本地存储
	localStorage.setItem('cartList', JSON.stringify(cartList));	
	// 5. 重新渲染购物车（此时已选商品会被清空）
	renderCart();
});