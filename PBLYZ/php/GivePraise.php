<?php
// 提供贴子id和登录者id,点赞
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_post_id = $mysqli->real_escape_string($data["PostId"]);
$safe_user_id = $mysqli->real_escape_string($data["UserId"]);
$insert_praise_sql = "insert into tb_praise (pid, uid) "
	."values ('".$safe_post_id."','".$safe_user_id."')";
$insert_praise_res = $mysqli->query($insert_praise_sql);
if(!$mysqli->errno) {
	$ret = ["RESULT" => "T", "MSG" => "点赞成功"];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
}
//释放内存
mysqli_free_result($insert_praise_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>