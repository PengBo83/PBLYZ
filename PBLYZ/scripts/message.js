// "发表新主题"组件
Vue.component('leave-message', {
	props: {
		uid: Number		//登录者id
	},
	data: function () {
		return {
			leaveTopic: "",	//主题标题
			leavePost: ""	//首贴内容
		}
	},
	template: `
	<table class="leaveMessage">
		<tr>
			<td style="width: 15%; text-align: center;">
				<label>主题：</label>
			</td>
			<td style="width: 80%;">
				<input type="text" v-model="leaveTopic" placeholder="请输入留言主题" v-focus />
			</td>
		</tr>
		<tr>
			<td style="text-align: center; vertical-align: top;">
				<label>内容：</label>
			</td>
			<td>
				<textarea v-model="leavePost" rows="10" placeholder="请输入留言内容"></textarea>
			</td>
		</tr>
		<tr>
			<td></td>
			<td>
				<input type="button" value="发表" @click="handleLeave" />
			</td>
		</tr>
	</table>
	`,
	methods: {
		// 发表新主题,缩进格式按照四个字符缩进，并在成功后反馈到index页面
		handleLeave: function () {
			this.leaveTopic = this.leaveTopic.trim();
			this.leavePost = this.leavePost.trim();
			var that = this;
			$.ajax({
				url: 'php/LeaveMessage.php',
				type: 'post',
				data: JSON.stringify({"UserId": that.uid,
					"Topic": that.leaveTopic, 
					"Post": that.leavePost
				}, null, 4),
				success: function(data) {
					var jsonData = JSON.parse(data);
					if (jsonData.RESULT == "T") {
						that.$emit("click", jsonData.TopicId);
					} else {
						console.log(jsonData.MSG);
						alert("留言失败！请联系管理员！");
					}
				}
			});
		}
	}
})
