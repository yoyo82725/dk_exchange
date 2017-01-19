<?php

function prefix(){
	print '<div id="prefix" style="border-radius:20px;">';
	print '<h1 align = "center"><a style="font-family:標楷體;">約翰人夢工場交流平台</a></h1>';
	print '<p style="position:relative; left:500px;"><span style="color:#FFF;">---即時留言板&檔案交流</span></p>';
	print '</div>';
}
function leftfix(){
	print '<div id = "leftfix">';
	print '<div class = "l0">';
	print "<table style='border-radius:10px; background:#a00200; color:#fff;' border = '0' width='140px'><tr><td>";
	print "您好，<span style = 'color:#FFFF00'>";
	print "訪客";
	print "</span></td></tr>";
	print "<tr><td align='center'><p>";
	print "第一次來嗎?<br/>請<a href='index.php?aa=1' style='color:#FF0;'>註冊一個使用者</a><br/><br/>";
	print "新增完畢後請<a href='index.php?aa=4' style='color:#FF0;'>聯絡管理者</a>開通帳號，謝謝!!";
	print "</p></tr></td>";
	print "</table>";
	print '</div>';
	print '
			<div class = "l1" style="border-radius:10px; border:solid 1px #000; background:#133281;"><img src = "images/plus.png"><a href = "index.php?aa=1" style="color:#FFF;">註冊使用者</a>
			</div>
			<div class = "l2" style="border-radius:10px; border:solid 1px #000; background:#133281;"><img src = "images/key-363-02.png"><a href = "index.php?aa=2" style="color:#FFF;">使用者登入</a>
			</div>
			<div class = "member" style="border-radius:10px; border:solid 1px #000; background:#133281;"><img src = "images/4-1112241229464a.png"><a href = "indexSQL.php?aa=66" style="color:#FFF;">成員名單</a>
			</div>
			<div class = "l3" style="border-radius:10px; border:solid 1px #000; background:#133281;"><img src = "images/Magnifier.png"><a href = "index.php?aa=3" style="color:#FFF;">搜索文章</a>
			</div>
			<div class = "webs" style="border-radius:10px; border:solid 1px #000; background:#133281;"><img src = "images/7777_111755043586_3.png"><a href = "indexSQL.php?aa=55" style="color:#FFF;">好站連結</a>
			</div>
			<div class = "call" style="border-radius:10px; border:solid 1px #000; background:#133281;"><img src = "images/ICONMAILEX.png"><a href = "index.php?aa=4" style="color:#FFF;">聯絡管理者</a>
			</div>
			<div class = "l4" style="border-radius:10px; border:solid 1px #000; background:#133281;"><img src = "images/house2.png"><a href = "index.php" style="color:#FFF;">回首頁</a>
			</div>
	</div>';

}

