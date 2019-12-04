import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home'
import personalCenter from '../views/personalCenter'
import workerList from '../views/workerList'
import workerNew from '../views/workerNew'
import workOrderList from '../views/workOrderList'
import workOrderNew from '../views/workOrderNew'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      component: Home
    },
    {
      path: '/personalCenter',
      component: personalCenter
    },
    {
      path: '/workerList',
      component: workerList
    },
    {
      path: '/workerNew',
      component: workerNew
    },
    {
      path: '/workOrderList',
      component: workOrderList
    },
    {
      path: '/workOrderNew',
      component: workOrderNew
    },
    {
      path: '/',
      redirect:'/home'
    }
  ]
})
