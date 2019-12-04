<template>
    <div>
        <div>
            <ul>
                <li><span @click="toH('首页')">首页</span></li>
                <li>
                    <span>个人中心</span>
                    <ul>
                        <li><span @click="toPC('基本信息')">基本信息</span></li>
                        <li><span @click="toPC('修改头像')">修改头像</span></li>
                        <li><span @click="toPC('修改密码')">修改密码</span></li>
                    </ul> 
                </li>
                <li><span>人员管理</span>
                    <ul>
                        <li><span @click="toWL('人员名单')">人员名单</span></li>
                        <li><span @click="toWN('新增人员')">新增人员</span></li>
                    </ul> 
                </li>
                <li><span>工单管理</span>
                    <ul>
                        <li><span @click="toWOL('工单列表')">工单列表</span></li>
                        <li><span @click="toWON('新建工单')">新建工单</span></li>
                    </ul> 
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name:'management-slider',
    methods:{
        toPC(val) {
            this.$router.push({
                path:'/personalCenter',
                query:{
                    id:val
                }
            })
        },
        toWL(val) {
            this.$router.push({
                path:'/workerList',
                query:{
                    id:val
                }
            })
        },
        toWN(val) {
            this.$router.push({
                path:'/workerNew',
                query:{
                    id:val
                }
            })
        },
        toWOL(val) {
            this.$router.push({
                path:'/workOrderList',
                query:{
                    id:val
                }
            })
        },
        toWON(val) {
            this.$router.push({
                path:'/workOrderNew',
                query:{
                    id:val
                }
            })
        },
        toH(val) {
            this.$router.push({
                path:'/home',
                query:{
                    id:val
                }
            })
        }
    }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
    div div ul li ul
        display :none
    div div ul li span:hover + ul
        display :block
    div div ul li ul:hover
        display :block
</style>
