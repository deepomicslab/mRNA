<template>
    <n-modal
        v-model:show="isShowDetail"
        preset="card"
        class="custom-card"
        :style="{
            width: '850px',
        }"
        size="huge"
    >
        <template #header>
            <el-text class="w-200px text-2xl" truncated>
                {{ selectData.value }}
            </el-text>
        </template>
        <div class="border-t-2 border-[#FFA000] mb-5"></div>
        <div class="flex flex-row text-xl">
            <p class="mr-3 font-bold">Start:</p>
            {{ selectData.value }}
        </div>
    </n-modal>
    <div class="flex flex-row bg-gray-50 w-310 h-28">
        <div class="w-120 h-28"></div>
        <div class="text-3xl font-800 ml-7 mt-10"></div>
        <div class="flex flex-row bg-gray-50 w-310 h-28">
            <div class="w-120 h-28">
                <div
                    v-if="isShowSelect"
                    class="text-[18px] text-[#4b89da] mt-17 ml-6 leading-6 flex flex-row"
                >
                    <div class="mr-2 text-xl">
                        <n-icon>
                            <info />
                        </n-icon>
                    </div>
                    Click on a sequence to see details.
                </div>
                <div v-else class="h-28 flex flex-col">
                    <div class="flex flex-row p-2 mt-13 w-70 bg-gray-400 h-11">
                        <n-button
                            size="small"
                            class="text-[12px] ml-6 h-6 mt-0.5"
                            type="info"
                            @click="showDetail"
                        >
                            Detail
                            <template #icon>
                                <n-icon>
                                    <info />
                                </n-icon>
                            </template>
                        </n-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-row bg-gray-50 w-310 h-28">
        <div class="text-3xl font-800 ml-7 mt-10"></div>

        <el-button class="mt-15 ml-80" type="primary">
            <el-icon class="text-base mr-1 mb-0.5"><Document /></el-icon>
            Download SVG Chart
        </el-button>
        <el-button class="mt-15 ml-3" type="primary">
            <el-icon class="text-base mr-1 mb-0.5"><Document /></el-icon>
            Download PNG Chart
        </el-button>
    </div>
    <el-scrollbar class="h-165 flex flex-row items-center" v-loading="loadchart">
        <el-button class="mt-5 ml-3 absolute z-10 ml-290" type="primary" v-if="false">
            <el-icon class="text-xl"><Operation /></el-icon>
        </el-button>

        <svg id="mrnaAnnotation" :height="height - 80" :width="width"></svg>
    </el-scrollbar>
</template>
<script setup lang="ts">
// @ts-nocheck
// import { CloudDownload as down, InformationCircle as info } from '@vicons/ionicons5'
import { InformationCircle as info } from '@vicons/ionicons5'
import { Document, Operation } from '@element-plus/icons-vue'
import * as d3 from 'd3'
import _ from 'lodash'
import { NButton, NModal } from 'naive-ui'
import axios from 'axios'

// import { InformationCircle as info } from '@vicons/ionicons5'
// import { TypeDict, proteinType, countGC } from '@/utils/annotation'
// import { usePhageStore } from '@/store/phage'
// import { usemrnaStore } from '@/store/mrna'
const isShowDetail = ref(false)
const isShowSelect = ref(true)
const selectData = ref(null)
// const loading = ref(false)
// const annotationData = sequencemarker
// const id= ref(1),

const showDetail = () => {
    isShowDetail.value = true
}

const loadchart = ref(true)
// For layout
const width = ref(1200)
const height = ref(800)
// const marginTop = ref(20)
const marginLeft = ref(40)
const lineHeight = ref(180)
// for draw arrow
const barareaMarginLeft = ref(70)
const barHeight = ref(30)

// draw rectangle

function Rectangle(start, end, y) {
    return `M ${end} ${y} H ${start} V ${y + barHeight.value} H ${end} Z`
}

const chooseColor = (d: unknown) => {
    let color = ''
    switch (d) {
        case "5' UTR":
            color = '#45bf43'
            break
        case 'CDS':
            color = '#5490F8'
            break
        case "3' UTR":
            color = '#29cbce'
            break
        case 'Type I':
            color = '#DF3AD2'
            break
        case 'Type II':
            color = '#9dc6e7'
            break
        case 'Type III':
            color = '#0FF0BF'
            break
        case 'Type IV':
            color = '#9343f0'
            break
        case 'Type V':
            color = '#ec364e'
            break
        case 'N-terminal extension':
            color = '#90ed7d'
            break
        default:
            color = '#445d8f'
            break
    }
    return color
}
const annotationData = ref(null)

const getsequencemarker = async id => {
    // loading.value = true

    const response = await axios.get('/task/result/sequencemarker/', {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: id,
            mrnaid: id,
        },
    })
    const { data: sequencemarker } = response
    console.log(sequencemarker)
    annotationData.value = sequencemarker
}

const id = 1
getsequencemarker(id)

