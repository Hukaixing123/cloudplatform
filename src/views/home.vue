<template>
<div>
    <div class="bigcontain">
      <div class="vecontain">
        <VeLine :data="lineData" :settings="chartSettings" :colors="lineColors"></VeLine>
      </div>
      <div class="vecontain">
        <ve-pie :data="pieData" :colors="pieColors"></ve-pie>
      </div>
    </div>
</div>
</template>

<script>
name:'home'
import {mapState,mapActions} from 'vuex'
export default {
    data(){
      this.lineColors = [
          'darkcyan',//总工单
          'rgb(8, 104, 45)',//已完工
        ],
      this.pieColors = [
          'rgb(189, 179, 36)',//未完工
          'rgb(25, 82, 158)',//审核中
          'rgb(8, 104, 45)'//已完工
        ]
      return {
        daysGap:30,
        chartSettings:{
          stack: { '工单': ['已完成工单数'] },
          area: true
        },
      }
    },
    computed:{
        ...mapState(['workOrders']),
        lineData(){
          let a = []//存放30天内工单的日期
          let b = []//存放每天的工单数量
          let c = []//存放每天的已完成工单数量
          const workOrders = this.filterateWorkOrders(this.workOrders,this.daysGap)
          const {daysGap} = this
          const todayFormat = this.date.format(new Date(),'YYYY-MM-DD')//今日日期，格式是YYYY-MM-DD
          const today = new Date(todayFormat).getTime()/(1000 * 60 * 60 * 24)
          let rows = []
          for(let i =0; i<daysGap; i++){//初始化每项数据的数组
            const dayDate = this.date.format((new Date() - 1000 * 60 * 60 * 24 *(daysGap - 1 - i)),'YYYY-MM-DD')
            a[i] = dayDate
            b[i] = 0
            c[i] = 0
          }
          for(let i=0; i<workOrders.length; i++){//计算数据
            const oc = '2' + workOrders[i].ordercode.slice(3,10)
            const ocDate = oc.slice(0,4) + '-' + oc.slice(4,6) + '-' + oc.slice(6)//
            const ioc = new Date(ocDate).getTime()/(1000 * 60 * 60 * 24)
            const days = today - ioc//相差天数
            b[daysGap - 1 - days]++
            if(workOrders[i].orderstate === 2){
              c[daysGap - 1 - days]++
            }
          }
          for(let i =0; i<daysGap; i++){//将数据存入rows中显示出来
            rows[i] = { '日期': '', '总工单数': 0, '已完成工单数': 0}
            rows[i]['日期'] = a[i]
            rows[i]['总工单数'] = b[i]
            rows[i]['已完成工单数'] = c[i]
          }
          return {
            columns: ['日期', '总工单数','已完成工单数'],
            rows
          }
        },
        pieData(){
          const workOrders = this.filterateWorkOrders(this.workOrders,this.daysGap)
          let a = []
          let columns = ['工单状态', '工单数']
          let rows = [
            {'工单状态':'未完工', '工单数':0},
            {'工单状态':'未审核', '工单数':0},
            {'工单状态':'已完工', '工单数':0},
          ]
          for(let i=0; i<workOrders.length; i++){
            switch(workOrders[i].orderstate){
              case 0:{
                rows[0]['工单数']++
                break
              }
              case 1:{
                rows[1]['工单数']++
                break
              }
              case 2:{
                rows[2]['工单数']++
                break
              }
            }
          }
          return {
            columns,rows
          }
        }
    },
    mounted(){
        this.remainWorkOrderList()
    },
    methods:{
        ...mapActions(['remainWorkOrderList']),
        filterateWorkOrders(workOrders,daysGap){
          for(let i=0; i<workOrders.length; i++){
            const todayFormat = this.date.format(new Date(),'YYYY-MM-DD')//今日日期，格式是YYYY-MM-DD
            const today = new Date(todayFormat).getTime()/(1000 * 60 * 60 * 24)
            const oc = '2' + workOrders[i].ordercode.slice(3,10)
            const ocDate = oc.slice(0,4) + '-' + oc.slice(4,6) + '-' + oc.slice(6)//
            const ioc = new Date(ocDate).getTime()/(1000 * 60 * 60 * 24)
            if(today - ioc >= daysGap){
              //30天外的工单
              workOrders.splice(i--,1)
            }
          }
          return workOrders
        }
    },
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  div.bigcontain
    margin-left 100px
    position absolute
    width 850px
    height 400px
    div.vecontain
      width 400px
      height 400px
      float left
      margin-top 100px
    div.vecontain:first-child
      margin-right 50px
</style>
