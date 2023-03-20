<template>
    <div ref="chart" style="width: 300px; height: 300px;"></div>
</template>
  
<script>

import * as echarts from 'echarts';

export default {
    name: 'EchartShootTime',
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

            const [data_a, data_b]= this.convert_data(this.shootChartData);

            // 차트 생성
            this.chart = echarts.init(this.$refs.chart);

            const options = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['득점', '실점']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'value',
                        position: 'top'
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            show: false
                        },
                        data: ['0~15', '15~30', '30~45', '45~60', '60~75', '75~90', '90~105', '105~120']
                    }
                ],
                series: [
                    {
                        name: '득점',
                        type: 'bar',
                        stack: 'Total',
                        label: {
                            show: true,
                            formatter:function(params){
                                if (params.value ===0){
                                    return '';
                                } else {
                                    return params.value;
                                }
                            }
                            
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: data_a
                    },
                    {
                        name: '실점',
                        type: 'bar',
                        stack: 'Total',
                        label: {
                            show: true,
                       
                            formatter:function(params){
                                if (params.value ===0){
                                    return '';
                                } else {
                                    return params.value;
                                }
                            }
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: data_b
                    }
                ]
            };

            // 차트에 옵션 적용
            this.chart.setOption(options);
        },

        convert_data(chartData){

            let data_a = [0,0,0,0,0,0,0,0]
            let data_b = [0,0,0,0,0,0,0,0]
            for (const data of chartData.score){
                
                let [minutes, seconds] = data.time.split('분');
                const result = data.result;
                minutes = parseInt(minutes);
   
                if (result != 3){
                    continue;
                }
   
                if (data.type==='전반'){
                    if (minutes<15){
                        data_a[0] += 1
                    } else if (minutes<30 && minutes>=15){
                        data_a[1] += 1
                    } else {
                        data_a[2] += 1
                    }
                } else if (data.type==='후반'){
                    if (minutes<60){
                        data_a[3] += 1
                    } else if (minutes<75 && minutes>=60){
                        data_a[4] += 1
                    } else {
                        data_a[5] += 1
                    }
                } else if (data.type==='연장전 전반'){
                    data_a[6] += 1;
                } else if (data.type==='연장전 후반'){
                    data_a[7] += 1;
                }
            }
         
            for (const data of chartData.concede){
                let [minutes, seconds] = data.time.split('분');
                const result = data.result;
                minutes = parseInt(minutes);
                if (result != 3){
                    continue;
                }

                if (data.type==='전반'){
                    if (minutes<15){
                        data_b[0] -= 1
                    } else if (minutes<30 && minutes>=15){
                        data_b[1] -= 1
                    } else {
                        data_b[2] -= 1
                    }
                } else if (data.type==='후반'){
                    if (minutes<60){
                        data_b[3] -= 1
                    } else if (minutes<75 && minutes>=60){
                        data_b[4] -= 1
                    } else {
                        data_b[5] -= 1
                    }
                } else if (data.type==='연장전 전반'){
                    data_b[6] -= 1;
                } else if (data.type==='연장전 후반') {
                    data_b[7] -= 1;
                }
            }
         
           return [data_a, data_b];
        },
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
  