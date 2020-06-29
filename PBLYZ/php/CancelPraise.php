<?php
// 提供贴子id和会员id,取消点赞
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_post_id = $mysqli->real_escape_string($data["PostId"]);
$safe_user_id = $mysqli->real_escape_string($data["UserId"]);
$delete_praise_sql = "delete from tb_praise where pid='"
	.$safe_post_id."' and uid='".$safe_user_id."'";
$delete_praise_res = $mysqli->query($delete_praise_sql);
if(!$mysqli->errno) {
	$ret = ["RESULT" => "T", "MSG" => "取消点赞成功"];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
}
//释放内存
mysqli_free_result($delete_praise_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>