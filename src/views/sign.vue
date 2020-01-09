<template>
<div @keyup.enter="LogSign()"><!-- 用created代码实现任意位置enter登录 -->
    <div class="logincontain">
        <div class="underline"></div>
        <div class="titlearea">
            <span class="titletext" onselectstart="return false;" :class='{on:signType}' @click="toogleway(true)">登录</span>
            <span class="titletext" onselectstart="return false;" :class='{on:!signType}' @click="toogleway(false)">注册</span>
        </div>
        <div class="msgarea">
            <form>
                <span>用户名</span>
                <input autofocus type="tel" maxlength="16" placeholder="用户名" v-model="username">
                <div v-show="!signType">
                    <p>用户名必须以字母开头，允许字母数字下划线，长度5-16</p>
                </div>
            </form>
            <form>
                <span>密 码</span>
                <input type="password" maxlength="10" placeholder="密码" v-show="hidPwd" v-model="password">
                <input type="text" maxlength="10" placeholder="密码" v-show="!hidPwd" v-model="password">
                <div class="tooglepwd" @click="hidPwd=!hidPwd">
                    <span onselectstart="return false;">⌨</span>
                </div>
                <div v-show="!signType">
                    <p>密码必须以字母开头，允许字母数字下划线，长度6-17</p>
                </div>
            </form>
        </div>
        <div class="loginbtn">
            <button @click="LogSign()">
                <span :class='{log:!signType}'>登录</span>
                <span :class='{log:signType}'>注册</span>
            </button>
        </div>
    </div>
</div>
</template>

<script>
import {login,register} from '../api/api'
name:'personalCenter'
export default {
    data(){
        return{
            signType:true,
            hidPwd:true,
            username:'',
            password:'',
            data:{},
            userInfo:{},
            flag:true,
        }
    },
    mounted(){
        
    },
    methods:{
        async LogSign(){
            const {flag,username,password,rightUsername,rightPassword,signType} = this
            if(!flag){return}
            if(!(username&&password)){
                //用户名或密码不能为空
                alert('用户名或密码不能为空')
            }else{
                if(!rightUsername){
                //用户名格式不对
                alert('用户名格式不对')
                }else{
                    if(!rightPassword){
                        //密码格式不对
                    alert('密码格式不对')
                    }else{
                        //格式正确
                        //防止短时间内重复点击提交异步请求
                        this.flag = false
                        setTimeout(() => {
                            this.flag = true
                        }, 3000)
                        if(signType){
                            //登录
                            const result = await login(username,password)
                            //保存data
                            this.userInfo = result.data
                            this.$store.dispatch('saveUserInfo',this.userInfo)
                            if(result.code===1){
                                alert('用户名或密码不正确')
                            }else{
                                //跳转首页
                                this.toH('首页')
                            }
                        }else{
                            //注册
                            const result = await register(username,password)
                            //保存data
                            this.userInfo = result.data
                            this.$store.dispatch('saveUserInfo',this.userInfo)
                            if(result.code===1){
                                alert('该用户名已被注册')
                            }else{
                                //跳转首页
                                this.toH('首页')
                            }
                        }
                    }
                }   
            }
        },
        toogleway(isSign){
            if(isSign){
                //登录
                this.signType = true
                this.$el.querySelector('.underline').style.transform = "translate(0)"
            }
            if(!isSign){
                //注册
                this.signType = false
                this.$el.querySelector('.underline').style.transform = "translate(200px,0)"
            }
        }
    },
    computed:{
        rightUsername(){
            return /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(this.username)
            //用户名必须以字母开头，允许字母数字下划线，长度5-16
        },
        rightPassword(){
            return /^[a-zA-Z]\w{6,17}$/.test(this.password)
            //密码必须以字母开头，允许字母数字下划线，长度6-17
        }
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    .log
        display: none

div.logincontain
    position absolute
    width 400px
    height 250px
    background-color white
    border 3px rgb(56, 59, 59) solid
    border-radius 20px
    left 27.8%
    top 50%
    div.underline
        transition 0.3s
        height 0
        width 31px
        border 1.8px rgba(255, 166, 0, 0.773) solid
        border-radius 5px
        position absolute
        left 82.7px
        top 30px
    div.titlearea
        cursor default
        height 38px
        border-radius 17px 17px 0 0
        span.titletext.on
            background-color rgb(65, 102, 102)
        span.titletext
            background-color rgb(107, 153, 153)
        span:first-child
            border-radius 16px 0 0 0
        span:last-child
            border-radius 0 16px 0 0
        span
            display inline-block
            width 200px
            height 38px
            line-height 35px
            margin 0
            float left
    div.msgarea
        height 211px
        background-color rgb(65, 102, 102)
        border-top 1px black solid
        border-radius 0 0 16px 16px
        form:first-child
            padding-top 42px
        form
            padding 20px 0
            position relative
            span
                display inline-block
                width 50px
                height 25px
                cursor default
            input
                width 175px
            div
                height 16px
                width max-content
                float left
                margin-left 70px
                p
                    font-size 8px
                    color grey
            div.tooglepwd
                position absolute
                margin 0
                right 11%
                top 32%
                span
                    cursor pointer
                    width 25px
                    height 25px
    div.loginbtn
        margin-top -50px
        button:hover
            background-color rgba(185, 212, 212, 0.623)
        button
            width 100px
            height 35px
            background-color rgb(75, 129, 129)
            border 1px black solid
            border-radius 10px
            span
                font-size 15px
</style>
