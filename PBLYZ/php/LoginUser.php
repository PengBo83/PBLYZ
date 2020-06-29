<?php
// 用提供的会员名和密码登录,返回登录结果
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_name = $mysqli->real_escape_string($data["Name"]);
$safe_password = $mysqli->real_escape_string($data["Password"]);
$check_name_sql = "select uid from tb_user where uname='".$safe_name."'";
$check_name_res = $mysqli->query($check_name_sql);
if($check_name_res->num_rows == 0) {
	$ret = ["RESULT" => "F", "MSG" => "该用户不存在"];
} else {
	$login_sql = "select uid from tb_user where uname='".$safe_name
		."' and password='".$safe_password."'";
	$login_res = $mysqli->query($login_sql);
	if($login_res->num_rows == 0) {
		$ret = ["RESULT" => "F", "MSG" => "密码错误"];
	} else {
		$row = $login_res->fetch_assoc();
		$id = $row["uid"];
		$ret = ["RESULT" => "T", "MSG" => "登录成功", "UserId" => $id];
	}
}
//释放内存
mysqli_free_result($check_name_res);
mysqli_free_result($login_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>