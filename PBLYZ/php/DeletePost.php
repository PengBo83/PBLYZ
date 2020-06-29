<?php
// 根据提供的贴子id,删除该贴的所有回复,所有赞,和该贴本身
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_post_id = $mysqli->real_escape_string($data["PostId"]);
$mysqli->autocommit(false);	//开始事务
$delete_replies_sql = "delete from tb_reply where pid='".$safe_post_id."'";
$delete_replies_res = $mysqli->query($delete_replies_sql);
$delete_praises_sql = "delete from tb_praise where pid='".$safe_post_id."'";
$delete_praises_res = $mysqli->query($delete_praises_sql);
$delete_post_sql = "delete from tb_post where pid='".$safe_post_id."'";
$delete_post_res = $mysqli->query($delete_post_sql);
if(!$mysqli->errno && $delete_post_res && $mysqli->affected_rows) {
	$mysqli->commit();	//提交事务
	$ret = ["RESULT" => "T", "MSG" => "删除贴子成功"];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
	$mysqli->rollback();	//数据回滚
}
//释放内存
mysqli_free_result($delete_replies_res);
mysqli_free_result($delete_praises_res);
mysqli_free_result($delete_post_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>