<template>
    <div>
        <div id="sliderContain">
            <ul>
                <li><span @click="toH('首页'),toogleOpen()" onselectstart="return false;">首页</span></li>
                <li class="navlist" :class="{liston:pcOpen}">
                    <span id="pcOpen" @click="toogleOpen('pcOpen')" :class="{liston:pcOpen}" onselectstart="return false;">个人中心</span>
                    <ul :class="{hidden:!pcOpen}">
                        <li><span @click="toPC('修改头像')" onselectstart="return false;">修改头像</span></li>
                        <li><span @click="toPC('基本信息')" onselectstart="return false;">基本信息</span></li>
                        <li><span @click="toPC('修改密码')" onselectstart="return false;">修改密码</span></li>
                    </ul> 
                </li>
                <li class="navlist" :class="{liston:workerOpen}">
                    <span id="workerOpen" @click="toogleOpen('workerOpen')" :class="{liston:workerOpen}" onselectstart="return false;">人员管理</span>
                    <ul :class="{hidden:!workerOpen}">
                        <li><span @click="toWL('人员名单')" onselectstart="return false;">人员名单</span></li>
                        <li><span @click="toWN('新增人员')" onselectstart="return false;">新增人员</span></li>
                    </ul> 
                </li>
                <li class="navlist" :class="{liston:WorkOrderOpen}">
                    <span id="WorkOrderOpen" @click="toogleOpen('WorkOrderOpen')" :class="{liston:WorkOrderOpen}" onselectstart="return false;">工单管理</span>
                    <ul :class="{hidden:!WorkOrderOpen}">
                        <li><span @click="toWOL('工单列表')" onselectstart="return false;">工单列表</span></li>
                        <li><span @click="toWON('新建工单')" onselectstart="return false;">新建工单</span></li>
                    </ul> 
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name:'management-slider',
    data(){
        return{
            pcOpen:false,
            workerOpen:false,
            WorkOrderOpen:false,
        }
    },
    methods:{
        toogleOpen(val){
            const {pcOpen,workerOpen,WorkOrderOpen} = this
            const o = {pcOpen,workerOpen,WorkOrderOpen}
            if(pcOpen||workerOpen||WorkOrderOpen){
                //有一个开了
                for(let i in o){
                    if(o[i]){
                        if(i === val){
                            //是自己
                            this[val] = false
                            this.slide(val,false)
                        }else{
                            //不是自己
                            this[i] = false
                            this.slide(i,false)
                            this[val] = true
                            this.slide(val,true)
                        }
                    }
                }
            }else{
                //都没开
                this.slide(val,true)
                this[val] = true
            }
        },
        slide(val,isOpen){
            const translateA = isOpen?"translate(0,121px)":"translate(0)"
            const translateB = isOpen?"translate(0,173px)":"translate(0)"
            let workerLi = this.$el.querySelector('#workerOpen').parentElement
            let workOrderLi = this.$el.querySelector('#WorkOrderOpen').parentElement
            if(val === 'workerOpen'){//worker开关
                workOrderLi.style.transform=translateA
            }
            if(val === 'pcOpen'){//PC开关
                workerLi.style.transform=translateB
                workOrderLi.style.transform=translateB
            }
        }
    }
}

</script>

<style lang='stylus' rel='stylesheet/stylus'>



.hidden
    opacity 0
    visibility hidden




#sliderContain
    margin 0
    background-color white
    width 180px
    height 100%
    ul
        background-color rgb(125, 177, 184)
        height 100%
        border 1px black solid
        border-radius 0 5px 0 0
        font-size 18px
        font-font-family 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
        li.liston
            background-color rgb(107, 150, 156)
            border-radius 10px 10px 0 0
        li
            border 1px black solid
            background-color rgb(114, 160, 167)
            margin 10px
            border-radius 10px
            margin 10px 5px
            list-style none
            text-align center
            height 40px
            transition 0.4s
            span:hover
                background-color rgb(182, 212, 214)
                transition 0s
                cursor pointer
            span.liston
                background-color rgb(95, 142, 148)
                border-radius 10px 10px 0 0
                transition 0.3s
            span.liston:hover
                background-color rgb(173, 208, 210)
                transition 0s
            span
                display inline-block
                line-height 40px
                border-radius 10px
                height 40px
                width 100%
                vertical-align middle
                transition 0s
            ul
                border-radius 0 0 10px 10px
                width 136px
                padding 5px
                margin 0 0 0 -1px
                transition 0.2s
                padding-top 10px
                height max-content
                background-color rgb(122, 173, 180)
                li
                    margin 0
                    margin-bottom  10px
                    transition 0.3s
</style>
