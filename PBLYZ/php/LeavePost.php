<?php
// 根据提供的主题id,登录者id,贴子内容,发表新贴
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_topic_id = $mysqli->real_escape_string($data["TopicId"]);
$safe_user_id = $mysqli->real_escape_string($data["UserId"]);
$safe_post_content = $mysqli->real_escape_string(
	htmlentities($data["Content"], ENT_QUOTES));
$mysqli->autocommit(false);	//开始事务
$insert_post_sql = "insert into tb_post (tid, uid, content) "
	."values ('".$safe_topic_id."','".$safe_user_id."','".$safe_post_content."')";
$insert_post_res = $mysqli->query($insert_post_sql);
$post_id = mysqli_insert_id($mysqli);
$update_topic_sql = "update tb_topic set rtime = now() where tid = '".$safe_topic_id."'";
$update_topic_res = $mysqli->query($update_topic_sql);
if(!$mysqli->errno && $insert_post_res && $mysqli->affected_rows) {
	$mysqli->commit();	//提交事务
	$ret = ["RESULT" => "T", "MSG" => "发表贴子成功", "PostId" => $post_id];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
	$mysqli->rollback();	//数据回滚
}
//释放内存
mysqli_free_result($insert_post_res);
mysqli_free_result($update_topic_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>