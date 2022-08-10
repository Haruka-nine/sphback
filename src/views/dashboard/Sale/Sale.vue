<template>
  <el-card class="box-card" style="margin: 10px 0">
    <div slot="header" class="clearfix" >
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!--头部右侧内容-->
      <div class="right">
        <span @click="setDate">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
          class="date"
          size="mini"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="16">
          <div class="charts" ref="charts">

          </div>
        </el-col>
        <el-col :span="8">
          门店{{title}}排名
          <ul>
            <li>
              <span class="rindex">0</span>
              <span style="margin: 0 15px">肯德基</span>
              <span class="rvalue">56565</span>
            </li>
            <li>
              <span class="rindex">1</span>
              <span style="margin: 0 15px">肯德基</span>
              <span class="rvalue">56565</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span style="margin: 0 15px">肯德基</span>
              <span class="rvalue">56565</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span style="margin: 0 15px">肯德基</span>
              <span class="rvalue">56565</span>
            </li>
            <li>
              <span class="rindex">4</span>
              <span style="margin: 0 15px">肯德基</span>
              <span class="rvalue">56565</span>
            </li>
            <li>
              <span class="rindex">5</span>
              <span style="margin: 0 15px">肯德基</span>
              <span class="rvalue">56565</span>
            </li>
            <li>
              <span class="rindex">6</span>
              <span style="margin: 0 15px">肯德基</span>
              <span class="rvalue">56565</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts';
import dayjs from 'dayjs'
import {mapState} from 'vuex'
export default {
  name: 'Sale',
  data(){
    return{
      activeName:"sale",
      myChart:null,
      //收集日历的数据
      date:[]
    }
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.charts);
    this.myChart.setOption(
      {
        title:{
          text:this.title+"趋势"
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月','九月','十月','十一月','十二月'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.list.orderFullYear,
            color:'#40b2c0'
          }
        ]
      }
    )

  },
  computed:{
    title(){
      return this.activeName==='sale'?'销售额':"访问量"
    },
    ...mapState('home',['list'])
  },
  watch:{
    title(){
      //从新修改图表的配置数据
      this.myChart.setOption(
        {
          title:{
            text:this.title+"趋势"
          },
          series: [
            {
              name: 'Direct',
              type: 'bar',
              barWidth: '60%',
              data: this.title==='销售额'?this.list.orderFullYear:this.list.userFullYear,
              color:'#40b2c0'
            }
          ]
        }
      )
    },
    list(){
      this.myChart.setOption(
        {
          title:{
            text:this.title+"趋势"
          },
          series: [
            {
              name: 'Direct',
              type: 'bar',
              barWidth: '60%',
              data: this.list.orderFullYear,
              color:'#40b2c0'
            }
          ]
        }
      )
    }
  },
  methods:{
    setDate(){
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day,day]
    },
    setWeek(){
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start,end]
    },
    setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start,end]
    },
    setYear(){
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start,end]
    }
  }
}
</script>

<style scoped>
.clearfix{
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab{
  width: 100%;
}
.right{
  position: absolute;
  right: 0;
}
.date{
  width: 250px;
  margin: 0 20px;
}
.right span{
  margin: 0 10px;
}
.charts{
  height: 300px;
  width: 100%;
}
ul{
  list-style: none;
  width: 100%;
  height: 300%;
  padding: 0;
}
ul li{
  height: 8%;
  margin: 15px 0;
}
.rindex{
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: skyblue;
  color: white;
  text-align: center;
}
.rvalue{
  float: right;
}
>>>.el-card__header{
  border-bottom: none ;
  padding-bottom: 0;
}
</style>
