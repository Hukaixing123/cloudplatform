<template>
<div>
    <div class="bigcontain pc">
        <div class="containPC">
            <!--编辑头像 -->
            <div class="avatar">
                <div>
                    <div class="head_img">
                        <img @click.stop="uploadHeadImg" :src="userInfo.avatar || defaultAvatar"/>
                        <!-- 图片地址动态绑定 -->
                    </div>
                    <input type="file" accept="image/*" @change="handleFile" class="hiddenInput"/>
                </div>
            </div>
        </div>
        <div class="containPC">
            <div class="basic" :class="{editBasic:this.EditBasic}">
                <div class="editbtn" :class="{editBasic:this.EditBasic}">
                    <a @click="EditBasic = !EditBasic" onselectstart="return false;">{{!EditBasic && '编辑' || EditBasic && '收起'}}</a>
                </div>
                <div v-show="!EditBasic">
                    <!--未编辑的基本信息 -->
                    <ul><!--姓名 -->
                        <li>用户名：</li><li>{{this.userInfo.username}}</li>
                    </ul>
                    <ul><!--姓名 -->
                        <li>姓名：</li><li>{{this.userInfo.realname||'未填写姓名'}}</li>
                    </ul>
                    <ul><!--性别 -->
                        <li>性别：</li><li>{{(this.userInfo.sexual === 1 && '男')||(this.userInfo.sexual === 2 && '女')||(this.userInfo.sexual||'未选择性别')}}</li>
                    </ul>
                    <ul><!--工作签名 -->
                        <li>工作签名：</li><li>{{this.userInfo.signature||'未填写工作签名'}}</li>
                    </ul>
                    <ul><!--手机号 -->
                        <li>手机号：</li><li>{{this.userInfo.phonenumber||'未填写手机号'}}</li>
                    </ul>
                    <ul><!--邮箱 -->
                        <li>邮箱：</li><li>{{this.userInfo.email||'未填写邮箱'}}</li>
                    </ul>
                </div>
            </div>
            <div class="editbasic" v-show="EditBasic">
                <!--展开的编辑信息项 -->
                <ul>
                    <li>
                        <span>姓名：</span><input :value = this.realname ref="rn">
                    </li>
                    <li>
                        <span>性别：</span>
                        <label><input name="sex" type="radio" :checked = this.isMale ref="sx1">男</label>
                        <label><input name="sex" type="radio" :checked = this.isFemale ref="sx2">女</label>
                    </li>
                    <li>
                        <span>工作签名：</span><input :value = this.signature ref="sn">
                    </li>
                    <li>
                        <span>手机号：</span><input :value = this.phonenumber ref="pn">
                    </li>
                    <li>
                        <span>邮箱：</span><input :value = this.email ref="em">
                    </li>
                </ul>
                <div class="btn" v-show="EditBasic">
                    <button>
                        <span @click="update()">保存</span>
                    </button>  
                    <button>
                        <span @click="EditBasic = false">关闭</span>
                    </button>    
                </div>
            </div>
        </div>
        <div class="containPC">
            <!--修改密码 -->
            <div class="pwd">
                <button @click="EditPWD = true">
                    <span>修改密码</span>
                </button>
            </div>
            <div @keyup.enter="changePWD()" class="editpwd" v-show="EditPWD"><!-- 虚化背景 -->
                <div class="pwdcontain"><!-- 颜色区 -->
                    <div>
                        <form>
                            <input type="password" maxlength="10" placeholder="原密码" v-model="oldpwd">
                            <input type="password" maxlength="10" placeholder="新密码" v-model="newpwd">
                            <input type="password" maxlength="10" placeholder="新密码" v-model="newpwd2">
                        </form>

                    </div>
                    <div>
                        <p>密码必须以字母开头，允许字母数字下划线，长度6-17</p>
                    </div>
                    <div class="btn">
                        <button @click="changePWD()"><span>确定</span></button>
                        <button @click="EditPWD = false"><span>关闭</span></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
name:'personalCenter'

import {mapState,mapGetters} from 'vuex'
import {updateUserInfo,test,changePassword}  from '../api/api'

