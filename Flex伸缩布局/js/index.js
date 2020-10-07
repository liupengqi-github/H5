//1.获取元素
var focus = document.querySelector('.focus')
var ul = focus.children[0];
var ol = focus.children[1];
//获取盒子的宽度，每次移动盒子的宽度就可以
var focusWidth = focus.offsetWidth;
//声明一个变量来代表它的索引号，让我们的索引号 * 图片的宽度，每次执行定时器让它++就可以了
var index = 0;
//2.利用定时器自动轮播图片
var timer = setInterval(function () {
    index++;
    var translateX = -index * focusWidth;
    //更牛逼的来了，我们都不用JS的动画了，直接用CSS3的过渡效果就可以了,所以就去他妈的封装动画函数
    ul.style.transition = 'all .3s';
    //移动端的牛逼之处：直接使用我们CSS3的transform来进行移动X轴就可以，反正它也不用left值来移动
    ul.style.transform = 'translateX('+ translateX +'px)'
},2000);
//3.等我们的动画完成之后再去判断，所以就用到我们的动画监听事件 transitionend
ul.addEventListener('transitionend',function () {   //我们判断条件是要等到图片滚动完毕再去判断，就是过渡完成后判断(每过渡一次，就监听一次)
    if (index >= 3) {   //如果我们的index>=3，就说明走到最后一张，我们就复原为0，继续走，但是要无缝滚动，再跳回来的时候把动画清除掉，然后把新的index值写上，重新移动就可以了
        index = 0;      //只要大于等于3，就复原为0
        //然后走到最后一张，我们取消动画效果，让它无缝滚动
        ul.style.transition = 'none';   //去掉过渡1，然后移动
        //利用最新的索引号 * 宽度  去滚动图片
        var translateX = -index * focusWidth;
        ul.style.transform = 'translateX('+ translateX +'px)'
    } else if (index < 0) {
        index = 2;
        ul.style.transition = 'none';   //去掉过渡1，然后移动
        //利用最新的索引号 * 宽度  去滚动图片
        var translateX = -index * focusWidth;
        ul.style.transform = 'translateX('+ translateX +'px)'
    }
    //4.小圆点跟随变化
    //首先我们的小圆圈跟随变化要放到监听过渡完成之后里面，让过渡完成再切换
    //H5新特性方法，先干掉所有人,也就是把ol里面li带有current类名的选出来去掉类名（选取里面的current，然后给它去掉就可以了）
    ol.querySelector('.current').classList.remove('current')
    //让当前索引号的小li加上current add   （把索引号赋给我们的小li，让小li的类名跟随索引号一起变化）
    ol.children[index].classList.add('current')
})
//5.移动端独有：手指拖动轮播图
var startX = 0;   //声明全局变量，一会需要调用进行计算的
var moveX = 0;   //后面我们会使用这个移动距离所以要定义一个全局变量
var flag = false;
//①触摸元素touchstart：获取手指初始坐标
ul.addEventListener('touchstart',function (e) {
    startX = e.targetTouches[0].pageX
    //别忘了我们滑动盒子的时候把自动播放给关了，不然我滑了它还在播放呢
    clearInterval(timer)
})
//②移动手指touchmove 计算手指的滑动距离，并且移动盒子
ul.addEventListener('touchmove',function (e) {
    //计算盒子距离
    moveX = e.targetTouches[0].pageX - startX;
    //移动盒子 ：  盒子原来的位置 + 手指移动的距离
    var translateX = -index * focusWidth + moveX;
    //手指拖动的时候，不需要动画效果所以要取消过渡效果
    ul.style.transition = 'none';
    ul.style.transform = 'translateX('+ translateX +'px)'
    //只要你手指移动过了，我才让你去重新计算
    flag = true   //如果用户手指移动过再去判断，否则不做效果
    e.preventDefault();   //取消滚动屏幕默认行为
})
//③离开手指touchend，根据滑动的距离分不同的情况
ul.addEventListener('touchend',function (e) {
    if (flag) {  //最一开始定义全局变量是false，只有我们滑动了才是true，这样就不会出现，用户手指点了再松开出现滑动图片的效果了
        //（1）如果移动距离大于50px，就上一张下一张滑动
        if (Math.abs(moveX) > 50) {   //Math.abs：绝对值，因为左滑出现负数，不能进行判断大于50px，滚动到下一张（先把moveX滑动距离进行绝对值，再比较）
            //如果是右滑就是播放上一张 moveX是正值
            if (moveX > 0) {   //外面判断你大于50px，里面判断是左滑动还是右滑动
                index--;
                //如果左滑就是播放下一张，moveX是负值
            } else {
                index++;
            }
            var translateX = -index * focusWidth + moveX;
            ul.style.transition = 'all .3s';
            ul.style.transform = 'translateX('+ translateX +'px)'
        } else {
            //② 如果移动距离小于50px我们就回弹
            var translateX = -index * focusWidth;
            ul.style.transition = 'all .3s';
            ul.style.transform = 'translateX('+ translateX +'px)'
        }
    }
    //手指离开的时候就重新开启定时器
    clearInterval(timer)    //先去清除定时器，在开启的时候我们就能保证有一个定时器运行
    timer = setInterval(function () {
        index++;
        var translateX = -index * focusWidth;
        //更牛逼的来了，我们都不用JS的动画了，直接用CSS3的过渡效果就可以了,所以就去他妈的封装动画函数
        ul.style.transition = 'all .3s';
        //移动端的牛逼之处：直接使用我们CSS3的transform来进行移动X轴就可以，反正它也不用left值来移动
        ul.style.transform = 'translateX('+ translateX +'px)'
    },2000);
})

