<?php
// 根据提供的会员名,判断会员名是否被占用
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_name = $mysqli->real_escape_string($data["UserName"]);
$verify_name_sql = "select uid from tb_user where uname='".$safe_name."'";
$verify_name_res = $mysqli->query($verify_name_sql);
if($verify_name_res->num_rows >= 1) {
	$ret = ["RESULT" => "F", "MSG" => "该昵称已被占用"];
} else {
	$ret = ["RESULT" => "T", "MSG" => "该昵称未被占用"];
}
//释放内存
mysqli_free_result($verify_name_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>