<?php
// 根据提供的手机号,判断手机号有没有被注册
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_phone = $mysqli->real_escape_string($data["Phone"]);
$verify_phone_sql = "select uid from tb_user where phone='".$safe_phone."'";
$verify_phone_res = $mysqli->query($verify_phone_sql);
if($verify_phone_res->num_rows >= 1) {
	$ret = ["RESULT" => "F", "MSG" => "该手机号已被注册"];
} else {
	$ret = ["RESULT" => "T", "MSG" => "该手机号未被注册"];
}
//释放内存
mysqli_free_result($verify_phone_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>