//返回顶部
var goBack = document.querySelector('.goBack')
var nav = document.querySelector('nav')
document.addEventListener('scroll',function () {
    if (window.pageYOffset >= nav.offsetTop) {   //如果我们的页面卷去的头部大于等于nav盒子的头部就显示，否则就隐藏
        goBack.style.display = 'block'
    } else {
        goBack.style.display = 'none'
    }
});
//click延时解决方案（所以在移动端我点了一下，它会有300毫秒才会反应过来，这就有一种延迟，卡顿的感觉）
//移动端click事件会有300ms的延时，原因是移动端屏幕双击会缩放(double to zoom)页面，也就是单击一下它会等300毫秒，如果你不再点击就代表你要做单击事件，如果你点击了，就是进行缩放屏幕
//解决方案1：就是在视口标签加上不允许用户缩放（浏览器禁用默认的双击缩放行为并且去掉300毫秒的点击延时）
goBack.addEventListener('click',function () {
    window.scroll(0,0)   //我们点击了顶部按钮，直接跳到页面最顶部
})
//解决方案2：如果有的时候用户想缩放页面来看呢？那只能自己去封装一个函数（了解即可）
//原理：1.当我们手指触摸屏幕，记录当前触摸时间
//2.当我们手指离开屏幕，用离开的时间 - 触摸的时间
//3.如果时间小于150毫秒，并且没有滑动过屏幕，那么我们就定义为点击
//封装 tap、解决click 300ms延时
function tap(obj,callback) {
    var isMove = false;
    var startTime = 0;   //记录触摸时候的事件变量
    obj.addEventListener('touchstart',function (e) {
        startTime = Date.now(); //记录触摸时间
    })
    obj.addEventListener('touchmove',function (e) {
        isMove = true;   //看看是否有滑动，有滑动算拖拽，不算点击
    })
    obj.addEventListener('touchend',function (e) {
        if (!isMove && (Date.now() - startTime) < 150) {   // 逻辑中断运算符，如果手指触摸和离开事件小于150毫秒 算点击
            callback && callback();   //执行回调函数
        }
        isMove = false; //取反重置
        startTime = 0;
    })
}
//调用
// tap(div,function () {
//     //执行代码
// })