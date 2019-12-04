<template>
<div>
    <div>
        <table>
            <!--表头 -->
            <thead>
                <tr>
                    <th>
                        姓名
                    </th>
                    <th>
                        性别
                    </th>
                    <th>
                        工种
                    </th>
                    <th>
                        手机号
                    </th>
                </tr>
            </thead>
            <!--v-for的内容 -->
            <tbody>
                <tr>
                    <td>
                        xxx
                    </td>
                    <td>
                        男
                    </td>
                    <td>
                        A
                    </td>
                    <td>
                        130xxx
                    </td>
                    <td>
                        <a href="javascript:;">编辑</a>
                        <a href="javascript:;">删除</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div>
        <div>
            <span>
                共{{n}}条
            </span>
        </div>
        <div>
            <!--选页 -->
            <button>
                <span>&lt;</span>
            </button>
            <ul>
                <li>
                    <span>1</span>
                </li>
                <li>
                    <span>2</span>
                </li>
                <li>
                    <span>3</span>
                </li>
            </ul>
            <button>
                <span>></span>
            </button>
        </div>
    </div>
</div>
</template>

<script>
name:'workerList'
export default {
    data(){
        return{
            n:900
        }
    }
}
</script>

<style>

</style>
