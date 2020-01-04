<template>
    <div>
        <div class="filtercontain">
            <router-view></router-view>
            <div><span>条件筛选</span></div>
            <div class="filtersearch">
                <ul>
                    <li>
                        <span>工单号:</span><input v-model="currentKeyWord.ordercode">
                    </li>
                    <li>
                        <span>工单状态:</span><input v-model="currentKeyWord.orderstate">
                    </li>
                    <li>
                        <span>合作单位：</span><input v-model="currentKeyWord.cocompany">
                    </li>
                    <li>
                        <span>合同金额：</span><input v-model="currentKeyWord.moneyamount">
                    </li>
                </ul>
                <ul>
                    <li>
                        <span>工单名：</span><input v-model="currentKeyWord.ordername">
                    </li>
                    <li>
                        <span>施工队长：</span><input v-model="currentKeyWord.ordercaptain">
                    </li>
                    <li>
                        <span>工种：</span><input v-model="currentKeyWord.worktype">
                    </li>
                    <li v-show="this.userInfo.vip">
                        <span>创建人：</span><input  v-model="currentKeyWord.user">
                    </li>
                </ul>
            </div>
            <div class="btn">
                <!-- 按钮区 -->
                <button @click="filtrateWorkOrders(currentKeyWord)"><span>确定</span></button>
                <button @click="clearFilter()"><span>清除</span></button>
            </div>
        </div>
        <div class="tablecontain wo">
            <table class="wo">
                <!--表头 -->
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>单号</th>
                        <th>工单名</th>
                        <th>工单状态</th>
                        <th>施工队长</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <!--v-for的内容 -->
                <tbody>
                    <tr  :class="{workorderliston:(isWorkOrderSpreading && index === currentSpread)}"
                    v-for="(value,index) in filResult.slice((this.current-1)*this.countInEachPage,this.current*this.countInEachPage)" :key="index">
                        <div class="pos">
                            <div class="workorderopen" v-show="isWorkOrderSpreading && index === currentSpread">
                                <!--展开的详细内容 -->
                                <ul>
                                    <li>
                                        <span>单号：</span>
                                        <span>{{value.ordercode}}</span>
                                    </li>
                                    <li>
                                        <span>工单名：</span>
                                        <span>{{value.ordername}}</span>
                                    </li>
                                    <li>
                                        <span>工单状态：</span>
                                        <span>{{statetype[value.orderstate]}}</span>
                                    </li>
                                    <li>
                                        <span>施工队长：</span>
                                        <span>{{value.ordercaptain}}</span>
                                    </li>
                                    <li>
                                        <span>合作单位：</span>
                                        <span>{{value.cocompany}}</span>
                                    </li>
                                    <li>
                                        <span>工种：</span>
                                        <span>{{value.worktype}}</span>
                                    </li>
                                    <li>
                                        <span>合同金额：</span>
                                        <span>{{value.moneyamount}}元</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <td><span>{{iwod(index) + 1}}</span></td>
                        <td><span class="longbox">{{value.ordercode}}</span></td>
                        <td><span :title="value.ordername" class="longbox">{{value.ordername}}</span></td>
                        <td><span>{{statetype[value.orderstate]}}</span></td>
                        <td><span :title="value.ordercaptain" class="longbox">{{value.ordercaptain}}</span></td>
                        <td>
                            <a @click="workOrderSpread(index)" href="javascript:;">展开</a>
                            <a @click="workOrderEdit(iwod(index))" href="javascript:;">编辑</a>
                            <a @click="workOrderDelete(value._id)" href="javascript:;">删除</a>
                            <a @click="advanceOrderState(iwod(index))" href="javascript:;">👉</a><!-- 状态推进 -->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagecontain wolist">
            <div>
                <span>
                    共{{this.workOrders.length}}条,每页最多显示{{countInEachPage}}条
                </span>
            </div>
            <div>
                <!--选页 -->
                <div class="buttonarea">
                    <button @click="pageMove('-')">
                        <span>&lt;</span>
                    </button>
                    <ul>
                        <li class="pagenum" v-show="current > countShowPage/2 + 1" @click="current = 1"><span>1</span></li>
                        <li v-show="current > countShowPage/2 + 1"><span>...</span></li>
                        <li class="pagenum" v-for="index in this.pagesAll" :key="index" :class="{'pageCurrent':index === current}" 
                        v-show="Math.abs(index-current) <= countShowPage - 2 || (index === countShowPage && current === 1) || (index ===current - countShowPage + 1 && current === pagesAll && current > countShowPage)" 
                        @click="current = index">
                            <span>{{index}}</span>
                        </li>
                        <li v-show="(current < this.pagesAll - countShowPage/2) && (this.pagesAll > this.countShowPage)"><span>...</span></li>
                        <li class="pagenum" v-show="(current < this.pagesAll - countShowPage/2) && (this.pagesAll > this.countShowPage)" @click="current = pagesAll"><span>{{this.pagesAll}}</span></li>
                    </ul>
                    <button @click="pageMove('+')">
                        <span>></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template> 

