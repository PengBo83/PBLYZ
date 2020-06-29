//自定义指令v-focus，使Vue组件自动获得焦点
Vue.directive('focus', {
	inserted:function (el) {
		//聚焦元素
		el.focus();
	}
});
//取浏览器的当前日期时间，以2020-02-02 12:02:02的形式显示
//该函数在本项目中没有用到
// function currentTime()  
// {   
//     var now = new Date();  
//          
//     var year = now.getFullYear();       //年  
//     var month = now.getMonth() + 1;     //月  
//     var day = now.getDate();            //日  
//          
//     var hh = now.getHours();            //时  
//     var mm = now.getMinutes();          //分  
//     var ss=now.getSeconds();            //秒  
//          
//     var clock = year + "-";  
//          
//     if(month < 10) clock += "0";         
//     clock += month + "-";  
//          
//     if(day < 10) clock += "0";   
//     clock += day + " ";  
//          
//     if(hh < 10) clock += "0";  
//     clock += hh + ":";  
//   
//     if (mm < 10) clock += '0';   
//     clock += mm+ ":";  
//           
//     if (ss < 10) clock += '0';   
//     clock += ss;  
//   
//     return(clock);   
// }