//------------------------------------------------------------
function rightfix(){
@$aa = $_GET['aa'];
if($aa == 1){//註冊使用者
	print "<div id = 'rightfix'><h2><p align = 'center'>註冊使用者</p></h2>";
//---------------------------------------------------------------
	print "<table width='80%' align='center' border='0' style='background:#EEE; border-radius:20px; border:solid 3px #000;'><tr><td><br/><br/><form action='action.php?aa=9' method = 'POST'>";
	print "<table width = '$' border = '0' align = 'center'>";
	print "<tr><td>使用者名稱　：";
	print "<input type = 'id' name = 'id'/ ><br/></td></tr>";
	
	print "<tr><td><span style = 'color : #666666'>";
	print "(請使用姓名當帳號，若有重複可加其它識別字)<br/>";
	print "(最大長度為18位元，即六個中文字或18個英文、數字)";
	print "</span><br/></td></tr>";
	
	print "<tr><td><br/><br/>使用者密碼　：";
	print "<input type = 'password' name = 'password'/><br/></td></tr>";
	
	print "<tr><td><span style = 'color:#666666'>(密碼會經過編碼加密，不會清楚呈現在資料庫上)";
	print "<br/>(密碼最多為18位元，即六個中文字或18個英文、數字)";
	print "</span><br/></td></tr>";
	
	print "<tr><td><br/>再次輸入密碼：";
	print "<input type = 'password' name = 'repass'/><br/></td></tr>";
	
	print "<tr><td><span style = 'color:#666666'>(再次輸入密碼)</span><br/><br/><br/></td></tr>";
	
	print "</table></td></tr></table><br/>";
	print "<p align = 'center'><input type = 'button' value = '　完成　' onClick='if(confirm(\"確定送出?\")){submit();}'></p></form>";
	print "<p align='center'><a href='javascript:history.go(-1)'>回上頁</a></p><br/>";
	print "</div>";

}
else if($aa == 2){//登入
	print "<div id = 'rightfix'><h2><p align = 'center'>使用者登入</p></h2>";
	//---------------------------------------------------------------
	
	print "<table width='80%' align='center' border='0' style='background:#EEE; border-radius:20px; border:solid 3px #000;'><tr><td><form action = 'action.php?aa=10' method = 'POST' id = 'sub2'>";
	print "<table border = '0' align = 'center'>";
	
	print "<tr><td><br/>使用者名稱：";
	print "<input type = 'id' name = 'id' ><br/></td></tr>";
	
	print "<tr><td><span style = 'color : #666666'>(請輸入已建立的使用者名稱)</span><br/></td></tr>";
	
	print "<tr><td><br/>使用者密碼：<input type = 'password' name = 'password'><br/></td></tr>";
	
	print "<tr><td><span style = 'color:#666666'>(請輸入已建立的使用者密碼)</span><br/><br/></td></tr>";
	
	print "<tr><td></td></tr></table></td></tr></table><p align = 'center'><input type = 'submit' name = 'submit' value = '　登入　'></p></form>";
	print "<p align='center'><a href='javascript:history.go(-1)'>回上頁</a></p><br/>";
	print "</div>";
}
else if($aa == 3){//搜索
	print "<div id = 'rightfix''><h2><p align = 'center'>搜索文章</p></h2>";
	//---------------------------------------------------------------
	print "<center><table width='80%' border='0'><tr><td><table style='border-radius:10px; background:#F4F3B7; border:dotted 1px #000;'><tr><td><form action = 'indexSQL.php?aa=33' method = 'POST' id = 'sub1'>";
	print "作者搜索:<span style = 'color:#666'>(部分符合即可)</span>";
	print "<input type = 'text' name = 'search1' size = '74'>";
	print "<input type = 'hidden' name = 'data1' value = '1'>";
	print "</td><td valign='bottom'><input type = 'submit' name = 'submit' value = '搜索'></form></td></tr></table></td></tr><tr><td><hr/></td></tr>";
	
	print "<tr><td><table style='border-radius:10px; background:#F4F3B7; border:dotted 1px #000;'><tr><td><form action = 'indexSQL.php?aa=33' method = 'POST' id = 'sub1'>";
	print "內容搜索:<span style = 'color:#666'>(部分符合即可)</span>";
	print "<input type = 'text' name = 'search2' size = '74'>";
	print "<input type = 'hidden' name = 'data2' value = '1'>";
	print "</td><td valign='bottom'><input type = 'submit' name = 'submit' value = '搜索'></form></td></tr></table></td></tr><tr><td><hr/></td></tr>";
	
	print "<tr><td><table style='border-radius:10px; background:#F4F3B7; border:dotted 1px #000;'><tr><td><form action = 'indexSQL.php?aa=33' method = 'POST' id = 'sub1'>";
	print "時間搜索:<span style = 'color:#666'>(部分符合即可)</span>";
	print "<input type = 'text' name = 'search3' size = '74'>";
	print "<input type = 'hidden' name = 'data3' value = '1'>";
	print "</td><td valign='bottom'><input type = 'submit' name = 'submit' value = '搜索'></form></td></tr></table></td></tr><tr><td colspan='2'><hr/></td></tr>";
	
	print "</table></center>";
	print "<p align='center'><a href='javascript:history.go(-1)'>回上頁</a></p>";
	print "</div>";
}
else if($aa == 4){//聯絡管理者
	print "<div id = 'rightfix'><h2><p align = 'center'>聯絡管理者</p></h2>";
	//---------------------------------------------------------------
	print "<p align='center'>以　<span style = 'color:#00F'>訪客</span>　的身份聯絡管理者</p>";
	print "<table width='80%' align='center' border='0' style='background:#EEE; border-radius:20px; border:solid 3px #000; padding:15px;'><tr><td><form action='index.php?aa=44' method='POST'><table width='80%' border='0' align='center'><tr><td>";
	print "標題：<span style = 'color:#666'>(最多60位元，可不填)</span><br/><input type='text' name='main' size='60%'><input type='hidden' name='id' value='訪客'>";
	print "<br/>內容：<span style = 'color:#666'>(必填)</span><br/><textarea name='things' cols='60%' rows='15%'></textarea></td></tr>";
	print "<tr><td align='center'>";
	
	print "</td></tr></table></td></tr></table><p align='center'><input type='submit' value='　確定　'></p></form>";
	print "<p align='center'><a href='javascript:history.go(-1)'>回上頁</a></p>";
	print "</div>";
}
else if($aa == 44){//聯絡管理者
	print "<div id = 'rightfix'><h2><p align = 'center'>聯絡管理者</p></h2>";
	//---------------------------------------------------------------
	print "<table width='100%' align='center' border='0' style='background:#EEE; border-radius:20px; border:solid 3px #000; padding:15px;'><tr><td><p><h3 align='center'>文章預覽</h3></p>";
	$id=$_POST['id'];
	$main=$_POST['main'];
	$things=$_POST['things'];
	if(strlen($main)>60){
		print "<script language='javascript'>";
		print "alert('標題過長!!'); history.go(-1);";
		print "</script>";
	}else if($things == null){
		print "<script language='javascript'>";
		print "alert('內容不可為空!!'); history.go(-1);";
		print "</script>";
	}else{
		print "<table width='90%' border='5' align='center' class='bgFE9'><tr><td>";
		print "身份：<span style = 'color:#00F'>".$id."</span></td></tr><tr><td>";
		print "標題：<span style = 'color:#00F'>".$main;
		print "</span></td></tr><tr><td>內容：<br/>";
		print nl2br("$things")."</td></tr></table><br/></td></tr></table>";
		
		print "<form action='action.php?aa=11' method='POST'>";
		print "<input type='hidden' name='tp' value='1'><input type='hidden' name='main' value='$main'><input type='hidden' name='things' value='$things'><input type='hidden' name='id' value='$id'>";
		print "<p align='center'><input type='button' value='　確認送出　' onClick='if(confirm(\"確定送出?\")){submit();}'>　　<input type='button' value='　返回修改　' onClick='history.go(-1)'></p>";
	}
	print "</div>";
}
//--------------------------留言--------------------------------
else{
	print "<div id = 'rightfix'><table border = '0'><tr><td>";
	print "<h3>您必須登入後才能留言!!";
	require ("config.php");
	print "</h3></td></tr></table><hr/>";
	print "<strong><span style='color:#F00; font-size:large;'>置頂：</span>";
	print "建議使用瀏覽器：Google Chrome";
	print "</strong><hr/>";
	$search = "select * from _talk order by no desc";
	$result = mysql_query($search,$link);
	
	while($row = mysql_fetch_array($result,MYSQL_BOTH)){
		list($no,$ids,$time,$main,$things,$check) = $row;
	
		print "<table width = '100%' border = '0'><tr><td>";
		if($check=='ad'){
			print "<span style='color:#B00'>";
		}else if($check=='john'){
			print "<span style='color:#00F'>";
		}else if($check=='maria'){
			print "<span style='color:#004100'>";
		}
		print $ids;
		print "</span>說</td><td align = 'right'>";
	
		print "</td></tr></table>";
		print "<div style='width:590px; background:#EEE; border:solid 1px #000; border-radius:5px;'><center><div style='padding-top:10px; padding-left:3px; text-align:left;'>".nl2br($things);
	
		print "</div></center><br/><span style = 'color : #666666'>時間：";
		print $time;
		print "</span></div><hr/>";
	}
	print "</div>";
}
}

?>