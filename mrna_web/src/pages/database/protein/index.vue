<template>
    <div class="h-680 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">3'UTR Information</div>
            <el-button round color="#34498E" class="ml-5 mt-2" @click="godatahelper">
                Database Helper
            </el-button>
        </div>
        <div class="flex flex-row justify-between mb-4">
            <div class="mt-1.5 ml-1">
                <el-dropdown class="mx-4">
                    <el-button>
                        <template #icon>
                            <n-icon><downicon /></n-icon>
                        </template>
                        DownLoad Sequence
                        <el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="downloadall">All Data</el-dropdown-item>
                            <el-dropdown-item @click="downloadselected">
                                Selected Data
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

            <div class="flex flex-row">
                <div class="mt-2 text-base">Search:</div>
                <el-input class="w-50 ml-3" size="small" v-model="searchinput">
                    <template #append>
                        <el-button :icon="Search" @click="filtersearch" />
                    </template>
                </el-input>
                <el-button class="mt-1 ml-2" :icon="RefreshRight" circle @click="resetsearch" />
            </div>
        </div>
        <div>
            <el-menu
                :default-active="dataset"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelectSet"
            >
                <!-- <el-menu-item index="phage_protein_NCBI">NCBI</el-menu-item> -->
                <el-menu-item index="phage_protein_RefSeq">3'UTR</el-menu-item>
                <!--<el-menu-item index="phage_protein_Genbank">Genbank</el-menu-item>
                <el-menu-item index="phage_protein_EMBL">EMBL</el-menu-item>
                <el-menu-item index="phage_protein_DDBJ">DDBJ</el-menu-item>
                <el-menu-item index="phage_protein_PhagesDB">PhagesDB</el-menu-item>
                <el-menu-item index="phage_protein_GVD">GVD</el-menu-item>
                <el-menu-item index="phage_protein_GPD">GPD</el-menu-item>
                <el-menu-item index="phage_protein_MGV">MGV</el-menu-item>
                <el-menu-item index="phage_protein_TemPhD">TemPhD</el-menu-item>-->
            </el-menu>
        </div>
        <div v-loading="loading" class="h-420">
            <n-data-table
                :columns="columns"
                :data="threeutrList"
                :row-key="rowKey"
                :max-height="1600"
                @update:checked-row-keys="handleCheck"
            />
        </div>
        <div>
            <n-pagination
                class="mt-10 ml-130 mb-500"
                v-model:page="pagevalue"
                v-model:pageSize="pageSize"
                show-size-picker
                :default-page-size="310"
                :page-sizes="[10, 50, 100]"
                show-quick-jumper
                :item-count="count"
                @update:page="pagechange"
                @update:page-size="pagesizechange"
            >
                <template #prev>
                    <n-button @click="prevPage" v-bind:disabled="pagevalue === 1" size="small">
                        <template #icon>
                            <n-icon><ChevronBack /></n-icon>
                        </template>
                    </n-button>
                </template>
                <template #next>
                    <n-button @click="nextPage" size="small">
                        <template #icon>
                            <n-icon><ChevronForward /></n-icon>
                        </template>
                    </n-button>
                </template>
            </n-pagination>
        </div>
    </div>
    <el-dialog v-model="proteinVisible" title="Protein Detail" width="90%">
        <proteindetail
            v-if="proteinVisible"
            v-model:proteinInfo="proteinInfo"
            v-model:dataset="dataset"
        />
    </el-dialog>
    <el-dialog
        v-model="downloadproteindialogVisible"
        title="Select download data type"
        width="30%"
        align-center
    >
        <div>
            <el-checkbox-group v-model="proteincheckList">
                <el-checkbox label="Download FASTA DATA" />
                <el-checkbox label="Download Meta DATA" />
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="downloadproteindialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="downloadrequest">Download</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
// @ts-nocheck
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
// import { h } from 'vue'
// import { NButton, NTag, NTooltip } from 'naive-ui'
import { NButton } from 'naive-ui'

