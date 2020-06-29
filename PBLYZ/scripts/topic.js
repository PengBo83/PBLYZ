// "首页主题列表中一项"组件
Vue.component('topics-one', {
	props: {
		topic: Object,	//主题数据
		visitor: String	//登录者昵称
	},
	template: `
	<table :id="'topic'+topic.topicId" style="width: 100%; table-layout: fixed;">
		<tr>
			<td rowspan="2" style="width: 20%; text-align: center;">
				<img :src="topic.user.userImg" style="width: 90%" />
				<br />
				<h3>{{ topic.user.userName }}</h3>
			</td>
			<td style="width: 70%;" class="messageBorder">
				<div class="topicBody" @click="handleClickTopics">
					<h2>{{ topic.title }}</h2>
					<p>{{ topic.firstPost }}</p>
				</div>
			</td>
			<td rowspan="2" style="width: 10%;">
				<img src="images/tuijian.png" v-show="topic.recommend" />
				<br />
				<img src="images/hot.gif" v-show="topic.postsNum >= 3" />
				<br />
				<img src="images/new.gif" 
					v-show="Date.now()-new Date(topic.createTime).getTime()<=1000*60*60*24" />
				<br />
				<img src="images/jiajing.png" 
					v-show="visitor=='系统管理员' && !topic.recommend" 
					@click="clickRecommend(topic.topicId)" />
				<br />
				<img src="images/delete.png" 
					v-show="visitor==topic.user.userName || visitor=='系统管理员'" 
					@click="deleteTopic" />
			</td>
		</tr>
		<tr>
			<td>
				<div class="topicTime">
					{{ topic.createTime }} 发布，{{ topic.replyTime }} 回复，共 {{ topic.postsNum }} 贴
				</div>
			</td>
		</tr>
	</table>
	`,
	methods: {
		// 点击该主题后，反馈给index页面
		handleClickTopics: function () {
			this.$emit("click");
		},
		// 点击对主题的删除后，反馈给index页面
		deleteTopic: function () {
			if (confirm("该主题及其所有回贴都将删除，且不可恢复，确定删除吗？")) {
				this.$emit("delete_topic", this.topic.topicId);
			}
		},
		// 将该主题加精
		clickRecommend: function (topicId) {
			if (confirm("加精后无法撤销，确定将此主题加精吗？")) {
				var that = this;
				$.ajax({
					url: 'php/setRecommend.php',
					type: 'post',
					data: JSON.stringify({"TopicId": topicId}),
					success: function(data) {
						var jsonData = JSON.parse(data);
						if (jsonData.RESULT == "T") {
							that.$emit("recommended", topicId);
						} else {
							console.log(jsonData.MSG);
							alert("加精失败！请联系管理员！");
						}
					}
				});
			}
		}
	}
})
