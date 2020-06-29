// "某贴所有回复"组件
Vue.component('replies-all', {
	props: {
		topic_id: Number,		//主题id
		post_id: Number,		//贴子id
		data: Array,			//该贴所有回复数据
		replying: Boolean,		//是否正在编辑回复
		post_reply: Boolean,	//是否是对贴子的回复，而不是对其它回复的回复
		visitor_id: Number		//登录者id
	},
	data: function () {
		return {
			newReply: ""		//新的回复内容
		}
	},
	computed: {
		// 计算属性,用于实时判断是否是对贴子的回复，而不是对其它回复的回复
		isPostReply: function () {
			return this.post_reply;
		}
	},
	template: `
	<table class="replies">
		<tr v-if="replying">
			<td>
				<div class="publishReply">
					<textarea rows="1" 
						:placeholder="visitor_id<0?'请登录后再回复':'请在此处输入您的回复'"
						:disabled="visitor_id<0" 
						v-model="newReply"
						v-focus></textarea>
					<input type="button" 
						value="回复" 
						:disabled="visitor_id<0" 
						@click="leaveReply" />
				</div>
			</td>
		<tr>
		<tr v-for="datum in data" :id="'reply'+datum.replyId">
			<td>
				{{ datum.user.userName }} : {{ datum.content }}
				<span style="float: right">
					{{ datum.createTime }}
					<img src="images/huifu.png" @click="replyReply(datum.user.userName)" />
					<img src="images/delete.png" 
						v-show="visitor_id==parseInt(datum.user.userId) || visitor_id==1" 
						@click="deletePeply(datum.replyId)" />
				</span>
			</td>
		</tr>
	</table>
	`,
	methods: {
		// 发表新回复
		leaveReply: function () {
			var that = this;
			$.ajax({
				url: 'php/LeaveReply.php',
				type: 'post',
				data: JSON.stringify({"TopicId": that.topic_id,
					"PostId": that.post_id, 
					"UserId": that.visitor_id,
					"Content": that.newReply
				}, null, 4),
				success: function(data) {
					var jsonData = JSON.parse(data);
					if (jsonData.RESULT == "T") {
						that.$emit("replied", jsonData.ReplyId);
					} else {
						console.log(jsonData.MSG);
						alert("发表回复失败！请联系管理员！");
					}
					that.newReply = "";
				}
			});
		},
		// 对其它回复的回复,并反馈给上级组件
		replyReply: function (name) {
			if (this.visitor_id>=0) {
				this.newReply = "回复"+name+"：";
			}
			this.$emit("replying");
		},
		// 删除某回复
		deletePeply: function (replyId) {
			if (confirm("删除后不可恢复，确定删除吗？")) {
				var that = this;
				$.ajax({
					url: 'php/DeleteReply.php',
					type: 'post',
					data: JSON.stringify({"ReplyId": replyId}),
					success: function(data) {
						var jsonData = JSON.parse(data);
						if (jsonData.RESULT == "T") {
							that.$emit("deleted_reply", that.post_id);
						} else {
							console.log(jsonData.MSG);
							alert("删除回复失败！请联系管理员！");
						}
					}
				});
			}
		}
	},
	watch: {
		//监视计算属性状态,如果是对贴子的回复,清空"回复某某:"文字：
		isPostReply: function(newVal, oldVal) {
			if (newVal == true)	this.newReply = "";
		}
	}
})
