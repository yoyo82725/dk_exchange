<?

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
if($aa == null){//非法進入
	echo "<script language='javascript'>"; 
	echo "location.href='index.php';"; 
	echo "</script>"; 
}
else if($aa == 33){//搜索
	print "<div id = rightfix>";
	require ("config.php");
	@$search1=$_POST['search1'];
	@$search2=$_POST['search2'];
	@$search3=$_POST['search3'];
	@$data1=$_POST['data1'];
	@$data2=$_POST['data2'];
	@$data3=$_POST['data3'];
	$count = 0;
	
	$search1 = "select * from _talk where id like '%$search1%' order by no desc";
	$result1 = mysql_query($search1,$link);
	$search2 = "select * from _talk where things like '%$search2%' order by no desc";
	$result2 = mysql_query($search2,$link);
	$search3 = "select * from _talk where time like '%$search3%' order by no desc";
	$result3 = mysql_query($search3,$link);
//---------------------------------------------------------------

	if($data1 == 1){
		while($row = mysql_fetch_array($result1,MYSQL_BOTH)){
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
			$count++;
		}
	}else if($data2 == 1){
		while($row = mysql_fetch_array($result2,MYSQL_BOTH)){
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
			$count++;
		}
	}else if($data3 == 1){
		while($row = mysql_fetch_array($result3,MYSQL_BOTH)){
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
			$count++;
		}
	}
	print "<p align='center'>共有 <span style='color:#00F;'>".$count."</span> 筆資料</p>";
	print "<p align='center'><a href='javascript:history.go(-1)'>回上頁</a></p>";
	print "</div>";
}
else if($aa == 55){//好站連結
	print "<div id = 'rightfix'><h2><p align = 'center'>好站連結</p></h2>";
	require ("config.php");
	//---------------------------------------------------------------
	$select = "select * from _webs order by no desc";
	$result = mysql_query($select,$link);
	$num = mysql_num_rows($result);//判斷有無資料
	print "<table width='100%' border='1' align='center'>";
	print "<tr align='center' class='bgFE9'><td width='15%'>發佈者</td><td width='20%'>網站描述</td><td width='55%'>網址</td><td width='10%'>連結更新日期</td><tr/>";
	while($row = mysql_fetch_array($result,MYSQL_BOTH)){
		list($no,$id,$_check,$_explain,$_url,$date) = $row;
		
		print "<tr style='background:#C0EBC1;'><td align='center'>";
		if($_check=='ad'){
			print "<span style='color:#B00'>";
		}else if($_check=='john'){
			print "<span style='color:#00F'>";
		}else if($_check=='maria'){
			print "<span style='color:#004100'>";
		}
		print $id."</span>";
		print "</td><td align='center'>".nl2br($_explain)."</td><td><a href='".$_url."' target='_blank'>".wordwrap($_url,40,"<br/>",1)."</a></td><td>".$date."</td></tr>";
		
	}
	print "</table><br/>";
	
	if($num == 0){//幾筆資料
		print "<strong><p align='center'>目前尚無資料!!</p></strong>";
	}else{
		print "<p align='center'>共有　<span style = 'color:#00f'>".$num."</span>　筆資料</p>";
	}
	print "<p align='center'><a href='javascript:history.go(-1)'>回上頁</a></p>";
	print "</div>";
}
else if($aa == 66){//成員名單
	print "<div id = 'rightfix'><h2><p align = 'center'>成員名單</p></h2>";
	print "<p><h3 align='center'>若成員有需要可<a href='index.php?aa=4'>通知管理者</a>，管理者擁有審核、取消審核的功能。</h3></p>";
	require("config.php");
	//---------------------------------------------------------------
	print "<table width='95%' border='0' align='center' style='background:#EEE; border-radius:20px; border:solid 3px #000;'><tr><td><p><h3 align='center'>管理員</h3></p>";
	print "<table width='90%' border='1' align='center'><tr>";
	$search = "select * from user where _check='ad' order by date";
	$result = mysql_query($search,$link);
	$num = mysql_num_rows($result);
	$count = 0;
	if($num != 0){
		while($row=mysql_fetch_array($result,MYSQL_BOTH)){//管理員
			$id = $row['id'];
			if($count >= 4){
				print "</tr><tr>";
				$count = 0;
			}
			print "<td width='20%' class='bgFE9'><span style='color:#B00;'>".wordwrap($id,9,"<br/>",1)."</span></td>";
			$count++;
		}
	}else{
		print "<td class='bgFE9'>無</td></tr>";
	}
	print "</tr></table>";
	
	print "<p><h3 align='center'>約翰資訊公司</h3></p>";
	print "<table width='90%' border='1' align='center'><tr>";
	$search = "select * from user where _check='john' order by date";
	$result = mysql_query($search,$link);
	$num = mysql_num_rows($result);
	$count = 0;
	if($num != 0){
		while($row=mysql_fetch_array($result,MYSQL_BOTH)){//約翰資訊公司
			$no = $row['no'];
			$id = $row['id'];
			if($count >= 4){
				print "</tr><tr>";
				$count = 0;
			}
			print "<td width='20%' class='bgFE9'><span style='color:#00F;'>".wordwrap($id,9,"<br/>",1)."</span>";
			print "</td>";
			$count++;
		}
	}else{
		print "<td class='bgFE9'>無</td></tr>";
	}
	print "</tr></table>";
	
	print "<p><h3 align='center'>瑪利亞設計公司</h3></p>";
	print "<table width='90%' border='1' align='center'><tr>";
	$search = "select * from user where _check='maria' order by date";
	$result = mysql_query($search,$link);
	$num = mysql_num_rows($result);
	$count = 0;
	if($num != 0){
		while($row=mysql_fetch_array($result,MYSQL_BOTH)){//瑪利亞公司
			$no = $row['no'];
			$id = $row['id'];
			if($count >= 4){
				print "</tr><tr>";
				$count = 0;
			}
			print "<td width='20%' class='bgFE9'><span style='color:#004100;'>".wordwrap($id,9,"<br/>",1)."</span>";
			print "</td>";
			$count++;
		}
	}else{
		print "<td class='bgFE9'>無</td></tr>";
	}
	print "</tr></table>";
	
	print "<p><h3 align='center'>未審核成員</h3></p>";
	print "<table width='90%' border='1' align='center'><tr>";
	$search = "select * from user where _check='no' order by date";
	$result = mysql_query($search,$link);
	$num = mysql_num_rows($result);
	$count = 0;
	if($num != 0){
		while($row=mysql_fetch_array($result,MYSQL_BOTH)){//未審核
			$no = $row['no'];
			$id = $row['id'];
			if($count >= 4){
				print "</tr><tr>";
				$count = 0;
			}
			print "<td width='20%' class='bgFE9'><span style='color:#000;'>".wordwrap($id,9,"<br/>",1)."</span>";
			print "</td>";
			$count++;
		}
	}else{
		print "<td class='bgFE9'>無</td></tr>";
	}
	print "</tr></table><br/>";
	print "</td></tr></table><p align='center'><a href='javascript:history.go(-1)'>回上頁</a></p>";
	print "</div>";
}
//--------------------------留言--------------------------------
}//函數結尾

?>