<script>
name:'workOrderList'
import {mapActions,mapState} from 'vuex'
import {editWorkOrder,deleteWorkOrder,getUsers} from '../api/api'

export default {
    data(){
        return{
            statetype:['未完工','审核中','已完工',],
            workTypeList:['A类','B类','C类'],
            isWorkOrderSpreading:false,//工单展开页面
            currentSpread:-1,//当前展开工单
            current:1,//当前页面
            countInEachPage:10,//每页显示数量
            countShowPage:3,//显示的相邻页数
            currentKeyWord:{},//条件筛选对象
            filResult:[],//筛选后的数组
        }
    },
    computed:{
        ...mapState(['userInfo','workOrders']),
        pagesAll(){//总页数
            return Math.ceil(this.workOrders.length/this.countInEachPage)
        },
        currentWorkOrders:function(){
            let workOrders = []
            workOrders = JSON.parse(JSON.stringify(this.workOrders))
            return workOrders
        },
        iwod(){
            return function(index){
                //index是当前页内第几个，iwod(index)是实际整个数组第几个
                return index+(this.current-1)*this.countInEachPage
            }
        }
    },
    methods:{
        ...mapActions(['remainWorkOrderList']),
        async advanceOrderState(index){
            let c = confirm('确定要推进该工单状态？')
            if(c){
                //检查状态是否已经到最后
                let orderstate = this.workOrders[index].orderstate
                if(orderstate === 2){
                    alert(orderstate,'该工单已完工，无法继续推进')
                    return
                }
                let data = {}
                data.orderstate = orderstate + 1
                //action更改
                data.orderid = this.workOrders[index]._id
                const result = await editWorkOrder(data)
                if(result.code === 0){
                    this.remainWorkOrderList()
                    alert('状态推进成功')
                }else{
                    commit(RECEVIE_WORKORDER,{code:1})
                    alert('失败',result.msg)
                }
            } 
        },
        async workOrderDelete(_id){
            const c = confirm('确定删除该工单？')
            if(c){
                const result = await deleteWorkOrder(_id)
                if(result.code === 0){
                    //数据库里删除成功
                    this.remainWorkOrderList()
                    alert('删除成功')
                }else{
                    alert(result.msg||'删除失败')
                }
            }
        },
        workOrderSpread(index){
            //1.全关闭的时候，展开：iwoe = true && ce = index
            //2.展开的时候，关闭：iwoe = false && ce = -1
            //1.有展开的时候，展开其他：iwoe = true && ce = index
            if(index === this.currentSpread){
                this.isWorkOrderSpreading = !this.isWorkOrderSpreading
            }else{
                this.currentSpread = index
                this.isWorkOrderSpreading = true
                }
        },
        pageMove(val){
            if(val === '-'){
                //退页
                if(this.current === 1){
                    return
                }
                this.current--
                return
            }
            if(val === '+'){
                //进页
                if(this.current === this.pagesAll){
                    return
                }
                this.current++
                return
            }
        },
        workOrderEdit(i){
            //跳转路由
            this.toWOE(i)
        },
        async filtrateWorkOrders(currentKeyWord){
            //let filResult = this.workOrders
            let {filResult,workTypeList,statetype} = this
            filResult = JSON.parse(JSON.stringify(this.workOrders))
            //如果user有值，需要先获取user列表，查询对应人
           if(currentKeyWord.user){
                const result = await getUsers()
                if(result.code === 0){
                    //获取用户列表成功
                    const users = result.data
                    for(let k=0; k<users.length; k++){
                        let re = new RegExp(currentKeyWord.user,'i')
                        if(!re.test(users[k].realname)){
                            //找到不符合该user的id，根据id删掉对应工单
                            let wrongID = users[k]._id
                            for(let l=0; l<filResult.length; l++){
                                if(filResult[l].userid === wrongID)
                                    filResult.splice(l--,1)
                            }
                        }
                    }
                }else{
                    //获取用户列表失败
                    alert('搜索失败')
                    return
                }
            }
            //遍历属性,不符合的删掉对应工单
             for(let j in currentKeyWord){//
                for(let i=0; i<filResult.length; i++){
                    let re = new RegExp(currentKeyWord[j],'i')
                    if((!re.test(filResult[i][j])) && j!='user' && j!='worktype' && j!='orderstate'){
                        //由于user，worktype，orderstate都需要转化，且是根据元素确定下标，所以一个个分开
                        filResult.splice(i--,1)
                    }else{
                        if(j === 'worktype'){//worktype需要进行数字与文字的转换
                            re = new RegExp(currentKeyWord.worktype,'i')
                            let workTypeText = workTypeList[filResult[i].worktype - 1]
                            if(!re.test(workTypeText)){
                                filResult.splice(i--,1)
                            }
                        }else{
                            if(j === 'orderstate'){//orderstate需要进行数字与文字的转换
                                re = new RegExp(currentKeyWord.orderstate,'i')
                                let orderStateText = statetype[filResult[i].orderstate]
                                if(!re.test(orderStateText)){
                                    filResult.splice(i--,1)
                                }
                            }
                        }
                    }
                }
            }
            this.filResult = filResult
            if(!filResult.length){
                alert('找不到项目')
            } 
        },
        toWOE(val) {//跳转路由至工单编辑页面
            this.$router.push({
                path:'/workOrderList/workOrderEdit',
                query:{
                    id:val
                }
            })
        }, 
        clearFilter(){
            const {currentKeyWord} = this
            for(let i in currentKeyWord){
                currentKeyWord[i] = ''
            }
        }
    },
    mounted(){
        //发起action异步请求，获取workOrderList
        this.remainWorkOrderList()
    },
    watch:{
        current:{
            handler(){
                //清除编辑信息
                this.isWorkOrderSpreading = false
                this.currentSpread = -1
            }
        },
        workOrders(newVal,oldVal){
            this.filResult = this.workOrders
        }
    },
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
table,table tr th, table tr td
    border 1px solid black

.filtercontain
    float none
    width 100%
    height 167px
    margin-left 35px
    border 1px black solid
    border-radius 0 0 30px 30px
    background-color rgb(86, 163, 153)
    div.filtersearch
        height 108px
        ul:first-child
            float left
            li
                float left
        ul:last-child
            float right
            li
                float right
        ul
            width 50%
            li
                list-style none
                margin 2px 70px
                span
                    display inline-block
                    width 90px
                    text-align left
                input
                    width 300px
    div.btn
        margin-top 0
        button
            margin 10px 60px
div.tablecontain.wo
    padding-top 12px
    padding-bottom 5px
    table.wo
        width 542px
        min-height 25px
        line-height 25px
        text-align center
        border-collapse collapse
        padding:2px
        margin 0 auto
        margin-top 0px
        white-space nowrap
        tbody tr.workorderliston td
            span,a
                display inline-block
                margin-bottom 86px
        tbody tr
            div.pos
                width 100%
                position relative
                div.workorderopen
                    height 75px
                    overflow visible
                    width 778.222px
                    padding 5px 0
                    border 1px black solid
                    border-radius 0 0 20px 20px
                    background-color rgb(151, 186, 189)
                    position absolute
                    left 0
                    top 25px
                    ul
                        li
                            list-style none
                            float left
                            margin 0 60px
            th
                text-overflow ellipsis
                overflow hidden
            td
                overflow hidden
                text-overflow ellipsis
                min-width 30px
                span.workernamespan
                    width 115px
                    height 25px
                span
                    display inline-block
                    padding 0 15px
                a:first-child
                    display inline-block
                    margin-left 15px
                    margin-right 2px
                a:last-child
                    display inline-block
                    margin-left 2px
                    margin-right 15px
                span.longbox
                    width 130px
div.pagecontain.wolist
    margin-top 0
    div:first-child
        margin-left -550px
        margin-bottom 10px
    div.buttonarea
        margin-top 15px!important

div.workorderediting
    z-index 10
    width 100%
    height 100%
    background-color rgba(128, 128, 128, 0.7)
    position fixed
    top 0
    left 0
</style>
