// JavaScript Document
$(document).ready(function() { 
	$("#prefix h1").mouseover(function(){
		$("#prefix h1").css("color","#AAA");
	});
	$("#prefix h1").click(function(){
	    location.href='index.php';	
	});
	$("#prefix h1").mouseout(function(){
		$("#prefix h1").css("color","#FFF");	
	});

	$("#leftfix .l1").mouseover(function(){
		$("#leftfix .l1").css("background","#DDD");
		$("#leftfix .l1 a").css("color","#000");
	});
	$("#leftfix .l1").click(function(){
	    location.href='index.php?aa=1';
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
	    location.href='index.php?aa=2';
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
	    location.href='index.php?aa=3';
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
	    location.href='index.php';
	});
	$("#leftfix .l4").mouseout(function(){
		$("#leftfix .l4").css("background","#133281");
		$("#leftfix .l4 a").css("color","#FFF");		
	});
	$("#leftfix .call").mouseover(function(){
		$("#leftfix .call").css("background","#DDD");
		$("#leftfix .call a").css("color","#000");
	});
	$("#leftfix .call").click(function(){
	    location.href='index.php?aa=4';
	});
	$("#leftfix .call").mouseout(function(){
		$("#leftfix .call").css("background","#133281");
		$("#leftfix .call a").css("color","#FFF");		
	});
	$("#leftfix .webs").mouseover(function(){
		$("#leftfix .webs").css("background","#DDD");
		$("#leftfix .webs a").css("color","#000");
	});
	$("#leftfix .webs").click(function(){
	    location.href='indexSQL.php?aa=55';
	});
	$("#leftfix .webs").mouseout(function(){
		$("#leftfix .webs").css("background","#133281");
		$("#leftfix .webs a").css("color","#FFF");		
	});
	$("#leftfix .member").mouseover(function(){
		$("#leftfix .member").css("background","#DDD");
		$("#leftfix .member a").css("color","#000");
	});
	$("#leftfix .member").click(function(){
	    location.href='indexSQL.php?aa=66';
	});
	$("#leftfix .member").mouseout(function(){
		$("#leftfix .member").css("background","#133281");
		$("#leftfix .member a").css("color","#FFF");		
	});
	
}); 