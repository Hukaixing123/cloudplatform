<template>
<div>
            <!-- 新建/编辑工单 -->
    <div class="workordercontain">
        <ul>
            <li>
                <span>
                    工单名
                </span>
                <input :class="{err:(this.blankError === 1)}" autofocus v-model="ordername">
            </li>
            <li>
                <span>
                    工种
                </span>
                <label :class="{err:(this.blankError === 2)}">
                    <input type="radio" name="worktype" value="1" v-model="worktype">
                    <span>A类</span>
                </label>
                <label :class="{err:(this.blankError === 2)}">
                    <input type="radio" name="worktype" value="2" v-model="worktype">
                    <span>B类</span>
                </label>
                <label :class="{err:(this.blankError === 2)}">
                    <input type="radio" name="worktype" value="3" v-model="worktype">
                    <span>C类</span>
                </label>
            </li>
            <li>
                <span>
                    施工队长
                </span><!-- 此处为input,输入workername，点击搜索或enter查找对应列表，选择后 -->
                <input :class="{err:(this.blankError === 3)}" v-model="ordercaptain" readonly placeholder="点击选择施工队长" @click="openCaptainSelect()">
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
                            <button @click="confirmCaptain()"><span>确定</span></button>
                            <button @click="closeCaptainSelect()"><span>关闭</span></button>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <span>
                    合作单位
                </span>
                <span class="selectinput" :class="{err:(this.blankError === 4),coCompanySelecting:isCoCompanySelecting}" @click.stop="isCoCompanySelecting = !isCoCompanySelecting">
                    {{cocompany || '--未选择--'}}
                </span>
                <ul class="cocompany" v-show="isCoCompanySelecting">
                    <li v-for="(value,index) in coCompanyList" :key="index"
                    @click="selectCoCompany(index)">
                        {{value}}
                    </li>
                </ul>
            </li>
            <li>
                <span>
                    合同金额
                </span>
                <input :class="{err:moneyErr || this.blankError === 5}" v-on:input = 'testMoneyAmount' v-model="moneyamount">
            </li>
        </ul>
        <div class="btn">
            <!-- 按钮区 -->
            <button @click="newWorkOrder()">
                <span>保存</span><!-- 新建工单时需要传user._id -->
            </button>
            <button @click="cancelNew()">
                <span>取消</span>
            </button>
        </div>
    </div>
</div>
</template>

