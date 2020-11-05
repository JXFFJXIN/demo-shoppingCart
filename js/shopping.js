/*
	获取本地存储，选中商品的详细信息
		1、这个变量只有一个，别的地方也都有用，所以要在全局声明。
		2、这个变量的值要先去取本地存储，因为从第二次操作时候本地存储就已经有值了，这些值是要变成DOM展示出来的
		3、千万不能单声明一个空对象，那样的话再次添加的时候会清空已有的
		4、第一次取到的结果为null，所以做一个容错处理
		5
 */
/* 
	步骤：
	0.全局定义selectData={}；-商品信息缓存

	1.定义addEvent(){
		定义str为表格行tr
		循环调用action方法
		定义action(){
			**dom操作**
			定义tds为td
			定义img为tds[0].children[0]-商品图片
			定义imgSrc为img.getAttribute('src')-图片地址
			定义name为tds[1].children[0].innerHTML-名字
			定义colors为tds[1].children[1].children-颜色
			定义price为tds[2]-价格
			定义spans为tds[3].querySelectorALl('span')-+/-按钮
			定义strong为tds[3].querySelector('strong')-数量
			定义joinBtn为tds[4].children[0]
			定义slectNum为0需要修改的数据缓存

			**选项卡切换颜色和图片**
			定义last=null-上次选中的
			定义colorValue=''；-存储颜色
			定义colorId='';-存储商品id
			循环colors数组{
				给colors[i]添加index属性为i
				给colors[i]添加click事件{
					1/
					清空last.className
					注意last为null时候无法清空
					2/
					this.className为'active'
					3/
					colorValue = this.className?this.innerHTML:'';
					colorId = this.className?this.dataset.id:'';
					imaSrc = this.className?`images/img_0${n+1}-${this.index + 1}.png`:`images/img_0${n+1}-1.png`
					4/
					last指向this
				}
			}

			**+/-按钮**
			给spans[0]添加click事件{
				slectNum--；
				如果slectNum<0时slectNum为0

				strong添加HTML为slectNum
			}
			给spans[1]添加click事件{
				slectNum++；
				strong添加HTML为slectNum
			}

			**加入购物车按钮**
			给joinBtn添加click事件{
				判断！colorValue{
					//...
					return;--阻止代码继续往下走
				}
				判断！slectNum{
					//...
					retur;
				}

				**封装商品缓存**
				selectData[colorId] = {
					"id": colorId,	//用于删除的时候取到对应的数据
					"name": name,
					"color": colorValue,
					"price": parseFloat(price.innerHTML),
					"num": slectNum,
					"img": imgSrc,
					'time': new Date().getTime(),	//为了排序
				};

				**本地存储**
				localStorage.setItem('自定义词条名'，JSON.stringify(selectData))

				**还原属性**
				img.src = 'images/img_0' + (n + 1) + '-1.png';
				last.className = '';
				strong.innerHTML = slectNum = 0;

				**渲染**
				createSlectDom();
			}
		}
	}
	2. 定义createSelectDom{
		定义tbody为类名.selected tbody的dom
		定义str为'';
		定义goods为Object.value(selectData);
		//ES7里的，用来取对象里所有的value
		进行排序
		goods.sort(function(g1,g2){
			return g2.time-g1.time;
		})
		tbody清空innerHTML
		循环goods{
			拼接字符串
		}
		tbody.innerHTML赋值str

		运行del()
	}
	3. 定义init{
		取缓存
		selectData = JSON.parse(localStorage.getItem('shoppingCart')) || {};
		运行createSelectDom
		运行addEvent

	}
	4. 运行init
	5. 定义del{
		定义btns获取按钮
		定义tbody获取tbody

		循环btns{
			给btns[i]添加click事件{
				删除delete selectData[this.dataset.id];
				localStorage.setItem('shoppingCart',JSON.stringify(selectData));

				tbody.removeChild(this.parentNode.parentNode);
			}
		}
	}
	5. window.addEventListener('storage',init)
	// 这个事件当localstorage发生改变的时候就会触发。
	// 回调函数是在同域新页面运行

*/
var selectData={};
function init() {
	// var selectData={};
	selectData = JSON.parse(localStorage.getItem('shoppingCart')) || {};
	// console.log(selectData);
	createSelectDom();
	addEvent();
}
init();