import { Search, RefreshRight } from '@element-plus/icons-vue'
import { CloudDownloadOutline as downicon, ChevronBack, ChevronForward } from '@vicons/ionicons5'
import axios from 'axios'
import _ from 'lodash'
import proteindetail from './detail.vue'

const router = useRouter()
const loading = ref(false)

const proteinVisible = ref(false)

const proteinInfo = ref()
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeysRef.value = rowKeys
}
const dataset = ref('phage_protein_RefSeq')
/* type RowData = {
    id: number
    Phage_Acession_ID: string
    protein_id: string
    annotate_Source: string
    Function_prediction_source: string
    protein_product: string
    protein_sort_class: string
    start_point: string
    end_point: string
    strand: string
} */
type RowData = {
    id: number
    GeneName: string
    EnsemblGeneID: string
    EnsemblTranscriptID: string
    Description: string
    Startposition: number
    EndPosition: number
    Pattern: string
    Cluster: number
    Chromosome: string
    Aliases: string
}

const pagevalue = ref(1)
const pageSize = ref(10)

const threeutrdata = ref()
const downloadproteindialogVisible = ref(false)

const proteincheckList = ref(['Download FASTA'])
const downloadselected = () => {
    downloadproteindialogVisible.value = true
    downloadtype.value = 'selected'
}
const downloadall = () => {
    downloadproteindialogVisible.value = true
    downloadtype.value = 'all'
}
onBeforeMount(async () => {
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/threeutr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    threeutrdata.value = data
    loading.value = false
})

const threeutrList = computed(() => {
    return threeutrdata.value?.results
})

const count = computed(() => threeutrdata.value?.count)

const nextPage = async () => {
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/threeutr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    threeutrdata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/threeutr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    threeutrdata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/threeutr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    threeutrdata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/threeutr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    threeutrdata.value = data
    loading.value = false
}
/* const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
} */
const rowKey = (row: RowData) => {
    return row.id
}

// const godetail = (row: RowData) => {
//     console.log(row)
//     router.push({ path: '/database/protein/detail', query: { id: row.id, dataset: row.dataset } })
// }
const searchinput = ref('')

const templatedata = ref()
const filtersearch = () => {
    templatedata.value = threeutrdata.value.results

    threeutrdata.value.results = _.filter(threeutrdata.value.results, obj => {
        return JSON.stringify(obj).includes(searchinput.value)
    })
}
const resetsearch = () => {
    searchinput.value = ''
    if (templatedata.value) {
        threeutrdata.value.results = templatedata.value
    }
}

