// JavaScript Document
$(document).ready(function() { 
	$("#prefix h1").mouseover(function(){
		$("#prefix h1").css("color","#AAA");
	});
	$("#prefix h1").click(function(){
	    location.href='index2.php';	
	});
	$("#prefix h1").mouseout(function(){
		$("#prefix h1").css("color","#FFF");	
	});

	$("#leftfix .l1").mouseover(function(){
		$("#leftfix .l1").css("background","#DDD");
		$("#leftfix .l1 a").css("color","#000");
	});
	$("#leftfix .l1").click(function(){
	    location.href='index2.php?aa=1';
	});
	$("#leftfix .l1").mouseout(function(){
		$("#leftfix .l1").css("background","#133281");
		$("#leftfix .l1 a").css("color","#FFF");		
	});
	$("#leftfix .l2").mouseover(function(){
		$("#leftfix .l2").css("background","#DDD");
		$("#leftfix .l2 a").css("color","#000");
	});
	$("#leftfix .l2").click(function(){
	    location.href='index2.php?aa=2';
	});
	$("#leftfix .l2").mouseout(function(){
		$("#leftfix .l2").css("background","#133281");
		$("#leftfix .l2 a").css("color","#FFF");		
	});
	$("#leftfix .l3").mouseover(function(){
		$("#leftfix .l3").css("background","#DDD");
		$("#leftfix .l3 a").css("color","#000");
	});
	$("#leftfix .l3").click(function(){
	    location.href='index.php';
	});
	$("#leftfix .l3").mouseout(function(){
		$("#leftfix .l3").css("background","#133281");
		$("#leftfix .l3 a").css("color","#FFF");		
	});
	$("#leftfix .l4").mouseover(function(){
		$("#leftfix .l4").css("background","#DDD");
		$("#leftfix .l4 a").css("color","#000");
	});
	$("#leftfix .l4").click(function(){
	    location.href='index2.php';
	});
	$("#leftfix .l4").mouseout(function(){
		$("#leftfix .l4").css("background","#133281");
		$("#leftfix .l4 a").css("color","#FFF");		
	});
	$("#leftfix .files").mouseover(function(){
		$("#leftfix .files").css("background","#DDD");
		$("#leftfix .files a").css("color","#000");
	});
	$("#leftfix .files").click(function(){
	    location.href='index2.php?aa=4';
	});
	$("#leftfix .files").mouseout(function(){
		$("#leftfix .files").css("background","#133281");
		$("#leftfix .files a").css("color","#FFF");		
	});
	$("#leftfix .M").mouseover(function(){
		$("#leftfix .M").css("background","#DDD");
		$("#leftfix .M a").css("color","#000");
	});
	$("#leftfix .M").click(function(){
	    location.href='index2SQL.php?aa=ad';
	});
	$("#leftfix .M").mouseout(function(){
		$("#leftfix .M").css("background","#133281");
		$("#leftfix .M a").css("color","#FFF");		
	});
	$("#leftfix .call").mouseover(function(){
		$("#leftfix .call").css("background","#DDD");
		$("#leftfix .call a").css("color","#000");
	});
	$("#leftfix .call").click(function(){
	    location.href='index2.php?aa=5';
	});
	$("#leftfix .call").mouseout(function(){
		$("#leftfix .call").css("background","#133281");
		$("#leftfix .call a").css("color","#FFF");		
	});
	$("#leftfix .member").mouseover(function(){
		$("#leftfix .member").css("background","#DDD");
		$("#leftfix .member a").css("color","#000");
	});
	$("#leftfix .member").click(function(){
	    location.href='index2SQL.php?aa=66';
	});
	$("#leftfix .member").mouseout(function(){
		$("#leftfix .member").css("background","#133281");
		$("#leftfix .member a").css("color","#FFF");		
	});
	$("#leftfix .webs").mouseover(function(){
		$("#leftfix .webs").css("background","#DDD");
		$("#leftfix .webs a").css("color","#000");
	});
	$("#leftfix .webs").click(function(){
	    location.href='index2SQL.php?aa=7';
	});
	$("#leftfix .webs").mouseout(function(){
		$("#leftfix .webs").css("background","#133281");
		$("#leftfix .webs a").css("color","#FFF");		
	});
	$("#leftfix ._mails").mouseover(function(){
		$("#leftfix ._mails").css("background","#DDD");
		$("#leftfix ._mails a").css("color","#000");
	});
	$("#leftfix ._mails").click(function(){
	    location.href='index2SQL.php?aa=8';
	});
	$("#leftfix ._mails").mouseout(function(){
		$("#leftfix ._mails").css("background","#133281");
		$("#leftfix ._mails a").css("color","#FFF");		
	});
	$("#rightfix .td1").mouseover(function(){
		$("#rightfix .td1").css("background","#DDD");
		$("#rightfix .td1 a").css("color","#000");
	});
	$("#rightfix .td1").click(function(){
	    location.href='index2SQL.php?aa=8&t=1';
	});
	$("#rightfix .td1").mouseout(function(){
		$("#rightfix .td1").css("background","#4400AA");
		$("#rightfix .td1 a").css("color","#DDF");
	});
	$("#rightfix .td2").mouseover(function(){
		$("#rightfix .td2").css("background","#DDD");
		$("#rightfix .td2 a").css("color","#000");
	});
	$("#rightfix .td2").click(function(){
	    location.href='index2SQL.php?aa=8&t=2';
	});
	$("#rightfix .td2").mouseout(function(){
		$("#rightfix .td2").css("background","#4400AA");
		$("#rightfix .td2 a").css("color","#DDF");		
	});
	$("#rightfix .td3").mouseover(function(){
		$("#rightfix .td3").css("background","#DDD");
		$("#rightfix .td3 a").css("color","#000");
	});
	$("#rightfix .td3").click(function(){
	    location.href='index2SQL.php?aa=8&t=3';
	});
	$("#rightfix .td3").mouseout(function(){
		$("#rightfix .td3").css("background","#4400AA");
		$("#rightfix .td3 a").css("color","#DDF");		
	});
	
    $('#myform').submit(function() { 
		var options = { 
			url:        'Final_HW2+.php', 
			type: 		"POST",
			semantic:	true,
			error:		$("#output").html("執行失敗。"),
			start:		$("#output").html("檔案開始上傳"),
			success:    function(data) {
				$("#output").html(data);					
			} 
		}; 
        $(this).ajaxSubmit(options); 
        return false; 
    });
}); 