<script>
name:'workOrderNew'
import {mapState} from 'vuex'
import {createWorkOrder} from '../api/api'
export default {
    data(){
        return{
            ordername:'',
            worktype:'',
            ordercaptain:'',
            cocompany:'',
            moneyamount:0,
            orderCaptainList:[],
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
            moneyErr:false,
            blankError:0,//未填项
            isSave:false,
        }
    },
    computed:{
        ...mapState(['workers','userInfo']),
        isRightMoneyamount(){
            const reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^[1-9]$)|(^\d\.[1-9]{1,2}$)|(^\d\.[0]{1}[1-9]{1}$|(^\d\.[1-9]{1}[0]{1}$)$)/
            return reg.test(this.moneyamount)
        }
    },
    methods:{
        selectCoCompany(index){
            this.cocompany = this.coCompanyList[index]
            this.isCoCompanySelecting = false
        },
        filtrateCaptainList(){
            //根据this.keywordCaptain搜索this.orderCaptainList的内容，并传进this.availiableCaptain
            const {keywordCaptain,workers,workTypeList,worktype} = this
            this.availiableCaptain = []
            for(let i=0; i<workers.length; i++){
                let reKWC = new RegExp(keywordCaptain,'i')
                if(reKWC.test(workers[i].workername) && workers[i].worktype === workTypeList[worktype - 1]){
                    this.availiableCaptain.push(workers[i])
                    //console.log(workers[i].worktype,workTypeList[worktype - 1])
                }
            }
        },
        closeCoCampanyList(){
            if(this.isCoCompanySelecting === true){this.isCoCompanySelecting = false}
        },
        selectOrderCaptain(index){
            this.keywordCaptain = this.availiableCaptain[index].workername
        },
        confirmCaptain(){
            //先确认keywordCaptain是否有写东西
            if(!this.keywordCaptain){
                alert('请选择施工队长')
                return
            }
            //先确认这个workername是否自行编辑了一个不存在的
            let isKeywordCorrect = false
            for(let i=0; i<this.availiableCaptain.length; i++){
                if(this.availiableCaptain[i].workername === this.keywordCaptain){
                    isKeywordCorrect= true
                    break
                }
            }
            if(!isKeywordCorrect){
                alert('没有该员工')
                this.keywordCaptain = ''
                return
            }
            this.ordercaptain = this.keywordCaptain
            this.isOrderCaptainSelecting = false
        },
        closeCaptainSelect(){
            this.isOrderCaptainSelecting = false
            if(!this.ordercaptain){
                this.keywordCaptain = ''
            }else{
                this.keywordCaptain = this.ordercaptain
            }
        },
        openCaptainSelect(){
            //const {worktype,keywordCaptain,workers,workTypeList} = this
            if(!this.worktype){
                alert('请先选择工种')
                return
            }
            this.isOrderCaptainSelecting = true
            this.resetAvailiableCaptain()
        },
        testMoneyAmount(){
            if(!this.isRightMoneyamount){
                this.moneyErr = true
            }else{
                this.moneyErr = false
            }
        },
        async newWorkOrder(){
            const {ordername,worktype,ordercaptain,cocompany,moneyamount} = this
            //检查金额格式是否有误
            if(!this.isRightMoneyamount){
                this.moneyErr = true
                alert('合同金额格式不正确')
                return
            }
            //检查是否有空缺项
            let arr = [ordername,worktype,ordercaptain,cocompany,moneyamount]
            for(let i = 1; i<arr.length; i++){
                if(!arr[i-1]){
                    switch(i){
                        case 1:{
                            alert('工单名不能为空')
                            this.blankError = 1
                            break
                        }
                        case 2:{
                            alert('工种不能为空')
                            this.blankError = 2
                            break
                        }
                        case 3:{
                            alert('施工队长不能为空')
                            this.blankError = 3
                            break
                        }
                        case 4:{
                            alert('合作单位不能为空')
                            this.blankError = 4
                            break
                        }
                        case 5:{
                            alert('合同金额不能为空')
                            this.blankError = 5
                            break
                        }
                    }
                    return
                }
            }
            const userid = this.userInfo._id
            const result = await createWorkOrder(userid,ordername,worktype,ordercaptain,cocompany,moneyamount)
            if(result.code === 1){
                alert(result.msg||'工单创建失败')
                return
            }
            if(result.code === 0){
                //console.log(result.data)
                this.isSave = true 
                this.toWOL()//成功跳转页面
            }
        },
        resetAvailiableCaptain(){
            const {availiableCaptain,worktype,keywordCaptain,workers,workTypeList} = this
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
        cancelNew(){
            const c = confirm('工单还没创建，是否继续？')
            if(c){
                this.isSave = true
                this.toWOL()
            }
        }
    },
    mounted(){
        if(!this.workers.length){
            //vuex里没有workers，需要发起异步请求获得并保存到vuex
            this.$store.dispatch('remainWorkerList')
        }
        document.addEventListener('click',this.closeCoCampanyList)//点击其他位置关闭工种栏
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
    watch:{
        worktype:{
            handler(){
                this.ordercaptain = ''
                this.resetAvailiableCaptain()
            }
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

div.workordercontain
    float none
    width 100%
    height 100% 
    padding-top 60px
    margin 0 auto
    ul
        background-color rgba(33, 108, 121, 0.062)
        border-radius 30px
        border 1.5px solid rgb(40, 53, 68)
        position absolue
        margin 0 auto
        padding 40px
        width 450px
        height 350px
        text-align left
        li
            position relative
            cursor default
            list-style none
            vertical-align center
            margin 20px auto
            .captainarea
                width 100%
                height 100%
                background-color rgba(128, 128, 128, 0.7)
                position fixed
                top 0
                left 0
                z-index 10
                .captaincontain
                    position absolute
                    width 300px
                    height 370px
                    background-color rgb(86, 163, 153)
                    border 3px solid rgb(40, 53, 68)
                    border-radius 20px
                    left 45%
                    top 20%
                    div.serachcontain
                        height 25px
                        padding 12px 10px 8px 10px
                        input,a
                            float left
                        input
                            margin-left 25px
                        a
                            width 25px
                            height 23px
                            margin-left 25px
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
            label.err
                background-color rgba(221, 61, 61, 0.78)
            label
                margin-left -5px
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
            span:first-child
                width 80px
                text-align left
                margin-left 60px
                margin-right 20px
            span.selectinput.err
                border 1px solid red
            span.selectinput:hover
                border-color rgba(27, 110, 148, 0.8)
            span.selectinput
                display inline-block
                width 173px
                border 1px solid black
                border-radius 5px
                height 28px
                line-height 28px
                cursor pointer
            span.coCompanySelecting
                background-color rgba(93, 131, 145,0.5)
            span
                display inline-block
                text-align center
                float none
                min-height 30px
                height auto!important
                height 30px
                width 400px
            input.err
                border red 2px solid
            input
                height auto
                overflow hidden
                min-height 20px
            ul.cocompany
                z-index 10
                position absolute
                left 165px
                top 32px
                padding 0
                width 173px
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
    div.btn
        margin-top -60px
        button
            margin 0 50px

</style>
