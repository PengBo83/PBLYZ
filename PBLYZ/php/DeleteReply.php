<?php
// 根据提供的回复id,删除该回复
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_reply_id = $mysqli->real_escape_string($data["ReplyId"]);
$delete_reply_sql = "delete from tb_reply where rid='".$safe_reply_id."'";
$delete_reply_res = $mysqli->query($delete_reply_sql);
if($delete_reply_res && $mysqli->affected_rows) {
	$ret = ["RESULT" => "T", "MSG" => "删除回复成功"];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
}
//释放内存
mysqli_free_result($delete_reply_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>