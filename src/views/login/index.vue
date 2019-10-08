<template>
    <div class="login-container" :style="{backgroundImage: 'url(' + backg + ')' }">
        <div class="login-shadow"></div>
        <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">
            <h3 class="title">在线压力检测系统管理后台</h3>
            <el-form-item prop="username">
                <span class="svg-container">
                    <svg-icon icon-class="user" />
                </span>
                <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="username" />
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input :type="pwdType" v-model="passwords" name="password" auto-complete="on" placeholder="password" @keyup.enter.native="handleLogin" />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon icon-class="eye" />
                </span>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
                    登录
                </el-button>
            </el-form-item>
            <!-- <div class="tips">
                <span style="margin-right:20px;">用户名: admin</span>
                <span> 密码: admin</span>
            </div> -->
        </el-form>
        <div class="shadow hide"></div>
        <div class="browser hide">
            <div class="browser_top">
                提 示
            </div>
            <div class="browser_cen">
                <p>您的浏览器版本过低，为保证功能正常使用，</p>
                <p>建议将浏览器升级到最新版本，或通过下方链接直接下载。</p>
            </div>
            <div class="browser_bot"></div>
            <div class="browser_icon">
                <a download href="/browser/IE.exe">
                    <div class="browser_icon_1" onselectstart="return false">
                        <div onselectstart="return false">IE</div>
                    </div>
                </a>
                <a download href="/browser/chrome.exe">
                    <div class="browser_icon_2" onselectstart="return false">
                        <div onselectstart="return false">Google</div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
//import { isvalidUsername } from '@/utils/validate'
import { loginByUsername } from "@/api/login";

export default {
  name: "Login",
  data() {
    // const validateUsername = (rule, value, callback) => {
    //     if (!isvalidUsername(value)) {
    //         callback(new Error('请输入正确的用户名'))
    //     } else {
    //         callback()
    //     }
    // }
    // const validatePass = (rule, value, callback) => {
    //     if (value.length < 5) {
    //         callback(new Error('密码不能小于5位'))
    //     } else {
    //         callback()
    //     }
    // }
    return {
      loginForm: {
        username: "",
        password: ""
      },
      passwords: "",
      backg: require("../../assets/img/bg.jpg"),
      // loginRules: {
      //     username: [{ required: true, trigger: 'blur', validator: validateUsername }],
      //     password: [{ required: true, trigger: 'blur', validator: validatePass }]
      // },
      loading: false,
      pwdType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.loginForm.password = this.$md5(this.passwords);
      loginByUsername(this.loginForm).then(response => {
        //console.log(response)
        if (response.data.excuCode) {
          localStorage.setItem("tokenCon", response.data.data.token);
          localStorage.setItem("userId", response.data.data.id);
          this.$router.push({ path: this.redirect || "/" });
        } else {
          this.$alert(response.data.message, "提示", {
            confirmButtonText: "确定",
            // callback: action => {
            //   this.$message({
            //     type: "info",
            //     message: `action: ${action}`
            //   });
            // }
          });
        }
      });
      // this.$refs.loginForm.validate(valid => {
      //     if (valid) {
      //         this.loading = true
      //         this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
      //             this.loading = false
      //             this.$router.push({ path: this.redirect || '/' })
      //         }).catch(() => {
      //             this.loading = false
      //         })
      //     } else {
      //         console.log('error submit!!')
      //         return false
      //     }
      // })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-shadow {
  position: fixed;
  height: 100%;
  width: 100%;
  background: transparent;
}
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: no-repeat;
  background-size: 100%;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    background: $bg;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

.shadow{
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background-color: #ABABAB;
	opacity: 0.5;
	filter: alpha(opacity=50);
	z-index: 10001;
}
.browser {
	width: 540px;
	height: 360px;
	z-index: 10002;
	position: fixed;
	top: 50%;
	left: 50%;
	margin-left: -270px;
	margin-top: -180px;
	background-color: white;
	-webkit-border-radius: 4px;
	-moz-border-radius: 4px;
	border-radius: 4px;
}
.browser_top {
	width: 540px;
	height: 50px;
	background-color: #EEEEEE;
	text-align: center;
	line-height: 50px;
	color: #333333;
	font-size: 16px;
}
.browser_cen {
	width: 400px;
	text-align: center;
	margin: 60px auto;
	height: 50px;
	font-size: 14px;
	color: #666666;
	line-height: 24px;
}
.browser_bot{
	width: 391px;
	height: 15px;
	margin: 0 auto;
	background: url(http://demo.primecloud.cn/home/image/index/font.png) no-repeat;
}
.browser_icon{
	width: 200px;
	height: 120px;
	margin: 20px auto 0;
}
.browser_icon_1{
	width: 40px;
	height: 38px;
	float: left;
	background: url(http://demo.primecloud.cn/home/image/index/ie.png) no-repeat;
	cursor: pointer;
}
.browser_icon_1 div, .browser_icon_2 div {
	margin-top: 50px;
	text-align: center;
	color: #209EEA;
	font-size: 14px;
	width: 60px;
	margin-left: -10px;
	cursor: pointer;
}
.hide{
    display:none;
}
.browser_icon_2{
	width: 40px;
	height: 38px;
	float: left;
	margin-left: 120px;
	background: url(http://demo.primecloud.cn/home/image/index/chrome.png) no-repeat;
	cursor: pointer;
}
</style>
