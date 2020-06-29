// "搜索结果中某一项"组件
Vue.component('results-one', {
	props: {
		resultPost: Object	//搜索结果中该项的数据
	},
	template: `
	<table style="width: 100%; table-layout: fixed;">
		<tr>
			<td style="width: 20%; text-align: center; vertical-align: top;">
				<img :src="resultPost.user.userImg" style="width: 90%" />
				<br />
				<h3>{{ resultPost.user.userName }}</h3>
			</td>
			<td style="width: 80%; vertical-align: middle;">
				<h2 style="margin: 0% 0% 0% 5%;">主题: {{ resultPost.title }}</h2>
				<div class="messageBorder" @click="handleClickResult">
					<div class="postBody">{{ resultPost.content }}</div>
				</div>
				<div class="postTime" style="text-align: left;">
					发表时间: {{ resultPost.createTime }}
				</div>
			</td>
		</tr>
	</table>
	`,
	methods: {
		// 点击该搜索结果项后,反馈给index页面
		handleClickResult: function () {
			this.$emit("click", 
				this.resultPost.topicId, 
				this.resultPost.title,
				this.resultPost.postId);
		}
	}
})