const createColumns = (): DataTableColumns<RowData> => [
    {
        type: 'selection',
    },
    {
        title: 'ID',
        key: 'id',
        align: 'center',
        sorter: 'default',
        defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'GeneName',
        key: 'GeneName',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'EnsemblGeneID',
        key: 'EnsemblGeneID',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'EnsemblTranscriptID',
        key: 'EnsemblTranscriptID',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Description',
        key: 'Description',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Startposition',
        key: 'Startposition',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'EndPosition',
        key: 'EndPosition',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Pattern',
        key: 'Pattern',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Cluster',
        key: 'Cluster',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Chromosome',
        key: 'Chromosome',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Aliases',
        key: 'Aliases',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    /* {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Phage ID' }), 'phage ID')
        },
        key: 'Phage_Acession_ID',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        render(row: any) {
            return h('div', {}, [
                h(
                    NButton,
                    {
                        type: 'info',
                        text: true,
                        size: 'small',
                        onClick: async () => {
                            const response = await axios.get(`/phage/detail`, {
                                baseURL: '/api',
                                timeout: 10000,
                                params: {
                                    accid: row.Phage_Acession_ID,
                                },
                            })
                            const phageid = response.data.id
                            router.push({
                                path: '/database/phage/detail',
                                query: { phageid },
                            })
                        },
                    },
                    {
                        default: () => {
                            return row.Phage_Acession_ID
                        },
                    }
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Protein ID' }), 'protein ID')
        },
        key: 'Protein_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Orf Prediction Source' }),
                'source of the orf prediction'
            )
        },
        key: 'Source',
        align: 'center',
        render(row: any) {
            return h('div', {}, [
                h(
                    NTag,
                    {
                        type: 'info',
                        size: 'small',
                    },
                    {
                        default: () => {
                            return row.Source
                        },
                    }
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Function Prediction Source' }),
                'source of the protein function annotation'
            )
        },
        key: 'Function_prediction_source',
        align: 'center',
        render(row: any) {
            return h('div', {}, [
                h(
                    NTag,
                    {
                        type: 'info',
                        size: 'small',
                    },
                    {
                        default: () => {
                            return row.Function_prediction_source
                        },
                    }
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Function Classification' }),
                'protein classification with keyword search'
            )
        },
        key: 'Protein_function_classification',
        align: 'center',
        width: '250px',
        render(row: any) {
            const tagnode = []
            const classlist = row.Protein_function_classification.split(';').slice(
                0,
                -1
            ) as string[]
            classlist.forEach((item, index) => {
                tagnode.push(
                    h(
                        NTag,
                        {
                            size: 'small',
                            type: 'info',
                        },
                        {
                            default: () => {
                                return classlist[index]
                            },
                        }
                    )
                )
            })

            return h(
                'div',
                { style: { width: '250px', display: 'flex', justifyContent: 'space-around' } },
                tagnode
            )
        },
        filterOptions: [
            {
                label: 'hypothetical',
                value: 'hypothetical',
            },
            {
                label: 'infection',
                value: 'infection',
            },
            {
                label: 'assembly',
                value: 'assembly',
            },
            {
                label: 'unsorted',
                value: 'unsorted',
            },
            {
                label: 'replication',
                value: 'replication',
            },
            {
                label: 'packaging',
                value: 'packaging',
            },
            {
                label: 'lysis',
                value: 'lysis',
            },
            {
                label: 'regulation',
                value: 'regulation',
            },
            {
                label: 'immune',
                value: 'immune',
            },
            {
                label: 'integration',
                value: 'integration',
            },
            {
                label: 'tRNA',
                value: 'tRNA',
            },
            {
                label: 'mix',
                value: 'mix',
            },
        ],
        filter(value: any, row: any) {
            return row.Protein_function_classification.includes(value)
        },
    },

    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Protein Product' }),
                'protein product'
            )
        },
        key: 'Protein_product',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: 130,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Start Point' }),
                'protein start site on the genome'
            )
        },
        key: 'Start_location',
        align: 'center',
        sorter: 'default',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'End Point' }),
                'protein stop site on the genome'
            )
        },
        key: 'Stop_location',
        align: 'center',
        sorter: 'default',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Strand' }),
                'the strand encoding the protein'
            )
        },
        key: 'Strand',
        align: 'center',
        width: '70px',
    },
    {
        title: 'Action',
        key: 'actions',
        width: '200px',
        align: 'center',
        fixed: 'right',
        render(row: any) {
            return h(
                'div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                    },
                },
                [
                    h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: 'small',
                            type: 'info',
                            onClick: () => {
                                proteinInfo.value = row
                                console.log(row)
                                proteinVisible.value = true
                            },
                        },
                        { default: () => 'Detail' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: 'small',
                            type: 'info',
                            onClick: () => {
                                const blob = new Blob([row.sequence], { type: 'text/plain' })
                                const url = URL.createObjectURL(blob)
                                const link = document.createElement('a')
                                link.href = url
                                link.download = `${row.Protein_id}.fasta`
                                link.click()
                                URL.revokeObjectURL(url)
                            },
                        },
                        { default: () => 'Download' }
                    ),
                ]
            )
        },
    }, */
]
const columns = createColumns()

const handleSelectSet = async (key: any) => {
    dataset.value = key
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/threeutr/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    threeutrdata.value = data
    loading.value = false
}
const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>
