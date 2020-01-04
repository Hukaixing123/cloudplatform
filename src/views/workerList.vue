<template>
<div>
    <div class="tablecontain">
        <table>
            <!--表头 -->
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th>姓名</th>
                    <th>性别</th>
                    <th>工种</th>
                    <th>手机号</th>
                    <th>操作</th>
                </tr>
            </thead>
            <!--v-for的内容 -->
            <tbody v-if="this.workers">
                <!-- v-for一个名单列表，根据页码分割该页显示哪些名单 -->
                <tr :class="{editworkerliston:(isWorkerEditing && index === currentEdit)}"
                v-for="(value,index) in this.workers.slice((this.current-1)*this.countInEachPage,this.current*this.countInEachPage)"
                :key=index>
                    <div class="pos">
                        <div class="editworkerarea" v-show="isWorkerEditing && index === currentEdit">
                            <!-- 编辑栏模块 -->
                            <div>
                                <!-- 信息编辑区 -->
                                <ul>
                                    <li>
                                        <span>姓名</span>
                                        <input v-model="currentWorker[iwrk(index)].workername">
                                    </li>
                                    <li>
                                        <span>
                                            性别
                                        </span>
                                        <label>
                                            <input type="radio" :name='`sex${index}`' value="1" v-model="currentWorker[iwrk(index)].sexual">
                                            <span>男</span>
                                        </label>
                                        <label>
                                            <input type="radio" :name='`sex${index}`' value="2" v-model="currentWorker[iwrk(index)].sexual">
                                            <span>女</span>
                                        </label>
                                    </li>
                                    <li>
                                        <span>工种</span>
                                        <span @click.stop="isWorkTypeSelecting = !isWorkTypeSelecting" onselectstart='return false;'>
                                            {{currentWorker[iwrk(index)].worktype}}
                                        </span>
                                        <ul v-show="isWorkTypeSelecting">
                                            <li v-for="(val,i) in workTypeList" :key="i" @click="selectWorkType(iwrk(index),i)">
                                                {{val}}
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span>手机号</span>
                                        <input v-model="currentWorker[iwrk(index)].phonenumber">
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <!-- 按钮区 -->
                                <a @click="updateWorkerEdit(iwrk(index))" href="javascript:;">保存</a>
                                <a @click="clearEditing()" href="javascript:;">关闭</a>
                            </div>
                        </div>
                    </div>
                    <td><span>{{iwrk(index) + 1}}</span></td>
                    <td><span :title="value.workername" class="workernamespan">{{value.workername}}</span></td>
                    <td><span>{{value.sexual===1 && '男' || value.sexual===2 && '女'}}</span></td>
                    <td><span>{{value.worktype}}</span></td>
                    <td><span>{{value.phonenumber}}</span></td>
                    <td>
                        <a @click="workerEdit(index)" href="javascript:;">编辑</a>
                        <a @click="workerDelete(value._id)" href="javascript:;">删除</a>
                    </td>

                </tr>
            </tbody>
            <tbody v-else><div>找不到数据</div></tbody>
        </table>
    </div>
    <div class="pagecontain">
        <div>
            <span>
                共{{this.workers.length}}条,每页最多显示{{countInEachPage}}条
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
name:'workerList'
import {mapState,mapActions} from 'vuex'
import {getWorkerList,deleteWorker,editWorker} from '../api/api'
export default {
    data(){
        return{
            current:1,//当前页面
            countInEachPage:10,//每页显示数量
            countShowPage:3,//显示的相邻页数
            isWorkerEditing:false,//人员编辑页面
            currentEdit:-1,//当前编辑人员
            isWorkTypeSelecting:false,//工种栏的开关
            workTypeList:['A类','B类','C类'],//工种列表
        }
    },
    methods:{
        ...mapActions(['remainWorkerList']),
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
        async workerDelete(_id){
            //删除员工
            //异步删除，然后更新vuex
            const c = confirm('确定删除该员工？')
            if(c){
                const result = await deleteWorker(_id)
                if(result.code === 0){
                    //数据库里删除成功
                    this.remainWorkerList()
                    alert('删除成功')
                }else{
                    alert(result.msg||'删除失败')
                }
            }
        },
        workerEdit(index){
            this.isWorkerEditing = true
            this.currentEdit = index
        },
        clearEditing(){
            //清除编辑信息
            this.isWorkerEditing = false
            this.currentEdit = -1
        },
        closeWorkTypeList(){
            if(this.isWorkTypeSelecting === true){this.isWorkTypeSelecting = false}
        },
        selectWorkType(index,i){
            //编辑栏选择显示
            this.currentWorker[index].worktype = this.workTypeList[i]
        },
        async updateWorkerEdit(index){
            //异步更新数据库该worker信息,需要传一个worker：{}的对象
            const worker = this.currentWorker[index]
            //检测名字是否有重复
            for(let i=0; i<this.currentWorker.length; i++){
                let arr = Object.keys(this.currentWorker[i])
                console.log('i')
                for(let j in arr){
                    const keyname = arr[j]
                    if(this.currentWorker[i][keyname] === worker.workername && this.currentWorker[i]._id != worker._id){
                        alert('该名字已被使用')
                        return
                    }
                }

            }
            
            const result = await editWorker(worker)
            if(result.code === 1){return alert(result.msg||'未知错误')}
            if(result.code === 0){
                //保存到vuex
                this.$store.dispatch('updateWorker',{worker,index})
                alert('编辑成功')
                this.isWorkerEditing = false
            }
        },
    },
    mounted(){
        this.remainWorkerList()
        document.addEventListener('click',this.closeWorkTypeList)//点击其他位置关闭工种栏
    },
    watch:{
        current:'clearEditing'
    },
    computed:{
        ...mapState(['workers']),
        pagesAll(){
            return Math.ceil(this.workers.length/this.countInEachPage)
        },
        currentWorker:function(){
            let workers = []
            workers = JSON.parse(JSON.stringify(this.workers))
            return workers
        },
        iwrk(){
            return function(index){
                return index+(this.current-1)*this.countInEachPage
            }
        }
    }
}

</script>

<style lang='stylus' rel='stylesheet/stylus'>


table,table tr th, table tr td
    border 1px solid black
div.tablecontain
    padding-top 30px
    table
        width 542px
        min-height 25px
        line-height 25px
        text-align center
        border-collapse collapse
        padding:2px
        margin 0 auto
        margin-top 20px
        white-space nowrap
        thead tr th,td
            text-overflow ellipsis
            overflow hidden
        tbody tr.editworkerliston td
            span,a
                display inline-block
                margin-bottom 62px
        tbody tr
            div.pos
                width 100%
                position relative
                div.editworkerarea
                    width 539px
                    padding 5px 0
                    border 1px black solid
                    border-radius 0 0 20px 20px
                    background-color rgb(151, 186, 189)
                    position absolute
                    left 0
                    top 25px
                    div:first-child
                        width 436px
                        li
                            list-style none
                            float left
                            margin 0 20px
                    div
                        float left
                        margin-left 0px
                        width 102px
                        a:first-child
                            display inline-block
                            margin-left 15px
                            margin-right 2px
                        a:last-child
                            display inline-block
                            margin-left 2px
                            margin-right 15px
            td
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
div.pagecontain
    margin-top 0
    div:first-child
        margin-left -300px
        margin-bottom 10px
    div.buttonarea
        margin-top 15px!important
</style>
