// "搜索栏"组件
Vue.component('search-bar', {
	data: function () {
		return {
			searchType: "",	//搜索方式
			searchInput: ""	//搜索内容
		}
	},
	template: `
	<div class="searchBar">
		<label>请选择查询方式：</label>
		<select v-model="searchType">
			<option value="">请选择</option>
			<option value="searchTopic">主题</option>
			<option value="searchPost">内容</option>
			<option value="searchUser">留言者</option>
		</select>
		<input type="text" v-model="searchInput" placeholder="请输入查询内容" />
		<input type="button" value="查询" @click="handleSearch" />
	</div>
	`,
	methods: {
		// 搜索,将搜索结果数据反馈给index页面
		handleSearch: function () {
			var type = this.searchType.trim();
			var input = this.searchInput.trim();
			if (type == "") {
				alert("请选择查询方式！");
				return;
			} else if (input == "") {
				alert("查询内容不能为空！");
				return;
			}
			var that = this;
			$.ajax({
				url: 'php/SearchPosts.php',
				type: 'post',
				data: JSON.stringify({"SearchType": type, 
					"SearchInput": input
				}),
				success: function(data) {
					var jsonData = JSON.parse(data);
					if (jsonData.RESULT == "T") {
						that.$emit("click", jsonData.SearchResults);
					} else {
						console.log(jsonData.MSG);
						alert("查询出现异常！请联系管理员！");
					}
				}
			});
		}
	}
})