export default {
    data(){
        return{
            EditBasic:false,
            oldpwd:'',
            newpwd:'',
            newpwd2:'',
            EditPWD:false,
            a:'',
            defaultAvatar:'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=390947329,3335162149&fm=26&gp=0.jpg'
        }
    },
    methods:{
     async update(){
            const realname = this.$refs.rn.value
            const signature = this.$refs.sn.value
            const male = this.$refs.sx1.checked
            const female = this.$refs.sx2.checked
            let sexual = this.sexual
            if(male){
                sexual = 1
            }else{
                if(female){
                    sexual = 2
                }
            }
            const phonenumber = this.$refs.pn.value
            const email = this.$refs.em.value
            //先取得vuex里的userInfo
            const ui = this.$store.state.userInfo
            //将信息一个个保存到对象里
            const userInformation = Object.assign(ui,{realname,signature,sexual,phonenumber,email})
            //数据保存到数据库
            const result = await updateUserInfo(userInformation)
            if(result.code === 1){alert('更新失败')}
            if(result.code === 0){
                //数据保存到vuex
                this.$store.dispatch('remainUserInfo')
            }
            //关闭编辑栏
            this.EditBasic = false
        },
        async changePWD(){
            const {oldpwd,newpwd,newpwd2,rightPassword} = this
            //密码框不可以为空
            if(!(oldpwd && newpwd && newpwd2)){
                alert('密码框不可以为空')
            }else{
                //校验两个新密码是否一致
                if(newpwd != newpwd2){
                    alert('新密码不一致，请重新输入')
                }else{
                //校验新旧密码是否一致
                    if(newpwd === oldpwd){
                        alert('新密码不可以与原密码一致')
                    }else{
                //校验新密码是否符合格式
                        if(!rightPassword){
                            alert('密码格式不对')
                        }else{
                            const c = confirm('是否确定修改密码？')
                            if(c){
                //异步请求后台函数将数据库password更新
                                const result = await changePassword(oldpwd,newpwd)
                                if(result.code === 1){
                                    console.log(result.msg||'修改失败')
                                }else{
                                    console.log('修改成功')
                                    this.EditPWD = false//关闭修改密码框
                                }
                            }
                        }
                    }
                }
            }
        },
       // 打开图片上传
        uploadHeadImg(){
            this.$el.querySelector('.hiddenInput').click()//相当于间接点击input，触发其type为file的事件
        },
        // 将头像显示
        handleFile(e){
            let $target = e.target || e.srcElement
            let file = $target.files[0]
            if(file && file.size > 64*1024){
                alert('图片格式过大，请上传小于64kb的图片')
                return
            }else{
                if(!file){
                    console.log('what?')
                    return
                }
            }
            let reader = new FileReader()
            reader.readAsDataURL(file)
            const that = this
            reader.onload = async function(e){
                const ui = that.userInfo
                const userInfo = Object.assign(ui,{avatar:this.result})
                const result = await updateUserInfo(userInfo)
                if(result.code === 1){
                    alert('更新失败')
                    }
                if(result.code === 0){
                    that.$store.dispatch('remainUserInfo')
                }
            }
            
        },
        scrollTo(id){
            const distance = (id === '基本信息' && 210) || (id === '修改头像' && 0) || (id === '修改密码' && 500) || 0
             // Chrome
            document.body.scrollTop = distance
            // Firefox
            document.documentElement.scrollTop = distance
            // Safari
            window.pageYOffset = distance
        }
    },
    mounted(){
        const id = this.$route.query.id
        this.scrollTo(id)
    },
    computed:{
        ...mapState([
            'userInfo'
        ]),
        realname(){
            return this.$store.state.userInfo.realname
        },
        signature(){
            return this.$store.state.userInfo.signature
        },
        sexual(){
            return this.$store.state.userInfo.sexual
        },
        isMale(){
            if(this.sexual === 1){
                return true
            }else{
                return false
            }
        },
        isFemale(){
            if(this.sexual === 2){
                return true
            }else{
                return false
            }
        },
        phonenumber(){
            return this.$store.state.userInfo.phonenumber
        },
        email(){
            return this.$store.state.userInfo.email
        },
        rightPassword(){
            return /^[a-zA-Z]\w{5,17}$/.test(this.newpwd)
            //密码必须以字母开头，允许字母数字下划线，长度6-17
        }
    },
    watch:{
        $route:function(params) {
            const id = this.$route.query.id
            this.scrollTo(id)
        },
        EditPWD:function(EditPWD){
            if(!EditPWD){
                this.oldpwd = ''
                this.newpwd = ''
                this.newpwd2 = ''
            }
        }
    }
}

