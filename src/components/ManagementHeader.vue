<template>
    <div class="headercontain">
        <div class="headerleft">
            <div>
                <h1 onselectstart="return false;">云平台工单系统</h1>
            </div>
        </div>
        <div class="headerright">
            <span>{{greeting[timeIndex]}}</span>
            <span onselectstart="return false;" class="pc" v-if="this.userInfo" @click="toPC()">{{this.userInfo.realname||''}}</span>
            <img class="pc" v-if="this.userInfo" @click="toPC('修改头像')" :src="userInfo.avatar">
            <a href="javascript:;" @click="logout()"><span>[退出]</span></a>
        </div>
        <div id="op"></div>
    </div>
</template>

<script>
import {logout} from '../api/api'
import {mapState} from 'vuex'
export default {
    name:'management-header',
    data(){
        return{
            greeting:[
                '早上好',
                '下午好',
                '晚上好',
            ],
            timeIndex:0
        }
    },
    computed:{
        ...mapState(['userInfo'])
    },
    methods:{
        test(){
            alert('hello')
        },
        async logout(){
            const c = confirm('是否确定退出登录？')
            if(c){
                const workers = []
                const workOrders = []
                this.toSign()
                this.$store.dispatch('saveUserInfo',{})
                this.$store.dispatch('clearWorkerandWorkOrder',{workers,workOrders})
                await logout()
                this.toSign()
            }
        },
        getTime(){
            let now = new Date()
            const hour = now.getHours()
            if(hour > 6 && hour < 12){
                this.timeIndex = 0
                return
            }
            if(hour > 12 && hour < 18){
                this.timeIndex = 1
                return
            }else{
                this.timeIndex = 2
            }
        }
    },
    mounted(){
        this.getTime()
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
img
  width:30px;
  height:30px;
  border-radius:15px

.pc:hover
    cursor pointer
    
span.pc:hover
    text-decoration underline

.headercontain
    padding 8px 10px 12px 10px
    overflow hidden
  
.headerleft
    float left 
    width 500px
    div
        margin 0 auto
        width max-content
        letter-spacing 10px
        line-height 42px
        h1
            cursor default

.headerright
    margin-top 10px
    margin-right 20px
    float right
    font-size 17px
    span:first-child
        cursor default
    img
        vertical-align middle
    a
        text-decoration none
        color black
        span
            cursor pointer!important
    a:hover
        color blue
</style>
