import {
    RECEVIE_USERS,
    RECEVIE_WORKERLIST,
    RECEVIE_WORKORDERLIST,
    RECEVIE_USER_INFO,
    RECEVIE_WORKER,
    RECEVIE_WORKORDER
} from './mutations-types'

export default {
    [RECEVIE_USERS](state,{users}){
        state.users = users
    },
    [RECEVIE_WORKERLIST](state,{workers}){
        state.workers = workers
    },
    [RECEVIE_USER_INFO](state,{userInfo}){
        state.userInfo = userInfo
    },
    [RECEVIE_WORKER](state,{worker,index}){
        state.workers[index] = worker
    },
    [RECEVIE_WORKORDERLIST](state,{workOrders}){
        state.workOrders = workOrders
    },
    [RECEVIE_WORKORDER](state,{workOrder,index}){
        state.workOrders[index] = workOrder
    },
}