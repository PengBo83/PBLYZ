<?php
// 根据提供的主题id,删除该主题所有贴的回复,所有贴的赞,所有贴和该主题本身
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_topic_id = $mysqli->real_escape_string($data["TopicId"]);
$mysqli->autocommit(false);	//开始事务
$select_posts_sql = "select pid from tb_post where tid='".$safe_topic_id."'";
$select_posts_res = $mysqli->query($select_posts_sql);
while($post=mysqli_fetch_object($select_posts_res)){
	$pid = $post->pid;
	$delete_replies_sql = "delete from tb_reply where pid='".$pid."'";
	$delete_replies_res = $mysqli->query($delete_replies_sql);
	$delete_praises_sql = "delete from tb_praise where pid='".$pid."'";
	$delete_praises_res = $mysqli->query($delete_praises_sql);
	$delete_post_sql = "delete from tb_post where pid='".$pid."'";
	$delete_post_res = $mysqli->query($delete_post_sql);
}
$delete_topic_sql = "delete from tb_topic where tid='".$safe_topic_id."'";
$delete_topic_res = $mysqli->query($delete_topic_sql);
if(!$mysqli->errno && $delete_topic_res && $mysqli->affected_rows) {
	$mysqli->commit();	//提交事务
	$ret = ["RESULT" => "T", "MSG" => "删除主题成功"];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
	$mysqli->rollback();	//数据回滚
}
//释放内存
mysqli_free_result($delete_replies_res);
mysqli_free_result($delete_praises_res);
mysqli_free_result($delete_post_res);
mysqli_free_result($delete_topic_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>