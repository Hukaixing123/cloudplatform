import {
    RECEVIE_USERS,
    RECEVIE_USER_INFO,
    RECEVIE_WORKERLIST,
    RECEVIE_WORKER,
    RECEVIE_WORKORDERLIST,
    RECEVIE_WORKORDER
} from './mutations-types'
import {
    getusers,
    getUserInfo,
    getWorkerList,
    getWorkOrderList,
    editWorkOrder,
} from '../api/api'

export default {
    //同步保存用户信息
    saveUserInfo({commit},userInfo){
        commit(RECEVIE_USER_INFO,{userInfo})
    },

    //异步保存用户信息
    async remainUserInfo({commit}){
        const result = await getUserInfo()//通过浏览器的session中的id异步请求登录
        if(result.code === 0){
            const userInfo = result.data
            commit(RECEVIE_USER_INFO,{userInfo})
        }else{
            commit(RECEVIE_USER_INFO,{code:1})
        }
    },

    //同步更新worker信息
    updateWorker({commit},{worker,index}){
        commit(RECEVIE_WORKER,{worker,index})
    },

    //异步获取worker列表信息
        async remainWorkerList({commit}){
        const result = await getWorkerList()
        if(result.code === 0){
            const workers = result.data
            commit(RECEVIE_WORKERLIST,{workers})
        }else{
            commit(RECEVIE_WORKERLIST,{code:1})
        }
    },
    
/*     //同步更新workorder信息
    updateWorkOrder({commit},{workOrder,index}){
        commit(RECEVIE_WORKORDER,{workOrder,index})
    }, */

    //异步获取workorder列表信息
    async remainWorkOrderList({commit}){
        const result = await getWorkOrderList()
        if(result.code === 0){
            const workOrders = result.data
            commit(RECEVIE_WORKORDERLIST,{workOrders})
        }else{
            commit(RECEVIE_WORKORDERLIST,{code:1})
        }
    },
    
    //注销登录删除worker和workorder数据
    clearWorkerandWorkOrder({commit},{workers,workOrders}){
        commit(RECEVIE_WORKERLIST,{workers})
        commit(RECEVIE_WORKORDERLIST,{workOrders})
    },

/*     //推进工单状态
    async updateOrderState({commit},{index,orderid,orderstate}){
        let data = {}
        data.orderstate = orderstate
        data.orderid = orderid
        console.log(data,orderid,orderstate)
        const result = await editWorkOrder(data)
        if(result.code === 0){
            console.log(result.data)
            const workOrder = result.data
            console.log(workOrder,index)
            commit(RECEVIE_WORKORDER,{workOrder,index})
            alert('状态推进成功')
        }else{
            commit(RECEVIE_WORKORDER,{code:1})
            console.log('失败',result.msg)
        }
    } */
}
