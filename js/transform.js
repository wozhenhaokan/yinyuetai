//工具类
(function(w){
	w.css=function (obj,name,value){
			
			if(!obj.transform){
					obj.transform={};
				}
			
			if(arguments.length>2){
				var result = "";
				obj.transform[name]=value;
				for(item in obj.transform){
					//for in 会遍历原型链
					switch (item){
						case "rotate":
						case "skewX":
						case "skewY":
						case "skew":
							result +=item+"("+obj.transform[item]+"deg) ";
							break;
							
						case "translateX":
						case "translateY":
						case "translate":
							result +=item+"("+obj.transform[item]+"px) ";
							break;
							
						case "scale":
						case "scaleX":
						case "scaleY":
							result +=item+"("+obj.transform[item]+") ";
							break;
					}
					
				}
				obj.style.WebkitTransform=obj.style.transform=result;
				
			}else if(arguments.length==2){
				value = obj.transform[name];
				
				if(typeof value == "undefined"){
					if(name=="scale"||name=="scaleX"||name=="scaleY"){
						return 1;
					}else{
						return 0;
					}
				}
				
				return value;
			}
		}
		//快速竖向滑屏
	}
)(window)
