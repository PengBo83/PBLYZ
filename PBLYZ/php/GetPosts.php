<?php
// 提供主题id,主题标题和登录用户,读取该主题所有贴和所有贴的回复
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$safe_topic_id = $mysqli->real_escape_string($data["TopicId"]);
$title = $data["TopicTitle"];
$safe_visitor_id = $mysqli->real_escape_string($data["VisitorId"]);
$posts = array();
$isFirst = true;
$select_posts_sql = "select pid, uid, content, ctime from tb_post where tid='".$safe_topic_id."'";
$select_posts_res = $mysqli->query($select_posts_sql);
while($post=mysqli_fetch_object($select_posts_res)){
	$pid = $post->pid;
	$uid = $post->uid;
	$content = $post->content;
	$ctime = $post->ctime;
	$select_user_sql = "select uname, image from tb_user where uid='".$uid."'";
	$select_user_res = $mysqli->query($select_user_sql);
	$user = $select_user_res->fetch_assoc();
	$uname = $user["uname"];
	$image = $user["image"];
	$count_praise_sql = "select count(aid) as num from tb_praise where pid='".$pid."'";
	$count_praise_res = $mysqli->query($count_praise_sql);
	$praiseNum = $count_praise_res->fetch_assoc()["num"];
	$myPraise = false;
	$my_praise_sql = "select aid from tb_praise where uid='".$safe_visitor_id."' and pid='".$pid."'";
	$my_praise_res = $mysqli->query($my_praise_sql);
	if($my_praise_res->num_rows >= 1)	$myPraise = true;
	$replies = array();
	$select_replies_sql = "select rid, uid, content, ctime from tb_reply where pid='".$pid."'";
	$select_replies_res = $mysqli->query($select_replies_sql);
	while($reply=mysqli_fetch_object($select_replies_res)){
		$rid = $reply->rid;
		$ruid = $reply->uid;
		$rcontent = $reply->content;
		$rctime = $reply->ctime;
		$select_ruser_sql = "select uname from tb_user where uid='".$ruid."'";
		$select_ruser_res = $mysqli->query($select_ruser_sql);
		$runame = $select_ruser_res->fetch_assoc()["uname"];
		$replies[] = array("replyId" => $rid, 
			"postId" => $pid,
			"user" => array("userId" => $ruid, "userName" => $runame),
			"content" => $rcontent,
			"createTime" => $rctime
		);
	}
	$posts[] = array("postId" => $pid,
		"topicId" => $safe_topic_id,
		"isFirst" => $isFirst,
		"user" => array("userId" => $uid, "userName" => $uname, "userImg" => "images/faces/".$image),
		"content" => $content,
		"praiseNum" => $praiseNum,
		"myPraise" => $myPraise,
		"createTime" => $ctime,
		"replies" => $replies
	);
	$isFirst = false;
}
$selectedTopic = array(
	"topicId" => $safe_topic_id,
	"title" => $title,
	"posts" => $posts
);
if(!$mysqli->errno) {
	$ret = ["RESULT" => "T", "MSG" => "读取成功", "SelectedTopic" => $selectedTopic];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
}
//释放内存
mysqli_free_result($select_posts_res);
mysqli_free_result($select_user_res);
mysqli_free_result($count_praise_res);
mysqli_free_result($my_praise_res);
mysqli_free_result($select_replies_res);
mysqli_free_result($select_ruser_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>