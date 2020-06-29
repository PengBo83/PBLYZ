// "注册新会员框"组件
Vue.component('register-user', {
	data: function () {
		return {
			name: "",				//昵称
			password: "",			//密码
			confirmPassword: "",	//再输一次密码
			sex: "",				//性别
			image: "",				//头像路径
			images: [],				//可选头像数组
			trueName: "",			//真名
			phone: "",				//手机号
			nameErr: "",			//昵称验证文字
			passwordErr: "",		//密码验证文字
			confirmPasswordErr: "",	//重复输入密码验证文字
			sexErr: "",				//性别验证文字
			imageErr: "",			//头像验证文字
			trueNameErr: "",		//真名验证文字
			phoneErr: ""			//手机号验证文字
		}
	},
	template: `
	<table class="registerBox">
		<tr>
			<td style="width: 60%;">
				<input type="text" v-model="name" @blur="checkName" placeholder="请输入昵称" v-focus />
			</td>
			<td style="width: 35%;">
				<img src="images/yes.png" v-show="nameErr=='ok'" />
				<img src="images/stop.png" v-show="nameErr!='' && nameErr!='ok'" />
				<span v-show="nameErr!='ok'">{{ nameErr }}</span>
			</td>
		</tr>
		<tr>
			<td>
				<input type="password" v-model="password" @blur="checkPassword" placeholder="请输入密码" />
			</td>
			<td>
				<img src="images/yes.png" v-show="passwordErr=='ok'" />
				<img src="images/stop.png" v-show="passwordErr!='' && passwordErr!='ok'" />
				<span v-show="passwordErr!='ok'">{{ passwordErr }}</span>
			</td>
		</tr>
		<tr>
			<td>
				<input type="password" v-model="confirmPassword" @blur="checkConfirmPassword" placeholder="请再输入一次密码" />
			</td>
			<td>
				<img src="images/yes.png" v-show="confirmPasswordErr=='ok'" />
				<img src="images/stop.png" v-show="confirmPasswordErr!='' && confirmPasswordErr!='ok'" />
				<span v-show="confirmPasswordErr!='ok'">{{ confirmPasswordErr }}</span>
			</td>
		</tr>
		<tr>
			<td>
				<input type="radio" v-model="sex" value="man" id="man" @blur="checkSex" @change="changeSex">
				<label for="man">男</label>
				<input type="radio" v-model="sex" value="woman" id="woman" @blur="checkSex" @change="changeSex">
				<label for="woman">女</label>
			</td>
			<td>
				<img src="images/yes.png" v-show="sexErr=='ok'" />
				<img src="images/stop.png" v-show="sexErr!='' && sexErr!='ok'" />
				<span v-show="sexErr!='ok'">{{ sexErr }}</span>
			</td>
		</tr>
		<tr>
			<td>
				<select v-model="image" @change="checkImage">
					<option value="">请选择头像</option>
					<option v-for="(img, index) in images" :value="img">头像 {{ index + 1 }}</option>
				</select>
				<br />
				<img class="registerImage" v-if="image!=''" :src="'images/faces/'+image" />
			</td>
			<td>
				<img src="images/yes.png" v-show="imageErr=='ok'" />
				<img src="images/stop.png" v-show="imageErr!='' && imageErr!='ok'" />
				<span v-show="imageErr!='ok'">{{ imageErr }}</span>
			</td>
		</tr>
		<tr>
			<td>
				<input type="text" v-model="trueName" @blur="checkTrueName" placeholder="请输入真实姓名" />
			</td>
			<td>
				<img src="images/yes.png" v-show="trueNameErr=='ok'" />
				<img src="images/stop.png" v-show="trueNameErr!='' && trueNameErr!='ok'" />
				<span v-show="trueNameErr!='ok'">{{ trueNameErr }}</span>
			</td>
		</tr>
		<tr>
			<td>
				<input type="text" v-model="phone" @blur="checkPhone" placeholder="请输入手机号" />
			</td>
			<td>
				<img src="images/yes.png" v-show="phoneErr=='ok'" />
				<img src="images/stop.png" v-show="phoneErr!='' && phoneErr!='ok'" />
				<span v-show="phoneErr!='ok'">{{ phoneErr }}</span>
			</td>
		</tr>
		<tr>
			<td>
				<input type="button" value="注册" @click="handleRegister" />
			</td>
			<td></td>
		</tr>
	</table>
	`,
	methods: {
		// 检查昵称是否合法，是否被占用
		checkName: function () {
			this.name = this.name.trim();
			var n = this.name;
			if (n.length == 0) {
				this.nameErr = "昵称不能为空";
			} else if (n.length > 15) {
				this.nameErr = "昵称不能超过15个字";
			} else {
				var that = this;
				$.ajax({
					url: 'php/CheckUserName.php',
					type: 'post',
					data: JSON.stringify({"UserName":n}),
					success: function(data) {
						var jsonData = JSON.parse(data);
						if (jsonData.RESULT == "T") {
							that.nameErr = "ok";
						} else {
							that.nameErr = "此昵称已经被占用";
						}
					}
				});
			}
		},
		// 检查密码是否合法
		checkPassword: function () {
			this.password = this.password.trim();
			var p = this.password;
			var passwordReg = /^[0-9A-Za-z_]{6,18}$/;
			if (p.length == 0) {
				this.passwordErr = "密码不能为空";
			} else if (p.length < 6) {
				this.passwordErr = "密码不能少于6位";
			} else if (p.length > 18) {
				this.passwordErr = "密码不能超过18位";
			} else if (!passwordReg.test(p)) {
				this.passwordErr = "密码只能由数字、字母和下划线组成";
			} else {
				this.passwordErr = "ok";
			}
		},
		// 检查重复输入密码
		checkConfirmPassword: function () {
			this.confirmPassword = this.confirmPassword.trim();
			var c = this.confirmPassword;
			if (c.length == 0) {
				return;
			} else if (c != this.password) {
				this.confirmPasswordErr = "密码不一致";
			} else {
				this.confirmPasswordErr = "ok";
			}
		},
		// 检查性别是否选择,及通过性别生成男或女头像数组
		checkSex: function () {
			this.sex = this.sex.trim();
			var s = this.sex;
			if (s.length==0) {
				this.sexErr = "性别不能为空";
			} else {
				this.sexErr = "ok";
				this.images.length = 0;
				if (s == "man") {
					for (var i = 0; i <= 17; i++) {
						this.images.push("boy-" + i + ".png");
					}
				} else if (s == "woman") {
					for (var i = 0; i <= 19; i++) {
						this.images.push("girl-" + i + ".png");
					}
				}
			}
		},
		// 改变性别时清空头像和头像验证文字
		changeSex: function () {
			this.image = "";
			this.imageErr = "";
		},
		// 验证头像是否选择
		checkImage: function () {
			this.image = this.image.trim();
			if (this.image.length == 0) {
				this.imageErr = "头像不能为空";
			} else {
				this.imageErr = "ok";
			}
		},
		// 验证真名是否合法
		checkTrueName: function () {
			this.trueName = this.trueName.trim();
			var t = this.trueName;
			var trueNameReg = /^([\u4e00-\u9fa5]{2,7}|([a-zA-Z]+[ ]?)+)$/;
			if (t.length == 0) {
				this.trueNameErr = "真实姓名不能为空";
			} else if (t.length > 32) {
				this.trueNameErr = "真实姓名不能超过32个字符";
			} else if (!trueNameReg.test(t)) {
				this.trueNameErr = "真实姓名不合法";
			} else {
				this.trueNameErr = "ok";
			}
		},
		// 验证手机号是否合法
		checkPhone: function () {
			this.phone = this.phone.trim();
			var p = this.phone;
			var phoneReg = /^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
			if(p.length == 0) {
				this.phoneErr = "手机号不能为空";
			} else if(!phoneReg.test(p)) {
				this.phoneErr = "无效的手机号";
			} else {
				var that = this;
				$.ajax({
					url: 'php/CheckUserPhone.php',
					type: 'post',
					data: JSON.stringify({"Phone":p}),
					success: function(data) {
						var jsonData = JSON.parse(data);
						if (jsonData.RESULT == "T") {
							that.phoneErr = "ok";
						} else {
							that.phoneErr = "此手机号已经被注册";
						}
					}
				});
			}
		},
		// 注册新会员,注册前进行所有验证
		handleRegister: function () {
			this.checkName();
			this.checkPassword();
			this.checkConfirmPassword();
			this.checkSex();
			this.checkImage();
			this.checkTrueName();
			this.checkPhone();
			if (this.nameErr=="ok" && 
				this.passwordErr=="ok" && 
				this.confirmPasswordErr=="ok" &&
				this.sexErr=="ok" &&
				this.imageErr=="ok" &&
				this.trueNameErr=="ok" &&
				this.phoneErr=="ok") {
				if (confirm("提交后所有信息不能修改，确认提交吗？")) {
					var that = this;
					$.ajax({
						url: 'php/RegisterUser.php',
						type: 'post',
						data: JSON.stringify({"Name": that.name, 
							"Password": that.password, 
							"Sex": that.sex == "man"? 0 : 1, 
							"Image": that.image, 
							"TrueName": that.trueName, 
							"Phone": that.phone 
						}),
						success: function(data) {
							var jsonData = JSON.parse(data);
							if (jsonData.RESULT == "T") {
								alert("恭喜你，注册成功！现在将跳转到首页！");
								that.$emit("click", jsonData.UserId, that.name);
							} else {
								console.log(jsonData.MSG);
								alert("注册失败！请联系管理员！");
							}
						}
					});
				}
			}
		}
	}
})