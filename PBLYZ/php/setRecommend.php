<?php
// 用提供的主题id,给某主题加精
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_topic_id = $mysqli->real_escape_string($data["TopicId"]);
$update_topic_sql = "update tb_topic set recommend = true where tid = '".$safe_topic_id."'";
$update_topic_res = $mysqli->query($update_topic_sql);
if($mysqli->affected_rows) {
	$ret = ["RESULT" => "T", "MSG" => "加精成功"];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
}
//释放内存
mysqli_free_result($update_topic_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>