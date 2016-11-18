var body = document.querySelector('body');
var box = document.querySelector('.box');//容器dom
var scrollBar = document.querySelector('.scrollBar');//滚动条dom
var item = document.querySelectorAll('.item');//当满足条件的时候才
var addBtn = document.querySelector('.addBtn');
var mousePositionY1,//鼠标按下时clientY的值
	mousePositionY2,//鼠标移动时clientY的值
	mouseMoveDistance,//鼠标移动的距离
	scrollPositionStart;//拖动滚动条时，滚动条的起始top
var scrollBarMaxLimit = box.clientHeight - scrollBar.offsetHeight;//滚动条top的最大值
var mouseWheelUnit = 5;//滚轮滑动滚动条移动的最小单位
var contentMoveTotel = item.length*item[0].offsetHeight - box.clientHeight;
var scrollRatio = contentMoveTotel/scrollBarMaxLimit;
//鼠标滑轮逻辑
box.addEventListener('mousewheel',function(e){//要阻止冒泡，页面的大滚动条也会变化。这个只阻止默认事件就可以了。
	e.stopPropagation();
	e.preventDefault();
	if(e.deltaY > 0){//这个防抖动不能直接照抄了，滚轮滑动有两个方向
		scrollBar.style.top =((Number((scrollBar.style.top).replace('px','')) + mouseWheelUnit) <= scrollBarMaxLimit)?Number((scrollBar.style.top).replace('px','')) + mouseWheelUnit + 'px':scrollBar.style.top = scrollBarMaxLimit + 'px';
		contentScroll();
	} else {//先绝对值在取负值可以
		scrollBar.style.top = (0 <= (Number((scrollBar.style.top).replace('px','')) - mouseWheelUnit))?Number((scrollBar.style.top).replace('px','')) + -mouseWheelUnit + 'px':0 + 'px';
		contentScroll();
	}
},false);

//滚动条逻辑
scrollBar.addEventListener('mousedown',function(e){
	mousePositionY1 = e.clientY;
	scrollPositionStart = Number((scrollBar.style.top).replace('px',''));
	body.addEventListener('mousemove',scrollBarMove,false);
},false);
// scrollBar.addEventListener('mouseup',function(e){
// 	body.removeEventListener('mousemove',scrollBarMove,false);
// },false);
// body.addEventListener('mouseup',function(e){
// 	body.removeEventListener('mousemove',scrollBarMove,false);
// },false);
window.addEventListener('mouseup',function(e){//鼠标超出浏览器放开也没事
	body.removeEventListener('mousemove',scrollBarMove,false);
},false);

//滚动条移动函数
function scrollBarMove(e){
	mousePositionY2 = e.clientY;
	mouseMoveDistance =mousePositionY2 - mousePositionY1;//初始点 + 移动距离 --> 新的位置;初始点应该是滚动条的top不是位置1
	if(((scrollPositionStart + mouseMoveDistance)<=scrollBarMaxLimit)&&(0<=(scrollPositionStart + mouseMoveDistance))){
		scrollBar.style.top = scrollPositionStart + mouseMoveDistance + 'px';
		contentScroll();
	} else if((scrollPositionStart + mouseMoveDistance) > scrollBarMaxLimit){//先检查，后赋值，防止乱跳。但是滑动幅度大的话，就没有赋值。到不了头
		scrollBar.style.top = scrollBarMaxLimit + 'px';
		contentScroll();
	} else {
		scrollBar.style.top = 0 + 'px';
		contentScroll();
	}
}

//内容滚动的函数
function contentScroll(){
	item[0].style.marginTop = -Number((scrollBar.style.top).replace('px',''))*scrollRatio + 'px';
}

addBtn.addEventListener('click',function(){
	AddNewItem();
},false);

//添加dom
function AddNewItem(){
	var newItem = document.createElement('div');
	newItem.className = 'item';
	newItem.innerText = '0';
	box.insertBefore(newItem,item[2]);
	newDomRefresh();
}

function newDomRefresh(){//添加新dom之后
	item = document.querySelectorAll('.item');
	contentMoveTotel = item.length*item[0].offsetHeight - box.clientHeight;
	scrollRatio = contentMoveTotel/scrollBarMaxLimit;
}

//scrollBar.style.top一开始是空字符串
//parseInt('')是NaN
//Number('')是0
//NaN与NaN不相等
//parseInt('35px') --> 35
//Number('35px') --> NaN
//scrollBar.style.top = Number((scrollBar.style.top).replace('px','')) + Number(mouseMoveDistance) + 'px';
//阻止默认事件，与阻止冒泡
//
//看了看面试题，看来以后找工作需要刷面试题了啊。
//特定区域自己写，大的其他的还是使用插件好了。
//
//
////鼠标滑轮逻辑  旧代码
// var scrollTopNum = box.addEventListener('mousewheel',function(e){//要阻止冒泡，页面的大滚动条也会变化。这个只阻止默认事件就可以了。
// 	e.stopPropagation();
// 	e.preventDefault();
// 	if(e.deltaY > 0){//这个防抖动不能直接照抄了，滚轮滑动有两个方向
// 		if((Number((scrollBar.style.top).replace('px','')) + mouseWheelUnit) <= scrollBarMaxLimit){
// 			scrollBar.style.top = Number((scrollBar.style.top).replace('px','')) + mouseWheelUnit + 'px';
// 		} else {
// 			scrollBar.style.top = scrollBarMaxLimit + 'px';
// 		}
// 	} else {//先绝对值在取负值可以
// 		if(0 <= (Number((scrollBar.style.top).replace('px','')) - mouseWheelUnit)){
// 			scrollBar.style.top = Number((scrollBar.style.top).replace('px','')) + -mouseWheelUnit + 'px';
// 		} else {
// 			scrollBar.style.top = 0 + 'px';
// 		}
// 	}
// },false);
// bug:当box的scrollTop变化的时候，绝对定位的进度条会跑。。。换个属性好了。


//初步完成，接下来：
//	1.封装成对象
//	2.与项目结合