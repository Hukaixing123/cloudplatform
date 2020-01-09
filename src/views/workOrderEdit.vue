<template>
<div class="workorderediting">
    <div class="wodeitcontain" :class="{doublePage:isOrderCaptainSelecting}">
        <div class="titlecontain">
            <!-- 表头文字说明 -->
            <span>工单编辑</span>
        </div>
        <div class="workordereditarea">
            <!-- 内容区 -->
            <ul>
                <li>
                    <span>工单号</span>
                    <input readonly v-model="currentEdit.ordercode">
                </li>
                <li>
                    <span>工单名</span>
                    <input :class="{err:(this.blankError === 1)}" v-model="currentEdit.ordername">
                </li>
                <li>
                    <span>
                        工种
                    </span>
                    <label>
                        <input type="radio" name="worktype" value="1" v-model="currentEdit.worktype">
                        <span>A类</span>
                    </label>
                    <label>
                        <input type="radio" name="worktype" value="2" v-model="currentEdit.worktype">
                        <span>B类</span>
                    </label>
                    <label>
                        <input type="radio" name="worktype" value="3" v-model="currentEdit.worktype">
                        <span>C类</span>
                    </label>
                </li>
                <li>
                    <span>
                        施工队长
                    </span><!-- 此处为input,输入workername，点击搜索或enter查找对应列表，选择后 -->
                    <input :class="{err:(this.blankError === 2)}" v-model="currentEdit.ordercaptain" readonly placeholder="点击选择施工队长" @click="openCaptainSelect()">
                    <div class="captainarea" v-show="isOrderCaptainSelecting">
                        <!-- z轴为1的灰色背景 -->
                        <div class="captaincontain">
                            <!-- 施工队长选择窗口 -->
                            <div class="serachcontain">
                                <input v-model="keywordCaptain" v-on:input = 'filtrateCaptainList'>
                                <a @click="filtrateCaptainList()"><span>🔍</span></a>
                            </div>
                            <div class="captainlist">
                                <!-- 列表 -->
                                <ul id="avwkList">
                                    <li v-for="(value,index) in availiableCaptain" :key="index"
                                    @click="selectOrderCaptain(index)" v-on:dblclick='selectOrderCaptain(index),confirmCaptain()'>
                                        <span>{{value.workername}}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="btn">
                                <!-- 按钮区 -->
                                <button @click="confirmCaptain()">确定</button>
                                <button @click="closeCaptainSelect()">关闭</button>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <span>
                        合作单位
                    </span>
                    <span onselectstart="return false;" class="selectinput" :class="{coCompanySelecting:isCoCompanySelecting}" @click.stop="isCoCompanySelecting = !isCoCompanySelecting">
                        {{currentEdit.cocompany || '--未选择--'}}
                    </span>
                    <ul class="cocompany" v-show="isCoCompanySelecting">
                        <li v-for="(value,index) in coCompanyList" :key="index"
                        @click="selectCoCompany(index)">
                            {{value}}
                        </li>
                    </ul>
                </li>
                <li>
                    <span>合同金额</span>
                    <input :class="{err:moneyErr || this.blankError === 3}" v-on:input = 'testMoneyAmount' v-model="currentEdit.moneyamount">
                </li>
            </ul>
        </div>
        <div class="btn">
            <!-- 按钮区 -->
            <button @click="updateWorkOrder()"><span>保存</span></button>
            <button @click="cancelEdit()"><span>取消</span></button>
        </div>
    </div>
</div>
</template>

