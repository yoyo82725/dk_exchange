<?
session_start();
session_destroy();//移除全變數
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script language="javascript" src="_js/jquery-1.4.3.js" ></script>
<title>約翰人夢工場交流平台</title>
<script language="javascript" src="_js/Untitled-3.js" >
</script>
<link href="_css/Untitled-4.css" rel="stylesheet" type="text/css"/>

</head>

<body>
<div id="MainFrame">
<?php
require("main.php");
print prefix();
print leftfix();
print rightfix();
?>
</div>

</body>
</html>