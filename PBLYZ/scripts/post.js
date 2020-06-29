// "单个贴子"组件,其中包含了"所有回复"组件
Vue.component('posts-one', {
	props: {
		topic_id: Number,	//主题id
		post: Object,		//贴子数据
		visitor_id: Number	//登录者id
	},
	data: function () {
		return {
			isReplying: false,	//正在被回复
			isPostReply: false	//正在回复贴子，而不是对其它回复的回复
		}
	},
	template: `
	<table :id="'post'+post.postId" style="width: 100%; table-layout: fixed;">
		<tr>
			<td style="width: 20%; text-align: center; vertical-align: top;">
				<img :src="post.user.userImg" style="width: 90%" />
				<br />
				<h3>{{ post.user.userName }}</h3>
			</td>
			<td style="width: 80%; vertical-align: middle;">
				<div class="messageBorder">
					<div class="postBody">{{ post.content }}</div>
				</div>
				<div class="postTime">
					发表时间: {{ post.createTime }}
					<img src="images/new.gif" 
						v-show="Date.now()-new Date(post.createTime).getTime()<=1000*60*60*24" />
					&nbsp;
					<img src="images/zhan.png"
						:class="{'bePraised': post.myPraise}"
						 @click="clickPraise" />
					{{ post.praiseNum }}
					&nbsp;
					<img src="images/huifu.png" @click="clickReply" />
					&nbsp;
					<img src="images/delete.png" 
						v-show="visitor_id==post.user.userId || visitor_id==1" 
						@click="deletePost" />
				</div>
				<replies-all v-show="post.replies.length > 0 || isReplying" 
					:topic_id="topic_id"
					:post_id="parseInt(post.postId)"
					:data="post.replies" 
					:replying="isReplying" 
					:post_reply="isPostReply"
					:visitor_id="visitor_id"
					@replying="changeReplying"
					@replied="replied"
					@deleted_reply="deletedReply" />
			</td>
		</tr>
	</table>
	`,
	methods: {
		// 点击了对贴子的回复
		clickReply: function () {
			this.isReplying = !this.isReplying;
			this.isPostReply = true;
		},
		// 从“回复”组件反馈的对其它回复的回复
		changeReplying: function () {
			this.isReplying = true;
			this.isPostReply = false;
		},
		// 回复之后反馈到index页面
		replied: function (replyId) {
			this.$emit("replied", replyId);
		},
		// 删除贴子及其所有回复,如果删除首贴则所属主题和所有贴都被删除
		deletePost: function () {
			if (!this.post.isFirst) {
				if (confirm("该贴及其回复都将删除，且不可恢复，确定删除吗？")) {
					var that = this;
					$.ajax({
						url: 'php/DeletePost.php',
						type: 'post',
						data: JSON.stringify({"PostId": that.post.postId}),
						success: function(data) {
							var jsonData = JSON.parse(data);
							if (jsonData.RESULT == "T") {
								that.$emit("deleted_post");
							} else {
								console.log(jsonData.MSG);
								alert("删除贴子失败！请联系管理员！");
							}
						}
					});
				}
			} else {
				if (confirm("如果删除该贴，本主题及所有回贴都将被删除，确定删除吗？")) {
					this.$emit("delete_first_post", this.topic_id);
				}
			}
		},
		// 删除回复后反馈到index页面
		deletedReply: function (postId) {
			this.$emit("deleted_reply", postId);
		},
		// 点赞和取消点赞
		clickPraise: function () {
			if (this.visitor_id < 0) {
				alert("登录后才能点赞！");
				return;
			}
			var that = this;
			if (!this.post.myPraise) {
				$.ajax({
					url: 'php/GivePraise.php',
					type: 'post',
					data: JSON.stringify({"PostId": that.post.postId,
						"UserId": that.visitor_id
					}),
					success: function(data) {
						var jsonData = JSON.parse(data);
						if (jsonData.RESULT == "T") {
							that.post.myPraise = true;
							that.post.praiseNum++;
						} else {
							console.log(jsonData.MSG);
							alert("点赞失败！请联系管理员！");
						}
					}
				});
			} else {
				$.ajax({
					url: 'php/CancelPraise.php',
					type: 'post',
					data: JSON.stringify({"PostId": that.post.postId,
						"UserId": that.visitor_id
					}),
					success: function(data) {
						var jsonData = JSON.parse(data);
						if (jsonData.RESULT == "T") {
							that.post.myPraise = false;
							that.post.praiseNum--;
						} else {
							console.log(jsonData.MSG);
							alert("取消点赞失败！请联系管理员！");
						}
					}
				});
			}
		}
	}
})
