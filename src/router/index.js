import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home'
import personalCenter from '../views/personalCenter'
import workerList from '../views/workerList'
import workerNew from '../views/workerNew'
import workOrderEdit from '../views/workOrderEdit'
import workOrderList from '../views/workOrderList'
import workOrderNew from '../views/workOrderNew'
import sign from '../views/sign'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      component: Home
    },
    {
      path: '/personalCenter',
      component: personalCenter,
    },
    {
      path: '/workerList',
      component: workerList,
    },
    {
      path: '/workerNew',
      component: workerNew
    },
    {
      path: '/workOrderList',
      component: workOrderList,
      children:[
        {
          path:'workOrderEdit',
          name:'workOrderEdit',
          component: workOrderEdit,
        }
      ],
    },
    {
      path: '/workOrderNew',
      component: workOrderNew
    },
    {
      path: '/sign',
      component: sign,
      meta:{
        isSigning:true
      }
    },
    {
      path: '/',
      redirect:'/home'
    }
  ]
})
