<?php
// 根据提供的主题数量和最后回复时间,判断主题数量和贴子数量有没有发生变化
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$topicsNum = $data["TopicsNum"];
$replyTime = strtotime($data["ReplyTime"]);
$check_new_topic_sql = "select count(tid) as tnum, max(rtime) as ltime from tb_topic";
$check_new_topic_res = $mysqli->query($check_new_topic_sql);
$now_data = $check_new_topic_res->fetch_assoc();
$now_topics_num = $now_data["tnum"];
$now_latest_time = $now_data["ltime"] != null ? strtotime($now_data["ltime"]) : 0;
if($topicsNum == $now_topics_num) {
	if($replyTime == $now_latest_time) {
		$ret = ["RESULT" => "F", "MSG" => "无新的数据"];
	} else {
		$ret = ["RESULT" => "T", "MSG" => "有新的数据"];
	}
} else {
	$ret = ["RESULT" => "T", "MSG" => "有新的数据"];
}
//释放内存
mysqli_free_result($check_new_topic_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>