</script>

<style lang='stylus' rel='stylesheet/stylus'>

.hiddenInput
  display: none

div.content
    position relative
    float none
    width 1120px
    height 180px
    margin 0
    margin-left 160px
    padding 0
    div.bigcontain.pc
        width 1020px
        height 884px
        padding 50px
        margin 0
        .containPC
            width 700px
            margin 0 auto
            margin-bottom 45px
            position relative
            .avatar
                height 150px
                float none
                .head_img
                    img:hover
                        cursor pointer
                        transform scale(1.5)
                        border-radius 10px
                    img
                        width 150px
                        height 150px
                        border-radius 100px
                        transition 0.3s
            .basic.editBasic
                background-color rgba(33, 108, 121, 0)
                border none
            .basic
                background-color rgba(33, 108, 121, 0.062)
                border-radius 30px
                border 1.5px solid rgb(40, 53, 68)
                margin 0 50px 0 50px
                padding 20px
                min-height 300px
                height auto!important
                height 300px
                position relative
                .editbtn.editBasic
                    background-color rgba(33, 108, 121, 0.062)
                .editbtn:hover
                    cursor pointer
                .editbtn
                    position absolute
                    right 30px
                    top 10px
                    text-decoration underline
                ul:first-child
                    margin-top 50px
                ul
                    margin 15px auto
                    float none
                    min-height 30px
                    height auto!important
                    height 30px
                    overflow hidden
                    width 400px
                    li:first-child
                        width 80px
                    li:last-child
                        width 240px
                    li
                        float left
                        list-style none
                        margin 10px 20px
                        height auto
                        text-align left
            .editbasic
                background-color rgb(207, 223, 226)
                border-radius 10px
                border 1.5px solid rgb(40, 53, 68)
                margin-top 45px 
                margin-left 10px
                position absolute
                width 520px
                padding 20px
                padding-top 0
                min-height 300px
                height auto!important
                height 300px
                top -10px
                left 60px
                ul
                    text-align left
                    padding-left 80px
                    li
                        list-style none
                        vertical-align center
                        margin 20px auto
                        label
                            margin-left -5px
                            letter-spacing 20px
                            input
                                position relative
                                left: 5px;
                                top: 3px;
                                width 20px
                                height 20px
                                border-radius 50%
                                margin 0 10px
                        span:first-child
                            width 80px
                            text-align left
                        span
                            display inline-block
                            text-align center
                            float none
                            min-height 30px
                            height auto!important
                            height 30px
                            width 400px
                        input
                            height auto
                            overflow hidden
                            min-height 20px
                .btn
                    margin-top 60px
                    button
                        margin 0 50px
            .pwd
                margin 100px 0
                button
                    border 1px black solid
                    background-color rgb(150, 200, 207)
                    margin 10px
                    border-radius 10px
                    margin 10px 5px
                    text-align center
                    height 40px
                    width 200px
                    span
                        display inline-block
                        line-height 38px
                        border-radius 10px
                        height 38px
                        width 100%
                        vertical-align middle
                        transition 0s
                        font-size 16px
                        letter-spacing 15px
                        text-indent 15px
                        text-align center
                    span:hover
                        background-color rgb(182, 212, 214)
                        transition 0s
                        cursor pointer
            .editpwd
                width 100%
                height 100%
                background-color rgba(128, 128, 128, 0.7)
                position fixed
                top 0
                left 0
                .pwdcontain
                    position absolute
                    width 500px
                    height 300px
                    background-color rgb(86, 163, 153)
                    border 3px solid rgb(40, 53, 68)
                    border-radius 20px
                    left 35%
                    top 30%
                    div:first-child
                        margin 0 30px 
                        margin-top 70px
                        form
                            width 400px
                            height auto
                            margin 0 auto
                            input
                                font-size 15px
                                width 300px
                                height 25px
                                margin 5px auto
                                border 2px solid rgb(40, 53, 68)
                    div
                        p
                            font-size 10px
                    .btn
                        margin-top 40px
                        button
                            margin 0 20px





</style>