//添加商品操作事件
function addEvent() {
	var trs = document.querySelectorAll(".product tr");			//表格行
	for (var i = 0; i < trs.length; i++) {
		action(trs[i],i);
	}

	//具体处理逻辑
	function action(tr,n) {
		var tds = tr.children,	//当前行里的td
			img = tds[0].children[0],	//商品图片	
			imgSrc = img.getAttribute('src'),	//商品图片地址
			name = tds[1].children[0].innerHTML,	//商品名称
			colors = tds[1].children[1].children,	//颜色按钮
			price = tds[2],		//单价（在第3个td里）
			spans = tds[3].querySelectorAll('span'),	//加减按钮（在第4个td里）
			strong = tds[3].querySelector('strong'),	//数量（一行只有一个）
			joinBtn = tds[4].children[0],	//加入购物车按钮
			slectNum = 0;

		//颜色按钮点击
		var last = null;
		var colorValue = '';
		var colorId = '';
		for (var i = 0; i < colors.length; i++) {
			colors[i].index = i;
			colors[i].onclick = function () {
				last && last != this && (last.className = '');

				this.className = this.className ? '' : 'active';	//
				colorValue = this.className ? this.innerHTML : '';
				colorId = this.className ? this.dataset.id : '';
				imgSrc = this.className ? 'images/img_0' + (n + 1) + '-' + (this.index + 1) + '.png' : 'images/img_0' + (n + 1) + '-1.png';	

				//更新图片地址
				img.src = imgSrc;

				//清空选中的数量
				strong.innerHTML = slectNum = 0;

				last = this;
			}
		}

		//减按钮点击功能
		spans[0].onclick = function () {
			slectNum--;
			if (slectNum < 0) {
				slectNum = 0;
			}

			strong.innerHTML = slectNum;
		};

		//加按钮点击功能
		spans[1].onclick = function () {
			slectNum++;

			strong.innerHTML = slectNum;
		};

		//加入购物车点击
		joinBtn.onclick = function () {
			if (!colorValue) {
				alert('请选颜色');
				return;
			}

			if (!slectNum) {
				alert('请添加购买数量');
				return;
			}

			selectData[colorId] = {
				"id": colorId,	//用于删除的时候取到对应的数据
				"name": name,
				"color": colorValue,
				"price": parseFloat(price.innerHTML),
				"num": slectNum,
				"img": imgSrc,
				'time': new Date().getTime(),	//为了排序
			};

			localStorage.setItem('shoppingCart', JSON.stringify(selectData));

			img.src = 'images/img_0' + (n + 1) + '-1.png';
			last.className = '';
			strong.innerHTML = slectNum = 0;

			createSelectDom();	//存储完就渲染购物车的商品结构
		};
	}
}


//创建购物车商品结构
function createSelectDom() {
	var tbody = document.querySelector('.selected tbody');
	var totalPrice = document.querySelector('.selected th strong');
	var str = '';
	var total = 0;	//共多少钱

	console.log(selectData);

	var goods = Object.values(selectData);
	console.log(goods);

	//排序，让后选的排在上面
	goods.sort(function (g1, g2) {
		return g2.time - g1.time;
	});

	tbody.innerHTML = '';	//先清空一下

	for (var i = 0; i < goods.length; i++) {
		str += '<tr>' +
			'<td>' +
			'<img src="' + goods[i].img + '" />' +
			'</td>' +
			'<td>' +
			'<p>' + goods[i].name + '</p>' +
			'</td>' +
			'<td>' + goods[i].color + '</td>' +
			'<td>' + goods[i].price * goods[i].num + '.00元</td>' +
			'<td>x' + goods[i].num + '</td>' +
			'<td><button data-id="' + goods[i].id + '">删除</button></td>' +
			'</tr >';

		total += goods[i].price * goods[i].num;
	}
	tbody.innerHTML = str;
	totalPrice.innerHTML = total + '.00元';

	del();
}

//删除功能
function del() {
	var btns = document.querySelectorAll('.selected tbody button');
	var tbody = document.querySelector('.selected tbody');

	for (var i = 0; i < btns.length; i++) {
		btns[i].onclick = function () {
			delete selectData[this.dataset.id];	//删除属性
			//console.log(selectData);

			localStorage.setItem('shoppingCart', JSON.stringify(selectData));	//更新本地存储

			tbody.removeChild(this.parentNode.parentNode);	//删除DOM结构

			//更新价格
			var totalPrice = document.querySelector('.selected th strong');
			totalPrice.innerHTML=parseFloat(totalPrice.innerHTML)-parseFloat(this.parentNode.parentNode.children[3].innerHTML)+'.00元';

		};
	}
}

window.addEventListener('storage', init);