<?
session_start();
$aa=$_GET['aa'];
if($aa == 1){//改檔案權限
	require ("config.php");
	$level = $_POST['level'];
	$no = $_POST['no'];
	$edit="update upload set level='$level' where no = '$no'";

	mysql_query($edit,$link);
}
else if($aa == 2){//成員審核
	require("config.php");
	$no = $_POST['no'];
	$tp = $_POST['tp'];
	$edit="update user set _check='$tp' where no = '$no'";
	
	mysql_query($edit,$link);
}
else if($aa == 3){//成員審核
	require("config.php");
	$no = $_POST['no'];
	$edit="update user set _check='no' where no = '$no'";
	
	mysql_query($edit,$link);
}
else if($aa == 4){//留言
	require ("config.php");
	$main = $_POST['main'];
	$things = $_POST['things'];
	$check = $_SESSION['_check'];
	$id = $_SESSION['iidd'];
	$add = "insert into _talk(id,main,things,_check) values('$id','$main','$things','$check')";

	if($things == null){
	echo "<script language='javascript'>"; 
	echo "alert('內容不可為空!'); location.href='index2.php';"; 
	echo "</script>"; 
	}else{
		mysql_query($add,$link);
	}
	echo "<script language='javascript'>"; 
	echo "location.href='index2.php'"; 
	echo "</script>"; 
}
else if($aa == 5){//增加好站連結
	require("config.php");
	$_explain = $_POST['_explain'];
	$_url = "http://".$_POST['_url'];
	$id = $_SESSION['iidd'];
	$_check = $_SESSION['_check'];
	$add = "insert into _webs(id,_check,_explain,_url) values('$id','$_check','$_explain','$_url')";
	
	echo "<script language='javascript'>"; 
	if($_POST['_explain']==null || $_POST['_url']==null){
		echo "alert('欄位未填完整'); history.go(-1);"; 
	}else{
		mysql_query($add,$link);
		echo "location.href='index2SQL.php?aa=7'"; 
	}
	echo "</script>"; 
}
else if($aa == 6){//傳個人訊息
	require("config.php");
	$to = $_POST['to'];
	$main = $_POST['main'];
	$things = $_POST['things'];
	$id = $_SESSION['iidd'];
	if (!empty($_SERVER['HTTP_CLIENT_IP'])){//抓取IP
		$ip=$_SERVER['HTTP_CLIENT_IP'];
	}else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
		$ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
	}else{
		$ip=$_SERVER['REMOTE_ADDR'];
	}

	//收件者是否存在
	$select = "select * from user where id = '$to' and (_check='ok' or _check='ad')";
	$result = mysql_query($select,$link);
	$add = "insert into _mails(id,_to,main,things,_ip) values('$id','$to','$main','$things','$ip')";
	$add2 = "insert into _selfMails(id,_to,main,things,_ip) values('$id','$to','$main','$things','$ip')";
	echo "<script language='javascript'>"; 
	if($to == null || $things == null){
		echo "alert('欄位未填完整'); history.go(-1);"; 
	}else if(strlen($main)>60){
		echo "alert('標題過長'); history.go(-1);"; 
	}else if(mysql_num_rows($result) == 0){
		echo "alert('查無此ID，或此ID無訊息功能。'); history.go(-1);"; 
	}else{
		if(mysql_query($add,$link)){
			mysql_query($add2,$link);
			echo "alert('訊息傳送成功'); location.href='index2SQL.php?aa=8';"; 
		}else{
			echo "alert('訊息傳送失敗，請聯絡管理員。'); location.href='index2SQL.php?aa=8';"; 
		}
	}
	echo "</script>"; 
}
else if($aa == 7){//刪除
	require("config.php");
	$tp = $_POST['tp'];
	$no = $_POST['no'];
	if($tp==1){//個人訊息--送訊夾
		$delete = "delete from _selfMails where no = '$no'";
	}else if($tp==2){//個人訊息--收信夾
		$delete = "delete from _mails where no = '$no'";
	}
	mysql_query($delete,$link);
}
else if($aa == 8){//改密碼
	require ("config.php");
	$id = $_SESSION['iidd'];
	$passworda = MD5($_POST['passworda']);
	$newPass = MD5($_POST['newPass']);
	$newPassa = MD5($_POST['newPassa']);
	$search = "select * from user where id = '$id'";
	$result = mysql_query($search,$link);
	$edit = "update user set password = '$newPass' where id = '$id'";
	while($row = mysql_fetch_array($result,MYSQL_BOTH)){
		$ids = $row['id'];
		$nos = $row['no'];
		$passwords = $row['password'];
	}
	echo "<script language='javascript'>"; 
	if($_POST['passworda'] == null || $_POST['newPass'] == null || $_POST['newPassa'] == null){
		echo "alert('不可有一欄為空值'); location.href='index2.php?aa=2';";
	}
	else if($passworda != $passwords || $newPass != $newPassa){
		echo "alert('資料有誤'); location.href='index2.php?aa=2';";		
	}
	else if(strlen($_POST['newPass']) > 18){ 
		echo "alert('密碼過長'); history.go(-1);"; 
	}
	else if($passworda == $passwords && $newPass == $newPassa){
		if(mysql_query($edit,$link)){
			session_destroy();
			echo "alert('修改成功!請使用新密碼重新登入,謝謝'); location.href='index.php';"; 
		}else{
			echo "alert('修改失敗!請聯絡管理員,謝謝'); location.href='index2.php';"; 
		}
	}
	echo "</script>"; 
}
else if($aa == 9){//註冊使用者
	require ("config.php");
	$id = $_POST['id'];
	$password = MD5($_POST['password']);
	$repass = MD5($_POST['repass']);
	$search = "select * from user where id = '$id'";
	$result = mysql_query($search,$link);
	$num = mysql_num_rows($result);
	
	echo "<script language='javascript'>"; 
	if($id == null || $password == null || $repass == null){
		echo "alert('不可有任何一欄為空值'); history.go(-1);"; 
	}else{
		if($num == 0){
			if(strlen($id) > 18){
				echo "alert('使用者名稱過長'); history.go(-1);"; 
			}else if(strlen($_POST['password']) > 18){ 
				echo "alert('密碼過長'); history.go(-1);"; 
			}else if($password != $repass){
				echo "alert('密碼確認錯誤'); history.go(-1);"; 
			}else{//成功建立
				$add = "insert into user (id,password) values('$id','$password')";
				if(mysql_query($add,$link)){
					echo "alert('使用者建立成功!請聯絡管理員審核!'); location.href='index.php';"; 
				}else{ 
					echo "alert('使用者建立失敗!請聯絡管理員!'); location.href='index.php';"; 
				}
			}
		}else{
			echo "alert('使用者名稱重複'); history.go(-1);"; 
		}
	}
	echo "</script>";
}
else if($aa == 10){//登入
	require ("config.php");
	$id = $_POST['id'];
	$password = MD5($_POST['password']);
	$search = "select * from user where id = '$id'";
	$result = mysql_query($search,$link);
	$row = mysql_fetch_array($result,MYSQL_BOTH);
	$ids = $row['id'];
	$pass = $row['password'];
	$_check = $row['_check'];
	
	echo "<script language='javascript'>"; 
	if($id == null || $password == null){
		echo "alert('不可有一欄為空值'); location.href='index.php?aa=2';"; 
	}else if($ids != $id || $pass != $password){
		echo "alert('使用者名稱或密碼錯誤'); location.href='index.php?aa=2';"; 
	}else if($ids == $id && $pass == $password){//成功登入
		$_SESSION['iidd'] = $id;
		$_SESSION['_check'] = $_check;
		print "location.href='index2.php';";
	}
	echo "</script>"; 
}
else if($aa == 11){//聯絡管理者
	require("config.php");
	$tp=$_POST['tp'];//回去的頁面
	$id=$_POST['id'];
	$main=$_POST['main'];
	$things=$_POST['things'];
	$_check=$_SESSION['_check'];
	if (!empty($_SERVER['HTTP_CLIENT_IP'])){//抓取IP
	    $ip=$_SERVER['HTTP_CLIENT_IP'];
	}else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
	    $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
	}else{
	    $ip=$_SERVER['REMOTE_ADDR'];
	}
	$add="insert into calll(id,main,things,_check,_ip) values('$id','$main','$things','$_check','$ip')";
	
	echo "<script language='javascript'>"; 
	if(mysql_query($add,$link)){
		echo "alert('資料傳輸成功'); if($tp==1){location.href='index.php';}else if($tp==2){location.href='index2.php';}else{location.href='index.php';}";
	}else{ 
		echo "alert('資料傳輸失敗，請以其它方式聯絡管理者。'); history.go(-2);"; 
	}
	echo "</script>"; 
}
//------------------------------------------------
echo "<script language='javascript'>"; 
echo "history.go(-1);"; 
echo "</script>"; 

?>