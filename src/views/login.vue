<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">白泽后台管理系统</h3>
      <el-form-item prop="username">
        <div class="login-logo">
          <img src="../assets/images/loginLogo.png" alt="">
        </div>
        <el-input
            v-model="loginForm.username"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="账号"
        >
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
            v-model="loginForm.code"
            size="large"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-class="validCode" class="el-input__icon input-icon"/>
          </template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
            :loading="loading"
            size="large"
            type="primary"
            style="width:100%;"
            @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">

      <ul class="records">
        <li>Copyright © 2021-2024 ibaize.vip All Rights Reserved.</li>
        <li><a href="http://beian.miit.gov.cn">蒙ICP备2021004875号</a></li>
        <li><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=15058102000039">蒙公网安备
          15058102000039号</a>
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAMAAAC3SZ14AAACBFBMVEVHcEzknkbrvFL04pfow2v//9apiXD/5K3ks1Pq0o736ajt3I3w5MDRq3bn0o7t7bfoxmTy56Tw26b256jqy3vbo1HgrV/v4LH0u1HpwHm+lnP36cv05admSVDcqV+WcVFsW2KIgHjZol/48cPfo1DOkEXdp0/MilTpwGzlrVLpwFjjr1zqzIbduX3msVjTmmXltFLr2HzkvmDt2YHw3HbjuGTz3HjgsFJfPEHqxXHisHOldFrPsYn10WfXvJfw4oh0cXVcRVmFeG/bwZulgWmsjGGmbkHNrH1SOVjywWLfs27vqkndr3Hxy5yMgXXrvlnouFQhI3MbHHjhpkrsx1/enUfVHBXXjD7ttlPTJRl3dnrIRSXXLBfosk3pwV7lvGP10mH0ylzZRiTXZy3ghz/npEEXC2LXVCjrbzLhTyLnu1vs0Wrpx2bzw1boqk+pkmTzyGi7qnaRZUTWlVGzHhcoD1mdCBn3NRPbeTvjkz5tYmnWOB+xo3vPBwS6VSvLVCTQFg7Xr2RseosiFGceKYotQozuezTalUbtwVmTWDPr22zgMxq3llZgHkuKemeFiI1EAEBuJ0rhfDPZEQ3Xu3DZbjjUXDBVV3RcAz2+Lh+il3WpCh21Li7FYT/pZi/dbjCzn2m9pm3kol5pV1rrXB/aBwgTDXO/sIaVhHqxl3aggFekcEYg5SEkAAAAc3RSTlMA/PqN3gbRBP4VKVE9xiQO53lZZuL+2078sKIuQ/vj/v395zXYqst0wuT0z5xi4zrsytiM7OPw+vnN0tuk8IWv+vjqgN7w76/6sX/trDbr///////////////////////////////////////////////+NgsVowAAAXJJREFUGNNjYAACdk4eZzY2Ox5OVgYoYBeXsnYrknd1kRKHiUmzWXTWpc8vzpdlkwYLsCq7yxYlh1UnxaTMUrDhAqlT5vVYPKk7LLK6IWZRlCMvF9Agbr8g+SWTI8PCImvnzQp04mZn8PVUDFqduTQyKSmmNnNhoIM9D4OX94qgVW0N0eHBFTFtCwIVbZkZfBhXtiik1kcnV0xN8a8KqpGQZFCqbGxtrstIj56WnjG3uXVKqhiDUnhE07Ky8sz65Izy2WlN/oxiDLyMictbJpSVlMyMnjMjsLCAQ5LBKjSvoD8wrbR3YmlaUFRIBIclg4hoMWN8YV9Ufk/V9KjG1FAOEQZBFtHwFImExNyIkK6OynZzFmEGfmEBjvBQoIh/QkJeaDyLECsDuxBLSBaHf1xcSEAwR06OKdBDnMxm2fFZAQH+AcHBAXHZJsycDOxcxkYGTEyxsbEB/loChoJ87MDQ4dRXV1VT0dTT1tDR5eNnYAAAHI5j3PTE3yIAAAAASUVORK5CYII=">
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {getCodeImg} from "@/api/login";
import Cookies from "js-cookie";
import {encrypt, decrypt} from "@/utils/jsencrypt";
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const router = useRouter();
const {proxy} = getCurrentInstance();

const loginForm = ref({
  username: "admin",
  password: "admin123",
  companyId: "1",
  rememberMe: false,
  code: "",
  uuid: ""
});

const loginRules = {
  username: [{required: true, trigger: "blur", message: "请输入您的账号"}],
  password: [{required: true, trigger: "blur", message: "请输入您的密码"}],
  code: [{required: true, trigger: "change", message: "请输入验证码"}]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, {expires: 30});
        Cookies.set("password", encrypt(loginForm.value.password), {expires: 30});
        Cookies.set("rememberMe", loginForm.value.rememberMe, {expires: 30});
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore.login(loginForm.value).then(() => {
        router.push({path: redirect.value || "/"});
      }).catch(() => {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          getCode();
        }
      });
    }
  });
}

function getCode() {
  getCodeImg().then(res => {
    captchaEnabled.value = res.data.captchaEnabled;
    register.value = res.data.registerEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = res.data.img;
      loginForm.value.uuid = res.data.uuid;
    }
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
    companyId:"1"
  };
}

getCode();
getCookie();
</script>

<style lang='scss' scoped>
.records{
  margin: 0;
  padding: 0;
  height: 40px;
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  list-style-type: none;
  justify-content: center;

  li {
    line-height: 40px;
    font-size: 14px;
    font-weight: 300;
    color: #000;
    margin:0  25px;
    //margin-right: 50px;
    a {
      color: #000;
      text-decoration:none
    }
    img {
      vertical-align: middle;
      margin: -5px 0 0 5px;
      width: 18px;
    }
  }
}
.login-logo {
  position: absolute;
  top: -211px;
  left: -24px;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
