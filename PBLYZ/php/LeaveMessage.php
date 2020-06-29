<?php
// 根据提供的登录者id,主题标题,首贴内容,发表新主题
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_user_id = $mysqli->real_escape_string($data["UserId"]);
$safe_topic_title = $mysqli->real_escape_string(
	htmlentities($data["Topic"], ENT_QUOTES));
$safe_post_content = $mysqli->real_escape_string(
	htmlentities($data["Post"], ENT_QUOTES));
$mysqli->autocommit(false);	//开始事务
$insert_topic_sql = "insert into tb_topic (uid, title) "
	."values ('".$safe_user_id."','".$safe_topic_title."')";
$insert_topic_res = $mysqli->query($insert_topic_sql);
$topic_id = mysqli_insert_id($mysqli);
$insert_post_sql = "insert into tb_post (tid, uid, content) "
	."values ('".$topic_id."','".$safe_user_id."','".$safe_post_content."')";
$insert_post_res = $mysqli->query($insert_post_sql);
if(!$mysqli->errno) {
	$mysqli->commit();	//提交事务
	$ret = ["RESULT" => "T", "MSG" => "发表主题成功", "TopicId" => $topic_id];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
	$mysqli->rollback();	//数据回滚
}
//释放内存
mysqli_free_result($insert_topic_res);
mysqli_free_result($insert_post_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>