watch(annotationData, () => {
    const start = 0
    console.log(annotationData)
    const end = annotationData.value.sequence.length
    const splitAnnotationData = _.groupBy(annotationData.value.result, 'component_type')
    console.log(splitAnnotationData)
    // const rectHeight = lineHeight.value + 65
    // const labelOffsetX = 10

    height.value = lineHeight.value + 250
    const svg = d3.select('#mrnaAnnotation').attr('transform', `translate(${marginLeft.value}, 0)`)

    // const gcY = d3.scaleLinear().domain([20, 80]).range([40, 0])
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', barareaMarginLeft.value)
        .attr('height', height.value)
        .attr('fill', 'white')

    const g = svg.append('g')

    const bararea = g
        .append('svg')
        .attr('height', height.value)
        .attr('width', 1000)
        .attr('x', barareaMarginLeft.value)
        .attr('y', 0)

    const scaleX = d3.scaleLinear().domain([start, end]).range([0, 1000])
    const xAxis = d3
        .axisBottom(scaleX)
        .ticks(10)
        .tickFormat(function (t) {
            return t === 0 ? 0 : `${t}`
        })

    svg.append('g')
        .attr('transform', `translate(${barareaMarginLeft.value}, ${lineHeight.value + 100})`)
        .attr('class', 'x-axis')
        .attr('color', '#818181')
        .call(xAxis)

    const mainRegionsData = splitAnnotationData.main_regions
    // const miRNAData = splitAnnotationData.miRNAs_targets
    const uORFData = splitAnnotationData.uORF
    const iresData = splitAnnotationData.IRES
    const loopstructureData = splitAnnotationData['stem-loop_structure']
    // const secondaryStructureData = splitAnnotationData.secondary_structure
    const restrictionSitesData = splitAnnotationData.restriction_sites
    const groupedData = [
        mainRegionsData,
        // miRNAData,
        uORFData,
        iresData,
        // secondaryStructureData,
        restrictionSitesData,
        loopstructureData,
    ]
    const TypeLabel = [
        'mainRegionsData',
        // miRNAData,
        'uORFData',
        'iresData',
        // secondaryStructureData,
        'restrictionSitesData',
        'loopstructureData',
    ]
    const toolarea = svg.append('svg').attr('height', 100).attr('width', 260).style('opacity', 0)
    toolarea
        .append('rect')
        .attr('x', 0)
        .attr('width', 260)
        .attr('height', 70)
        .style('fill', 'black')
        .style('opacity', 0.6)
    const toolText1 = toolarea
        .append('text')
        .style('fill', 'white')
        .attr('transform', `translate(10,20)`)
        .style('font-size', 12)
    const toolText2 = toolarea
        .append('text')
        .style('fill', 'white')
        .attr('transform', `translate(10,40)`)
        .style('font-size', 12)
    const toolText3 = toolarea
        .append('text')
        .style('fill', 'white')
        .attr('transform', `translate(10,60)`)
        .style('font-size', 12)

    // Arrow Bar
    const mouseenter = function (md, mv) {
        bararea.selectAll('.geneline').style('opacity', 0.3)
        d3.select(this).style('opacity', 1)
        toolarea
            .style('opacity', 1)
            .attr('x', md.layerX - 30)
            .attr('y', md.layerY - 30)
        toolText1.text(function () {
            return `component_type : ${mv.component_type}`
        })
        toolText2.text(function () {
            return `component_class1 : ${mv.component_class1}`
        })
        toolText3.text(function () {
            return `location : ${Number(mv.start)}-${Number(mv.end)}`
        })
    }
    const mouseleave = function () {
        bararea.selectAll('.geneline').style('opacity', 1)
        toolarea.style('opacity', 0).attr('x', 0).attr('y', 0)
    }
    const click = function (md, mv) {
        // console.log(mv)
        // bararea.selectAll('.geneline').style('stroke', '#818181').attr('stroke-width', '1px')
        isShowSelect.value = false
        selectData.value = mv
        console.log(selectData.value)
        console.log(selectData.value.start)
        d3.select(this).style('stroke', '#818181').attr('stroke-width', '2px').value = mv
    }
    // console.log(groupedData)
    for (let j = 0; j < 5; j += 1) {
        svg.append('text')
            .attr('x', 0)
            .attr('y', lineHeight.value + 84 - 52 * j)
            .text(TypeLabel[j])
            .style('font-size', '10px')
            .style('fill', 'black')
        bararea
            .selectAll('geneline')
            .data(groupedData[j])
            .enter()
            .append('path')
            .attr('class', 'geneline')
            .attr('d', function (i) {
                const startX = d3.scaleLinear().domain([start, end]).range([0, 1000])(
                    Number(i.start)
                )
                const endX = d3.scaleLinear().domain([start, end]).range([0, 1000])(Number(i.end))
                return Rectangle(startX, endX, lineHeight.value + 65)
            })
            .attr('fill', function (i) {
                return chooseColor(i.component_class1)
            })
            .attr('transform', `translate(0, ${lineHeight.value - 180 - 50 * j})`)
            .on('mouseenter ', mouseenter)
            .on('mouseleave', mouseleave)
            .on('click', click)
    }

    function zoomed(event) {
        const scale = event.transform.k

        const maxScale = 5
        const limitedScale = Math.min(scale, maxScale)
        const newDomain = scaleX.domain().map(d => d / limitedScale)
        const newRange = [barareaMarginLeft.value, barareaMarginLeft.value + width.value]

        // 更新比例尺
        scaleX.domain(newDomain).range(newRange)
        // scaleX.domain(newDomain).range(1, 1000)
        /* scaleX.range(
            [barareaMarginLeft, width - barareaMarginLeft].map(d => event.transform.applyX(d))
        ) */
        // 更新坐标轴
        svg.select('.x-axis').call(xAxis)

        // 更新矩形的位置和大小
        bararea.selectAll('.geneline').attr('d', function (i) {
            const startX = scaleX(Number(i.start))
            const endX = scaleX(Number(i.end))
            return Rectangle(startX, endX, lineHeight.value + 65)
        })
    }

    const zoom = d3
        .zoom()
        .scaleExtent([0.5, 2])
        // .translateExtent(extent)
        // .extent(extent) // 定义缩放比例的范围
        .on('zoom', zoomed)
    svg.call(zoom)
    loadchart.value = false
})
</script>
