<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥123456">
            <template v-slot:charts>
              <span>周同比&nbsp;&nbsp;56.67% <i class="el-icon-caret-top" style="color: skyblue"></i> </span>
              &nbsp;&nbsp;
              <span>日同比&nbsp;&nbsp;19.96% <i class="el-icon-caret-bottom" style="color: red"></i></span>
            </template>

            <template v-slot:footer>
              <span>日销售额 ￥123456</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template v-slot:footer>
              <span>日访问量 ￥123456</span>
            </template>
            <template v-slot:charts>
              <line-chart></line-chart>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template v-slot:footer>
              <span>转换率 ￥123456</span>
            </template>
            <template v-slot:charts>
              <bar-chart></bar-chart>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template v-slot:footer>
              <span>周同比&nbsp;&nbsp;56.67% <i class="el-icon-caret-top" style="color: skyblue"></i> </span>
              &nbsp;&nbsp;
              <span>日同比&nbsp;&nbsp;19.96% <i class="el-icon-caret-bottom" style="color: red"></i></span>
            </template>
            <template v-slot:charts>
              <progress-charts></progress-charts>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from '@/views/dashboard/Card/Detail/Detail'
import lineChart from '@/views/dashboard/Card/lineChart/lineChart'
import BarChart from '@/views/dashboard/Card/barChart/barChart'
import ProgressCharts from '@/views/dashboard/Card/progressCharts/progressCharts'

export default {
  components:{ ProgressCharts, BarChart, Detail,lineChart},
  name: 'Card'
}
</script>

<style scoped>

</style>