<script>
name:'workOrderEdit'
import {mapActions,mapState} from 'vuex'
import {editWorkOrder} from '../api/api'
export default {
    data(){
        return{
            isSave:false,
            count:0,
            isOrderCaptainSelecting:false,
            keywordCaptain:'',
            orderCaptainList:[],
            temporaryWorkType:'',
            coCompanyList:[
                '自建',
                '中铁',
                '中交'
            ],
            workTypeList:[
                'A类',
                'B类',
                'C类'
            ],
            isCoCompanySelecting:false,
            isOrderCaptainSelecting:false,
            keywordCaptain:'',
            availiableCaptain:[],
            currentEdit:{},
            blankError:0,
            moneyErr:false,
            flag:true,
        }
    },
    computed:{
        ...mapState(['workOrders','workers']),
        isRightMoneyamount(){
            const reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^[1-9]$)|(^\d\.[1-9]{1,2}$)|(^\d\.[0]{1}[1-9]{1}$|(^\d\.[1-9]{1}[0]{1}$)$)/
            return reg.test(this.currentEdit.moneyamount)
        },
    },
    mounted(){
        this.remainWorkOrderList()
        if(!this.workers.length){
            //vuex里没有workers，需要发起异步请求获得并保存到vuex
            this.remainWorkerList()
        }
        window.onbeforeunload = function (e) {//刷新重新回到初始编辑状态
            if(!this.isSave){
                e = e || window.event;
                // 兼容IE8和Firefox 4之前的版本
                if (e) {
                    e.returnValue = '离开页面将无法保存数据，是否继续？';
                }
                // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
                return '离开页面将无法保存数据，是否继续？';
            }
        }
    },
    destroyed(){
        window.onbeforeunload = null
    },
    methods:{
        testMoneyAmount(){
            if(!this.isRightMoneyamount){
                this.moneyErr = true
            }else{
                this.moneyErr = false
            }
        },
        async updateWorkOrder(){
            //if(!this.flag){return}
            //检查金额格式是否有误
            if(!this.isRightMoneyamount){
                this.moneyErr = true
                alert('合同金额格式不正确')
                return
            }
            //检查是否有空缺项
            const {ordername,ordercaptain,moneyamount} = this.currentEdit
            let arr = [ordername,ordercaptain,moneyamount]
            console.log(arr)
            for(let i = 1; i<arr.length; i++){
                if(!arr[i-1]){
                    switch(i){
                        case 1:{
                            alert('工单名不能为空')
                            this.blankError = 1
                            break
                        }
                        case 2:{
                            alert('施工队长不能为空')
                            this.blankError = 2
                            break
                        }
                        case 3:{
                            alert('合同金额不能为空')
                            this.blankError = 3
                            break
                        }
                    }
                    return
                }
            }
            this.isSave = true
            this.currentEdit.orderid = this.currentEdit._id
            //防止短时间内重复点击提交异步请求
            this.flag = false
            setTimeout(() => {
                this.flag = true
            }, 3000)
            const result = await editWorkOrder(this.currentEdit)
            if(result.code === 1){
                alert(result.msg || '编辑失败')
            }else{
                alert('编辑成功')
                //vuex更新state上的数据
                this.remainWorkOrderList()
                this.toWOL()
            }
            //console.log(this.currentEdit,this.workOrders[this.$route.query.id])

        },
        ...mapActions(['remainWorkOrderList','remainWorkerList']),
        selectCoCompany(index){
            this.currentEdit.cocompany = this.coCompanyList[index]
            this.isCoCompanySelecting = false
        },
        openCaptainSelect(){
            if(!this.currentEdit.worktype){
                alert('请先选择工种')
                return
            }
            this.isOrderCaptainSelecting = true
            this.resetAvailiableCaptain()
        },
        filtrateCaptainList(){
            //根据this.keywordCaptain搜索this.orderCaptainList的内容，并传进this.availiableCaptain
            const {keywordCaptain,workers,workTypeList} = this
            const {worktype} = this.currentEdit
            this.availiableCaptain = []
            for(let i=0; i<workers.length; i++){
                let reKWC = new RegExp(keywordCaptain,'i')
                if(reKWC.test(workers[i].workername) && workers[i].worktype === workTypeList[worktype - 1]){
                    this.availiableCaptain.push(workers[i])
                    //console.log(workers[i].worktype,workTypeList[worktype - 1])
                }
            }
        },
        resetAvailiableCaptain(){
            const {availiableCaptain,keywordCaptain,workers,workTypeList} = this
            const {worktype} = this.currentEdit
            if(!availiableCaptain.length || keywordCaptain === ''){
                this.availiableCaptain = []
                for(let i=0; i<workers.length; i++){
                    if(workers[i].worktype === workTypeList[worktype - 1]){
                        this.availiableCaptain.push(workers[i])
                        //console.log(workers[i].worktype,workTypeList[worktype - 1])
                    }
                }
            }
            this.availiableCaptain = []
            for(let i=0; i<workers.length; i++){
                if(workers[i].worktype === workTypeList[worktype - 1]){
                    this.availiableCaptain.push(workers[i])
                    //console.log(workers[i].worktype,workTypeList[worktype - 1])
                }
            }
        },
        closeCoCampanyList(){
            //if(this.isCoCompanySelecting === true){this.isCoCompanySelecting = false}
        },
        selectOrderCaptain(index){
            this.keywordCaptain = this.availiableCaptain[index].workername
        },
        confirmCaptain(){
            const {keywordCaptain,availiableCaptain} =this
            //先确认keywordCaptain是否有写东西
            if(!keywordCaptain){
                alert('请选择施工队长')
                return
            }
            //先确认这个workername是否自行编辑了一个不存在的
            let isKeywordCorrect = false
            for(let i=0; i<availiableCaptain.length; i++){
                if(availiableCaptain[i].workername === keywordCaptain){
                    isKeywordCorrect= true
                    break
                }
            }
            if(!isKeywordCorrect){
                alert('没有该员工')
                this.keywordCaptain = ''
                return
            }
            this.currentEdit.ordercaptain = this.keywordCaptain
            this.isOrderCaptainSelecting = false
        },
        closeCaptainSelect(){
            const {currentEdit} = this
            this.isOrderCaptainSelecting = false
            if(!currentEdit.ordercaptain){
                this.keywordCaptain = ''
            }else{
                this.keywordCaptain = currentEdit.ordercaptain
            }
        },
        openCaptainSelect(){
            //const {worktype,keywordCaptain,workers,workTypeList} = this
            if(!this.currentEdit.worktype){
                alert('请先选择工种')
                return
            }
            this.isOrderCaptainSelecting = true
            this.resetAvailiableCaptain()
        },
        cancelEdit(){
            const c = confirm('工单编辑还没保存，是否继续？')
            if(c){
                this.isSave = true
                this.toWOL()
            }
        }
    },
    watch:{
        workOrders(){
            this.currentEdit =  JSON.parse(JSON.stringify(this.workOrders[this.$route.query.id]))
        },
        'currentEdit.worktype'(){
            if(this.count++){//只有第一次变化的时候不清零（因为第一次变化是空对象的currentEdit接收state里的对象，
                this.currentEdit.ordercaptain = ''
            }
            this.resetAvailiableCaptain()
            //console.log(this.currentEdit.worktype,this.workOrders[this.$route.query.id].worktype)
        }
    },
    beforeRouteLeave (to, from , next) {
        //单纯防止在为保存的情况下路由跳转
        if(!this.isSave){
            const answer = window.confirm('离开页面会导致编辑内容丢失，是否继续？')
            if (answer) {
                next()
            } else {
                next(false)
            }
        }else{
            next()
        }
    },
}
</script>


