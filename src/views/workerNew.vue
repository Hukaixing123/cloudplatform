<template>
<div>
    <div>
        <div>
            <!-- 内容区 -->
            <ul>
                <li>
                    <span>
                        姓名
                    </span>
                    <input>
                </li>
                <li>
                    <span>
                        性别
                    </span>
                    <label>
                        <input type="radio">
                        <span>男</span>
                    </label>
                    <label>
                        <input type="radio">
                        <span>女</span>
                    </label>
                </li>
                <li>
                    <span>
                        工种
                    </span>
                    <span>
                        --未选择--
                    </span>
                    <ul>
                        <li>
                            A类
                        </li>
                        <li>
                            B类
                        </li>
                        <li>
                            C类
                        </li>
                    </ul>
                </li>
                <li>
                    <span>
                        手机号
                    </span>
                    <input>
                </li>
            </ul>
        </div>
        <div>
            <!-- 按钮区 -->
            <button>
                <span>保存</span>
            </button>
            <button>
                <span>取消</span>
            </button>
        </div>
    </div>
</div>
</template>

<script>
name:'workerNew'
export default {
    
}
</script>

<style>

</style>
