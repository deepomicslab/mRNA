<!-- eslint-disable camelcase -->
<!-- eslint-disable camelcase -->
<template>
    <div>
        <div style="box-shadow: 0 0 64px #cfd5db" class="w-310 h-150 mt-10">
            <mrnaAnnotation />
        </div>
        <div class="flex flex-row my-5">
            <div class="text-4xl ml-1 font-600">Result display</div>
            <div class="mt-1.5 felx flex-row justify-start items-center ml-5">
                <el-button @click="downloadtsv">
                    <template #icon>
                        <n-icon><downicon /></n-icon>
                    </template>
                    DownLoad TSV Data
                </el-button>
            </div>
        </div>
        <div class="w-400 mt-1">
            <el-table :data="demodata" border style="width: 100%" max-height="850" always>
                <el-table-column
                    prop="id"
                    label="ID"
                    fixed
                    width="100"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="Translation"
                    label="Translation"
                    :sort-orders="['descending', 'ascending']"
                    :sortable="true"
                    fixed
                    width="100"
                    align="center"
                ></el-table-column>

                <el-table-column
                    prop="Half-Life"
                    label="Half-Life"
                    :sort-orders="['descending', 'ascending']"
                    :sortable="true"
                    width="100"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="Protein"
                    label="Protein"
                    :sort-orders="['descending', 'ascending']"
                    :sortable="true"
                    width="150"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="RNASecondary Structure"
                    label="RNASecondary Structure"
                    :sort-orders="['descending', 'ascending']"
                    :sortable="true"
                    width="100"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="Autoimmune Score"
                    label="Autoimmune Score"
                    :sort-orders="['descending', 'ascending']"
                    :sortable="true"
                    width="100"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="Motif Risk"
                    label="Motif Risk"
                    :sort-orders="['descending', 'ascending']"
                    :sortable="true"
                    width="100"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="MHC Affinity"
                    label="MHC Affinity"
                    :sort-orders="['descending', 'ascending']"
                    :sortable="true"
                    width="100"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="T-Cell Score"
                    label="T-Cell Score"
                    :sort-orders="['descending', 'ascending']"
                    :sortable="true"
                    width="100"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="B-Cell Score"
                    label="B-Cell Score"
                    :sort-orders="['descending', 'ascending']"
                    :sortable="true"
                    width="100"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="Enzyme Sites"
                    label="Enzyme Sites"
                    :sort-orders="['descending', 'ascending']"
                    :sortable="true"
                    width="100"
                    align="center"
                ></el-table-column>
                <el-table-column label="view secondary structure" width="150" align="center">
                    <template v-slot:default="scope">
                        <el-button @click="viewSecondary(scope.row.id)">view</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div
            v-if="showTabs"
            style="box-shadow: 0 0 64px #cfd5db"
            class="w-310 h-150 mt-10 justify-center items-center"
        >
            <el-tabs v-model="activeTab" type="card">
                <el-tab-pane label="Second" name="second">
                    <div v-loading="loading">
                        <secStructure v-if="activeTab === 'second' && !loading" :key="refreshKey" />
                    </div>
                </el-tab-pane>
                <el-tab-pane label="Protein" name="protein">
                    <div v-loading="loading">
                        <proStructure
                            v-if="activeTab === 'protein' && !loading"
                            :key="refreshKey"
                        />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <div class="flex flex-row my-5">
            <div class="text-4xl ml-1 font-600">heatmap</div>
            <el-button class="mt-15 ml-80" type="primary" @click="downloadsvg">
                <el-icon class="text-base mr-1 mb-0.5"><Document /></el-icon>
                Download SVG Chart
            </el-button>
            <el-button class="mt-15 ml-3" type="primary" @click="downloadSVGAsPNG">
                <el-icon class="text-base mr-1 mb-0.5"><Document /></el-icon>
                Download PNG Chart
            </el-button>
        </div>
        <div style="box-shadow: 0 0 64px #cfd5db" class="w-310 h-150 mt-10">
            <heatmap />
        </div>
    </div>
</template>

<script setup lang="ts">
// import axios from 'axios'
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
import _ from 'lodash'
import axios from 'axios'
import heatmap from './heatmap.vue'
import mrnaAnnotation from './mrna_annotation.vue'
// eslint-disable camelcase
import secStructure from './second_structure.vue'
import proStructure from './protein.vue'
import { usemrnaStore } from '@/store/mrna'

