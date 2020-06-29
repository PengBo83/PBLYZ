<?php
// 用提供的搜索方式和内容,分三种情况搜索贴子
header('Content-Type => application/json');
$content = file_get_contents("php://input");
$data = json_decode($content, true);
include 'include.php';
doDB();
$search_type = $data["SearchType"];
$safe_search_input = $mysqli->real_escape_string($data["SearchInput"]);
$searchResults = array();
if($search_type == "searchPost") {
	$select_search_sql = "select pid, tid, uid, content, ctime from tb_post where content like '%".$safe_search_input."%' order by ctime desc, pid desc";
	$select_search_res = $mysqli->query($select_search_sql);
	while($result=mysqli_fetch_object($select_search_res)){
		$pid = $result->pid;
		$tid = $result->tid;
		$uid = $result->uid;
		$postContent = $result->content;
		$ctime = $result->ctime;
		$select_topic_sql = "select title from tb_topic where tid='".$tid."'";
		$select_topic_res = $mysqli->query($select_topic_sql);
		$title = $select_topic_res->fetch_assoc()["title"];
		$select_user_sql = "select uname, image from tb_user where uid='".$uid."'";
		$select_user_res = $mysqli->query($select_user_sql);
		$user = $select_user_res->fetch_assoc();
		$userName = $user["uname"];
		$userImage = $user["image"];
		$searchResults[] = array("postId" => $pid, 
			"topicId" => $tid,
			"title" => $title,
			"user" => array("userId" => $uid, "userName" => $userName, "userImg" => "images/faces/".$userImage),
			"content" => $postContent,
			"createTime" => $ctime
		);
	}
} elseif($search_type == "searchTopic") {
	$select_topic_sql = "select tid, title from tb_topic where title like '%".$safe_search_input."%' order by rtime desc, tid desc";
	$select_topic_res = $mysqli->query($select_topic_sql);
	while($topic=mysqli_fetch_object($select_topic_res)){
		$tid = $topic->tid;
		$title = $topic->title;
		$select_search_sql = "select pid, uid, content, ctime from tb_post where tid='".$tid."' order by ctime desc, pid desc";
		$select_search_res = $mysqli->query($select_search_sql);
		while($result=mysqli_fetch_object($select_search_res)){
			$pid = $result->pid;
			$uid = $result->uid;
			$postContent = $result->content;
			$ctime = $result->ctime;
			$select_user_sql = "select uname, image from tb_user where uid='".$uid."'";
			$select_user_res = $mysqli->query($select_user_sql);
			$user = $select_user_res->fetch_assoc();
			$userName = $user["uname"];
			$userImage = $user["image"];
			$searchResults[] = array("postId" => $pid,
				"topicId" => $tid,
				"title" => $title,
				"user" => array("userId" => $uid, "userName" => $userName, "userImg" => "images/faces/".$userImage),
				"content" => $postContent,
				"createTime" => $ctime
			);
		}
	}
} elseif($search_type == "searchUser") {
	$select_user_sql = "select uid, uname, image from tb_user where uname like '%".$safe_search_input."%'";
	$select_user_res = $mysqli->query($select_user_sql);
	while($user=mysqli_fetch_object($select_user_res)){
		$uid = $user->uid;
		$userName = $user->uname;
		$userImage = $user->image;
		$select_search_sql = "select pid, tid, content, ctime from tb_post where uid='".$uid."' order by ctime desc, pid desc";
		$select_search_res = $mysqli->query($select_search_sql);
		while($result=mysqli_fetch_object($select_search_res)){
			$pid = $result->pid;
			$tid = $result->tid;
			$postContent = $result->content;
			$ctime = $result->ctime;
			$select_topic_sql = "select title from tb_topic where tid='".$tid."'";
			$select_topic_res = $mysqli->query($select_topic_sql);
			$title = $select_topic_res->fetch_assoc()["title"];
			$searchResults[] = array("postId" => $pid,
				"topicId" => $tid,
				"title" => $title,
				"user" => array("userId" => $uid, "userName" => $userName, "userImg" => "images/faces/".$userImage),
				"content" => $postContent,
				"createTime" => $ctime
			);
		}
	}
}
if(!$mysqli->errno) {
	$ret = ["RESULT" => "T", "MSG" => "查询成功", "SearchResults" => $searchResults];
} else {
	$ret = ["RESULT" => "F", "MSG" => $mysqli->error];
}
//释放内存
mysqli_free_result($select_search_res);
mysqli_free_result($select_topic_res);
mysqli_free_result($select_user_res);
//关闭到MySQL的连接
$mysqli->close();
echo json_encode($ret, JSON_UNESCAPED_UNICODE);
?>