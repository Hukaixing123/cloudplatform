<template>
    <div>
        <div class="workercontain">
            <!-- 内容区 -->
            <ul>
                <li>
                    <span>
                        姓名
                    </span>
                    <input :class="{err:(this.blankError === 1)}" autofocus v-model="workername">
                </li>
                <li>
                    <span>
                        性别
                    </span>
                    <label :class="{err:(this.blankError === 2)}">
                        <input type="radio" name="sex" value="1" v-model="sexual">
                        <span>男</span>
                    </label>
                    <label :class="{err:(this.blankError === 2)}">
                        <input :class="{err:(this.blankError === 2)}" type="radio" name="sex" value="2" v-model="sexual">
                        <span>女</span>
                    </label>
                </li>
                <li>
                    <span>
                        工种
                    </span>
                    <span :class="{err:(this.blankError === 3),worktypeEdit:isWorkTypeSelecting}" class="selectinput" @click.stop="isWorkTypeSelecting = !isWorkTypeSelecting" onselectstart='return false;'>
                        {{this.worktype||'--未选择--'}}
                    </span>
                    <ul class="worktype" v-show="isWorkTypeSelecting">
                        <li v-for="(value,index) in workTypeList" :key="index" @click="selectWorkType(index)">
                            {{value}}
                        </li>
                    </ul>
                </li>
                <li>
                    <span>
                        手机号
                    </span>
                    <input v-model="phonenumber" :class="{err:(this.blankError === 4)}">
                </li>
            </ul>
            <div class="btn">
                <!-- 按钮区 -->
                <button>
                    <span @click="newWorker()">保存</span>
                </button>
                <button @click="cancelNew()">
                    <span>取消</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
name:'workerNew'
//import {mapState} from 'vuex'
import {createWorker} from '../api/api'
export default {
    computed:{
        //...mapState(['userInfo']),
        isRightNumber(){//验证手机号
            return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.phonenumber)
        },
    },
    mounted(){
        document.addEventListener('click',this.closeWorkTypeList)//点击其他位置关闭工种栏
    },
    methods:{
        closeWorkTypeList(){
            if(this.isWorkTypeSelecting === true){this.isWorkTypeSelecting = false}
        },
        selectWorkType(index){
            this.worktype = this.workTypeList[index]
        },
        async newWorker(){
            const {workername,sexual,phonenumber,worktype} = this
            let arr = [workername,sexual,worktype,phonenumber]
            for(let i=1; i<arr.length+1; i++){
                if(!arr[i-1]){
                    switch(i){
                        case 1:{
                            alert('姓名不能为空')
                            this.blankError = 1
                            break
                        }
                        case 2:{
                            alert('性别不能为空')
                            this.blankError = 2
                            break
                        }
                        case 3:{
                            alert('工种不能为空')
                            this.blankError = 3
                            break
                        }
                        case 4:{
                            alert('手机号不能为空')
                            this.blankError = 4
                            break
                        }
                    }
                    return
                }
            }
            if(!this.isRightNumber){
                alert('手机号格式有误')
                this.blankError = 4
                return
            }
            const c = confirm('确定要在工作人员名单新建该工作人员？')
            if(c){
                //新建员工
                //发起后台请求
                const result = await createWorker(workername,sexual,worktype,phonenumber)
                if(result.code === 1){
                    alert(result.msg||'新增失败')
                }
                if(result.code === 0){
                    alert('创建成功')
                    //跳转页面到WorkerList
                    this.toWL()
                }
            }
        },
        cancelNew(){
            const c = confirm('员工还没新增，是否继续？')
            if(c){
                this.toWL()
            }
        }
    },
    data(){
        return{
            workername:'',
            sexual:0,
            worktype:'',
            phonenumber:'',
            isWorkTypeSelecting:false,//工种栏的开关
            workTypeList:['A类','B类','C类'],//工种列表
            blankError:0,//未填信息
        }
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>



div.workercontain
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
            list-style none
            list-style none
            vertical-align center
            margin 20px auto
            label.err
                background-color rgba(221, 61, 61, 0.78)
            label
                margin-left -5px
                letter-spacing 10px
                input
                    position relative
                    left: 5px;
                    top: 3px;
                    width 20px
                    height 20px
                    border-radius 50%
                    margin 0 5px
                span
                    display inline-block
                    width max-content
                    text-align center
                    float none
                    margin-right 50px
                    line-height 20px
                    height 20px
            span:first-child
                width 80px
                text-align left
                margin-left 60px
                margin-right 20px
            span.selectinput:hover
                border-color rgba(27, 110, 148, 0.8)
            span.selectinput
                display inline-block
                width 171px
                border 1px solid black
                border-radius 5px
                height 28px
                line-height 28px
                cursor pointer
            span.worktypeEdit
                background-color rgba(93, 131, 145,0.5)
            span.selectinput.err
                border 1px solid red
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
            ul.worktype
                z-index 10
                position absolute
                left 165px
                top 32px
                padding 0
                width 171px
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

    .btn
        margin-top -60px
        button
            margin 0 50px



</style>