const mrnaStore = usemrnaStore()
const loading = ref(false)
const refreshKey = ref(0)
const activeTab = ref('second')
const showTabs = ref(false)
const demodata = [
    {
        id: 1,
        Translation: 0.1,
        'Half-Life': 0.4,
        Protein: 0.5,
        'RNASecondary Structure': 0.3,
        'Autoimmune Score': 0.9,
        'Motif Risk': 0.4,
        'MHC Affinity': 0.3,
        'T-Cell Score': 0.2,
        'B-Cell Score': 0.9,
        'Enzyme Sites': 0.3,
    },
    {
        id: 2,
        Translation: 0.3,
        'Half-Life': 0.2,
        Protein: 0.1,
        'RNASecondary Structure': 0.9,
        'Autoimmune Score': 0.5,
        'Motif Risk': 0.2,
        'MHC Affinity': 0.4,
        'T-Cell Score': 0.1,
        'B-Cell Score': 0.5,
        'Enzyme Sites': 0.2,
    },
    {
        id: 3,
        Translation: 0.5,
        'Half-Life': 0.3,
        Protein: 0.8,
        'RNASecondary Structure': 0.9,
        'Autoimmune Score': 0.8,
        'Motif Risk': 0.5,
        'MHC Affinity': 0.1,
        'T-Cell Score': 0.8,
        'B-Cell Score': 0.4,
        'Enzyme Sites': 0.7,
    },
    {
        id: 4,
        Translation: 0.4,
        'Half-Life': 0.8,
        Protein: 0.4,
        'RNASecondary Structure': 0.8,
        'Autoimmune Score': 0.1,
        'Motif Risk': 0.3,
        'MHC Affinity': 0.7,
        'T-Cell Score': 0.5,
        'B-Cell Score': 0.3,
        'Enzyme Sites': 0.9,
    },
    {
        id: 5,
        Translation: 0.9,
        'Half-Life': 0.7,
        Protein: 0.4,
        'RNASecondary Structure': 0.7,
        'Autoimmune Score': 0.4,
        'Motif Risk': 0.9,
        'MHC Affinity': 0.8,
        'T-Cell Score': 0.3,
        'B-Cell Score': 0.1,
        'Enzyme Sites': 0.2,
    },
]
const downloadtsv = () => {
    if (demodata.length !== 0) {
        const headers = _.keys(demodata[0])
        const formattedData = [headers]
        demodata.forEach(item => {
            const row = _.values(item).map(String)
            formattedData.push(row)
        })
        const tsvContent = formattedData.map(row => row.join('\t')).join('\n')
        const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'result.tsv'
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(url)
        document.body.removeChild(link)
    }
}
function downloadsvg() {
    const svgElement = document.getElementById('Viz_area_heatmap') as HTMLElement
    const svgData = new XMLSerializer().serializeToString(svgElement as SVGElement)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'heatmap.svg'
    link.click()
    URL.revokeObjectURL(url)
}
const downloadSVGAsPNG = async () => {
    // @ts-ignore
    const svgElement = document.getElementById('Viz_area_heatmap') as HTMLElement
    const svgData = new XMLSerializer().serializeToString(svgElement as SVGElement)
    const svgDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`

    const img = new Image()
    img.src = svgDataURL

    await new Promise(resolve => {
        // @ts-ignore
        img.onload = () => {
            resolve()
        }
    })
}
// eslint-disable-next-line camelcase
const viewSecondary = async (id: number) => {
    // const viewSecondary = async () => {

    showTabs.value = true
    activeTab.value = 'second'
    loading.value = true
    const response = await axios.get('/task/result/secondarystructure/', {
        baseURL: '/api',
        timeout: 10000,
        params: {
            mrnaid: id,
            taskid: id,
        },
    })
    const { data: structureData } = response
    mrnaStore.StructureList = structureData
    const response1 = await axios.get(`/task/result/proteinstructure/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            mrnaid: id,
            taskid: id,
        },
    })
    const { data: proteinData } = response1
    mrnaStore.proteinstructureList = proteinData
    loading.value = false
    refreshKey.value += 1
}
</script>
