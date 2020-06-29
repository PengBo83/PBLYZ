// "登录框"组件
Vue.component('login-user', {
	data: function () {
		return {
			loginName: "",		//登录名
			loginPassword: ""	//登录密码
		}
	},
	template: `
	<table class="loginBox">
		<tr>
			<td style="width: 25%; text-align: center;">
				<label>昵称：</label>
			</td>
			<td style="width: 70%;">
				<input type="text" v-model="loginName" placeholder="请输入昵称" v-focus />
			</td>
		</tr>
		<tr>
			<td style="text-align: center;">
				<label>密码：</label>
			</td>
			<td>
				<input type="password" v-model="loginPassword" placeholder="请输入密码" />
			</td>
		</tr>
		<tr>
			<td></td>
			<td>
				<input type="button" value="登录" @click="handleLogin" />
				<label>|</label>
				<span @click="forgetPassword">忘记密码了？</span>
			</td>
		</tr>
		<tr>
			<td></td>
			<td>
				<span @click="handleRegister">注册新用户</span>
			</td>
		</tr>
	</table>
	`,
	methods: {
		//用昵称和密码登录，并在登录成功后反馈到index页面
		handleLogin: function () {
			this.loginName = this.loginName.trim();
			this.loginPassword = this.loginPassword.trim();
			if (this.loginName == "") {
				alert("昵称不能为空");
				return;
			}
			if (this.loginPassword == "") {
				alert("密码不能为空");
				return;
			}
			var that = this;
			$.ajax({
				url: 'php/LoginUser.php',
				type: 'post',
				data: JSON.stringify({"Name": that.loginName, 
					"Password": that.loginPassword,
				}),
				success: function(data) {
					var jsonData = JSON.parse(data);
					if (jsonData.RESULT == "T") {
						that.$emit("login", parseInt(jsonData.UserId), that.loginName);
					} else {
						alert(jsonData.MSG);
					}
				}
			});
		},
		//反馈到index页面，从而跳转到“注册新用户”功能
		handleRegister: function () {
			this.$emit("register");
		},
		//找回密码功能，使用了正则表达式判断手机号是否合法
		forgetPassword: function () {
			var phoneNumber = prompt("请输入您注册的手机号");
			var phoneReg = /^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
			if(phoneNumber == null || phoneNumber.trim().length == 0) {
				alert("输入不能为空！");
			} else if(!phoneReg.test(phoneNumber)) {
				alert("无效的手机号！");
			} else {
				alert("密码将以短信方式发到您的手机上，请等候！");
			}
		}
	}
})