<style lang='stylus' rel='stylesheet/stylus'>
input.err
    border-color red

div.workorderediting
    div.wodeitcontain.doublePage
        width 800px!important
    div.wodeitcontain
        position absolute
        width 480px
        height 530px
        background-color rgb(86, 163, 153)
        border 3px solid rgb(40, 53, 68)
        border-radius 20px
        left 25%
        top 11%
        div.titlecontain
            height 40px
            width 100%
            background-color rgb(55, 105, 99)
            border-radius 18px 18px 0 0
            span
                display inline-block
                height 40px
                line-height 40px
                font-size 25px
                letter-spacing 5px
        div.workordereditarea
            ul
                background-color rgba(33, 108, 121, 0.062)
                position absolue
                margin 0
                margin-left 30px
                padding 40px
                padding-top 20px
                width 450px
                height 100%
                text-align left
                li
                    position relative
                    cursor default
                    list-style none
                    vertical-align center
                    margin 30px auto
                    .captainarea .captaincontain
                        position absolute
                        width 300px
                        height 370px
                        background-color rgb(86, 163, 153)
                        border 3px solid rgb(40, 53, 68)
                        border-radius 20px
                        left 380px
                        top -180px
                        div.serachcontain
                            height 25px
                            padding 10px
                            input,a
                                float left
                            input
                                margin-left 18px
                                height 20px
                            a
                                width 25px
                                height 23px
                                margin-left 20px
                                border 1px solid black
                                border-radius 5px
                                cursor pointer
                                background-color rgba(150, 200, 207, 0.771)
                                span
                                    line-height 23px
                                    margin 0
                                    width 25px
                                    text-align center
                        div.captainlist
                            background-color rgb(130, 197, 188)
                            height 280px
                            ul#avwkList
                                height 200px
                                overflow scroll
                                position inherit
                                width 300px
                                height 100%
                                padding 0
                                margin 0
                                border-radius 0
                                li:hover
                                    background-color rgba(93, 131, 145,0.5)
                                    span
                                        transition 0.1s
                                        transform scale(1.3)
                                li
                                    transition 0.1s
                                    margin 0 auto
                                    overflow hidden
                                    cursor default
                                    span
                                        margin-left 10px
                                        line-height 30px
                                        width max-content
                                        -moz-transform-origin 0 50%
                                        -webkit-transform-origin 0 50%
                                        -o-transform-origin 0 50%
                        div.btn
                            position relative
                            margin-top 8px
                            height 25px
                            button
                                float left
                                height 32px
                                margin 0 50px
                                span
                                    margin 0 auto
                                    width 48px
                                    line-height 30px
                                    text-align center
                    span.selectinput:hover
                        border-color rgba(27, 110, 148, 0.8)
                    span.selectinput
                        display inline-block
                        width 204px
                        border 1px solid black
                        border-radius 5px
                        height 28px
                        line-height 28px
                        cursor pointer
                        text-align center
                    span.coCompanySelecting
                        background-color rgba(93, 131, 145,0.5)
                    span
                        width 80px
                        display inline-block
                    input
                        width 200px
                    label
                        margin-left -12px
                        letter-spacing 1px
                        input
                            position relative
                            left: 5px;
                            top: 3px;
                            width 20px
                            height 20px
                            margin 0 5px
                        span
                            display inline-block
                            width max-content
                            text-align center
                            float none
                            margin-right 20px
                            line-height 20px
                            height 20px
                    ul.cocompany
                        z-index 10
                        position absolute
                        margin 0
                        left 85px
                        top 32px
                        padding 0
                        width 206px
                        height 120px
                        background-color rgb(222, 228, 230)
                        border-radius 10px
                        li:hover
                            background-color rgba(93, 131, 145,0.5)
                            cursor default
                        li:first-child
                            border-radius 8px 8px 0 0
                        li:last-child
                            border-radius 0 0 8px 8px
                        li
                            width 100%
                            height 40px
                            margin 0
                            text-align center
                            line-height 40px
        
</style>
