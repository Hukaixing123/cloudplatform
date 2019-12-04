<template>
<div>
    <div>
        <div>
            <!--编辑头像 -->
        </div>
        <div>
            <div>
                <!--未编辑的基本信息 -->
                <ul><!--姓名 -->
                    <li>姓名</li><li>xxx</li>
                </ul>
                <ul><!--性别 -->
                    <li>性别</li><li>男</li>
                </ul>
                <ul><!--工作签名 -->
                    <li>工作签名</li><li>好的</li>
                </ul>
                <ul><!--手机号 -->
                    <li>手机号</li><li>130xxxxx</li>
                </ul>
                <ul><!--邮箱 -->
                    <li>邮箱</li><li>bhwbcwj@163.com</li>
                </ul>
            </div>
            <div>
                <!--展开的编辑信息项 -->
                <a>编辑/收起</a>
                <ul>
                    <li>
                        <span>姓名</span><input>
                    </li>
                    <li>
                        <span>性别</span><label><input type="radio">男</label><label><input type="radio">女</label>
                    </li>
                    <li>
                        <span>工作签名</span><input>
                    </li>
                    <li>
                        <span>手机号</span><input>
                    </li>
                    <li>
                        <span>邮箱</span><input>
                    </li>
                </ul>
                <div>
                    <a>
                        <span>保存</span>
                    </a>  
                    <a>
                        <span>关闭</span>
                    </a>    
                </div>
            </div>
        </div>
        <div>
            <!--修改密码 -->
        </div>
    </div>
</div>
</template>

<script>
name:'personalCenter'
export default {
    data(){
        return{
            id:''
        }
    },
    mounted(){
        this.id = this.$route.query.id
    },
    watch:{
        $route:function(params) {
        this.id = this.$route.query.id
        }
    }
}
</script>

<style>

</style>
