<?php
// 用提供的昵称,密码,性别,头像路径,真名,手机号,注册新会员
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_name = $mysqli->real_escape_string($data["Name"]);
$safe_password = $mysqli->real_escape_string($data["Password"]);
$safe_sex = $mysqli->real_escape_string($data["Sex"]);
$safe_image = $mysqli->real_escape_string($data["Image"]);
$safe_true_name = $mysqli->real_escape_string($data["TrueName"]);
$safe_phone = $mysqli->real_escape_string($data["Phone"]);
$insert_user_sql = "insert into tb_user (uname, password, sex, image, tname, phone) "
	."values ('".$safe_name."','".$safe_password."','".$safe_sex."','"
	.$safe_image."','".$safe_true_name."','".$safe_phone."')";
$insert_user_res = $mysqli->query($insert_user_sql);
if($insert_user_res) {
	$user_id = mysqli_insert_id($mysqli);
	$ret = ["RESULT" => "T", "MSG" => "注册成功", "UserId" => $user_id];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
}
//释放内存
mysqli_free_result($insert_user_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>