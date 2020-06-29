<?php
// 读取所有主题信息
include 'include.php';
doDB();
$topics = array();
$select_topics_sql = "select tid, uid, title, recommend, ctime, rtime from tb_topic order by rtime desc, tid desc";
$select_topics_res = $mysqli->query($select_topics_sql);
while($topic=mysqli_fetch_object($select_topics_res)){
	$tid = $topic->tid;
	$uid = $topic->uid;
	$title = $topic->title;
	$recommend = $topic->recommend == "0"? false : true;
	$ctime = $topic->ctime;
	$rtime = $topic->rtime;
    $select_user_sql = "select uname, image from tb_user where uid='".$uid."'";
	$select_user_res = $mysqli->query($select_user_sql);
	$user = $select_user_res->fetch_assoc();
	$uname = $user["uname"];
	$image = $user["image"];
	$select_post_sql = "select count(pid) as num, content from tb_post where tid='".$tid."'";
	$select_post_res = $mysqli->query($select_post_sql);
	$post = $select_post_res->fetch_assoc();
	$firstPost = $post["content"];
	$postsNum = $post["num"];
	$topics[] = array("topicId" => $tid, 
		"user" => array("userId" => $uid, "userName" => $uname, "userImg" => "images/faces/".$image), 
		"title" => $title,
		"firstPost" => $firstPost,
		"postsNum" => $postsNum,
		"recommend" => $recommend,
		"createTime" => $ctime,
		"replyTime" => $rtime
	);
}
if(!$mysqli->errno) {
	$ret = ["RESULT" => "T", "MSG" => "读取成功", "Topics" => $topics];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
}
//释放内存
mysqli_free_result($select_topics_res);
mysqli_free_result($select_user_res);
mysqli_free_result($select_post_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>