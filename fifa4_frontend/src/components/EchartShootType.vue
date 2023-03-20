<template>
    <div ref="chart" style="width: 700px; height: 400px;"></div>
</template>
  
<script>
import * as echarts from 'echarts';

export default {
    props: {
        shootChartData: {
            type: Object,
            required: true
        }
    },
    mounted() {
        this.initChart();
    },

    methods: {
        initChart() {
            if (this.chart) {
                this.chart.dispose();
            }

            const [data_1,data_2,data_3] = this.convert_data(this.shootChartData);

            this.chart = echarts.init(this.$refs.chart);

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                },
                legend: {
                    data: ['유효 슛', '빗나간 슛', '골'],
                },
                xAxis: {
                    type: 'category',
                    data: ['일반 슛','감아차기','헤더','로빙 슛','플레어 슛','낮은 슛','발리','무회전슛'],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: '유효 슛',
                        type: 'bar',
                        stack: 'one',
                        data: Object.values(data_1),
                    },
                    {
                        name: '빗나간 슛',
                        type: 'bar',
                        stack: 'two',
                        data: Object.values(data_2),
                    },
                    {
                        name: '골',
                        type: 'bar',
                        stack: 'three',
                        data: Object.values(data_3),
                    },
                ],
            };


            this.chart.setOption(option);
        },

        convert_data(chartData){

            let ontarget = {
                1:0,
                2:0,
                3:0,
                4:0,
                5:0,
                6:0,
                7:0,
               
                10:0,
            }

            let offtarget = {
                1:0,
                2:0,
                3:0,
                4:0,
                5:0,
                6:0,
                7:0,
                
                10:0,
            }

            let goal = {
                1:0,
                2:0,
                3:0,
                4:0,
                5:0,
                6:0,
                7:0,
               
                10:0,
            }

            for (const data of chartData.score){
                const result = data.result;
                const type = data.shootType;
                if (type == 8 || type == 9){
                    continue;
                }
                
                if (result == 1){
                    ontarget[type] += 1;
                } else if (result == 2){
                    offtarget[type] += 1;
                } else {
                    goal[type] += 1;
                }
            }
      
            return [ontarget,offtarget,goal];
        }
    },
    beforeDestroy() {
        if (this.chart) {
            this.chart.dispose();
            this.chart = null;
        }
    },

    watch: {
        chartData: {
            handler() {
                this.initChart();
            }

        }
    }

};
</script>
  