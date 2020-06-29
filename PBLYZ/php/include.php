<?php
//连接数据库
function doDB() {
	//不显示警告信息
	error_reporting(0);
	
	//在此修改数据库服务器信息
	$dbhost = "localhost";
	$dbuser = "root";
	$dbpass = "";
	$dbname = "pblyz";
	global $mysqli;
	
	//连接到服务器并选择数据库
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
	//设置中文编码
	$mysqli->query("set names utf8mb4");
}
?>