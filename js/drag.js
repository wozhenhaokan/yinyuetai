(function (w) {
    w.fastFiguer = function (wrap,index,callBack) {
        var list = wrap.children[index];
        var minY = wrap.clientHeight - list.offsetHeight;
        // var startY = 0;
        var start = {};
        var elementY = 0;
        //橡皮筋系数
        var ratio = 1;
//				上一次的位置
        var lastPoint =0;
//				上一次的时间
        var lastTime = 0;
//				时间差   不能为0 一旦为0 第一次点击的时候，会出bug
        var timeV = 1;
//				位置差
        var pointV =0;
//				速度
        var Tween = {
            //模拟贝塞尔曲线实现回弹
            easeOut:function (t,b,c,d,s) {
                if(s==undefined)s=1.70158;
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
            },
            //模拟transtion的线性
            Linear: function(t,b,c,d){ return c*t/d + b; },

        };
        //防抖动
        var isY = true;
        var isFirst = true;
        wrap.addEventListener("touchstart",function(ev){
//					解决速度的残留
            pointV =0;
            timeV = 1;
            list.style.transition="none";

            var touch = ev.changedTouches[0];
            // startY = touch.clientY;
            start = {clientX:touch.clientX,clientY:touch.clientY};
            elementY = css(list,"translateY");

            lastPoint = start.clientY;
            lastTime = new Date().getTime();
            clearInterval(wrap.clear);
            //外部的touchstart逻辑
            if(callBack&&callBack['start']){
                callBack['start']
            }
        })
            isY = true;
            isFirst = true;

        wrap.addEventListener("touchmove",function(ev){
            if(!isY){
                return;
            }
            var touch = ev.changedTouches[0];
            // var nowY = touch.clientY;
            var now = touch;
            // var dis = nowY - startY;
            var disX　= now.clientX -start.clientX;
            var disY　= now.clientY -start.clientY;
            if(isFirst){
                isFirst = false;
                if(Math.abs(disX)>Math.abs(disY)){
                    isY=false;
                    return;
                }
            }
            var translateY=elementY+disY;
            //只有超出的时候，才存在橡皮筋效果
            if(translateY>0){
                //随着ul移动距离越来越大，整个ul移动距离的增幅越来越小
                ratio = document.documentElement.clientHeight/((document.documentElement.clientHeight+translateY)*1.8);
                translateY=translateY*ratio;
            }else if(translateY<minY){
                //右边的留白（正值）
                var over = minY - translateY;
                ratio = document.documentElement.clientHeight/((document.documentElement.clientHeight+over)*1.8);
                translateY=minY-(over*ratio);
            }

            var nowTime = new Date().getTime();
            var nowPoint = now.clientY;
            pointV = nowPoint - lastPoint;
            timeV = nowTime - lastTime;
            lastPoint = nowPoint;
            lastTime = nowTime;
            css(list,"translateY",translateY);

            //外部的touchsmove逻辑
            if(callBack&&callBack["move"]){
                callBack["move"]();
            }

        })

        wrap.addEventListener("touchend",function(){
            var speed = pointV/timeV;
            var addY = speed*200;
            var target= css(list,"translateY")+addY;
            // var bessel ="";
            var type = 'Linear';
            var time =0;
            time = Math.abs(speed)*0.3;
            time =time<0.3?0.3:time;

            if(target>0){
                target=0;
                // bessel="cubic-bezier(.65,1.49,.63,1.54)";
                type="easeOut";
            }else if(target<minY){
                target = minY;
                // bessel="cubic-bezier(.65,1.49,.63,1.54)";
                type="easeOut";
            }
            // list.style.transition=time+"s "+bessel;
            // css(list,"translateY",target);
            //抽象整个过渡过程
            move(target,time,type);
        })
        //move函数用来抽象整个自动滑屏的过程  ！！！怎么模拟transtion
        function move(target,time,type) {
            //		t :当前次数(t从1开始)
            //		b :初始位置
            //		c :目标位置与初始位置之间的差值
            //		d :总次数
            //		s :一般我们不改,它用来抽象回弹距离

            var t = 0;
            var b =css(list,'translateY');
            var c = target-b;
            var d = time/0.01;
            //开启循环定时器之前必须清除这个定时器
            //避免重复开启逻辑一样的定时器
            clearInterval(wrap.clear);
            wrap.clear = setInterval(function () {
                t++;
                if(t>d){
                    clearInterval(wrap.clear);
                    //外部的touchend逻辑
                    if(callBack&&callBack["end"]){
                        callBack["end"]();
                    }
                }else {
                    var dis = Tween[type](t,b,c,d);
                    //每一帧的运动  dis：每一帧的位置！！！由Twenn算法来提供
                    //每一帧的运动本质上没有消耗时间，而是登录20毫秒之后去触发队列里的下一个定时器
                    css(list,"translateY",dis);
                    if(callBack&&callBack["move"]){
                        callBack["move"]()
                    }
                }
            },20)

        }

    }

})(window)