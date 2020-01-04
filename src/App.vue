<template>
  <div id="app">
    <management-header v-show="!$route.meta.isSigning" id="header"></management-header>
    <div class="contain">
      <management-slider v-show="!$route.meta.isSigning" id="nav"></management-slider>
      <router-view class="content"></router-view>
    </div>

  </div>
</template>

<script>
import ManagementHeader from "./components/ManagementHeader";
import ManagementSlider from "./components/ManagementSlider";
import {login,register,getusers,getUserInfo} from "./api/api";
import { async } from 'q';
import {mapState, mapActions} from 'vuex';

export default {
  name: 'App',
  mounted(){
    this.remainUserInfo()//每次渲染页面都去session取用户id，实现自动登录

    this.checksign()

  },
  data(){
    return{
    }
  },
  methods:{
    ...mapActions(['remainUserInfo']),

    async checksign(){
      const result = await getUserInfo()
      if(result.code === 0){
        //已登录
        if(this.$route.meta.isSigning){
          //已登录,正在登陆页面
          this.$router.replace('/home')
        }else{
          //已登录,不在登陆页面
        }
      }else{
        //未登录
        if(this.$route.meta.isSigning){
          //未登录,正在登陆页面
        }else{
          //未登录,不在登陆页面
          this.$router.replace('/sign')
          console.log('先登录')
        }
      }
    }

  },
  watch:{
  },
  components:{
    ManagementHeader,
    ManagementSlider
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
input
  border 1px solid black
  border-radius 3px
  padding 2px

table
  background-color rgb(229, 236, 238)
  tbody,thead
    border 3px black solid
    border-radius 20px

.btn button
    border 1px black solid
    background-color rgba(150, 200, 207, 0.771)
    margin 10px
    border-radius 10px
    margin 10px 5px
    text-align center
    height 25px
    width 50px
    span:hover
        background-color rgb(182, 212, 214)
        transition 0s
        cursor pointer
    span
        display inline-block
        line-height 23px
        border-radius 10px
        height 23px
        width 100%
        vertical-align middle
        transition 0s

div.pagecontain
  margin-top 5px
  div:first-child
    margin-bottom 10px
  div:last-child
    height 30px
    width 100%
    position relative
    div.buttonarea
      margin 0 auto
      margin-top 100px
      width max-content
      button,ul,ul li
        float left
        height 100%
      button,ul li
        margin 0 10px
        height 100%
      button:hover,ul li.pagenum:hover
        background-color rgb(182, 212, 214)
      button,ul li.pagenum
        background-color rgba(150, 200, 207, 0.771)
        border 1px solid black
        border-radius 5px
      button
        width 30px
      ul
        li.pageCurrent
          background-color  rgb(95, 142, 148)
        li
          list-style none
          display inline
          width 28px
          height 28px
          span:hover
            cursor default
          span
            display inline
            line-height 30px



*
  padding 0
  margin 0
html
  padding 0
  margin 0
  height 0
  body
    background-color rgba(33, 108, 121, 0.180)
    margin 0
    padding 0
    width 100%
    height 100%
    left auto
    height 0
    text-align center
    #app    
      margin 0
      padding 0
      height 0
      left auto
      height 0
      width 100%
      position relative
      #header
        margin 0 auto
        top 0
        background rgb(203, 212, 214)
        position fixed
        width 100%
        height 40px
        z-index 2
        border 1px black solid
      .contain
        margin-top 60px
        #nav
          z-index 1
          position fixed
          width 160px
          height 100%
          margin 0
          padding 0
          div
            margin 0
            width 160px
        div.content
          position relative
          float none
          width 1120px
          height 180px
          margin 0
          margin-left 160px
          padding 0


</style>
