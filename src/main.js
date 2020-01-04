// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store'
import Router from 'vue-router'
import {getUserInfo} from './api/api'
import VCharts from 'v-charts'
import VeLine from 'v-charts/lib/line.common'
import VePie from 'v-charts/lib/pie.common'
const date = require('silly-datetime')



Vue.use(VCharts)

Vue.component(VeLine.name, VeLine)
Vue.component(VePie.name, VePie)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


Vue.prototype.axios = axios

Vue.prototype.date = date

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store,
  data: function () {
    return {
    }
  }
})

router.beforeEach((to,from,next)=>{
  checksign(to,from,next)
})

async function checksign(to,from,next){
  const result = await getUserInfo()
  if(result.code === 0){
    //已登录
    if(to.path === '/sign'){
      //已登录不能去登陆页面
      next({path:from.path})
    }else{
      if(result.data._id != store.state.userInfo._id){
        await store.dispatch('remainUserInfo')
      }
        next()
    }
  }else{
    //未登录
    if(to.path !== '/sign'){
      //未登录只能去登陆页面
      next({path:'/sign'})
    }else{
      next()
    }
  }
}

Vue.prototype.toPC = function(val) {
  this.$router.push({
      path:'/personalCenter',
      query:{
          id:val
      }
  })
}

Vue.prototype.toWL = function(val) {
  this.$router.push({
      path:'/workerList',
      query:{
          id:val
      }
  })
}

Vue.prototype.toWN = function(val) {
  this.$router.push({
      path:'/workerNew',
      query:{
          id:val
      }
  })
}

Vue.prototype.toWOL = function(val) {
  this.$router.push({
      path:'/workOrderList',
      query:{
          id:val
      }
  })
}

Vue.prototype.toWON = function(val) {
  this.$router.push({
      path:'/workOrderNew',
      query:{
          id:val
      }
  })
}

Vue.prototype.toH = function(val) {
  this.$router.push({
      path:'/home',
      query:{
          id:val
      }
  })
}

Vue.prototype.toSign = function(val) {
  this.$router.push({
      path:'/sign',
      query:{
          id:val
      }
  })
}