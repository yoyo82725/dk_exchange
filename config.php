<?php
$hostname = "";
$username = "";
$connDb="";
$password = "";
$link = mysql_connect($hostname, $username, $password) or die(mysql_error());
mysql_select_db($connDb) or die("Could not select database");
mysql_query("SET NAMES utf8");
mysql_query("SET CHARACTER_SET_CLIENT=utf8"); 
mysql_query("SET CHARACTER_SET_RESULTS=utf8");
putenv("TZ=Asia/Taipei");  


?>
