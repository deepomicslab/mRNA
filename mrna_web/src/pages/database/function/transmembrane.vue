<template>
    <div class="h-680 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">Transmembrane Protein Information</div>
            <el-button round color="#34498E" class="ml-5 mt-2" @click="godatahelper">
                Database Helper
            </el-button>
        </div>
        <div class="flex flex-row justify-between mb-4">
            <div class="flex flex-row justify-between">
                <div class="mt-1.5 ml-1 felx flex-row justify-start items-center">
                    <el-button class="mb-1" @click="gofilter">
                        <n-icon class="mr-2"><FunnelOutline /></n-icon>
                        Sequence Filter
                    </el-button>
                </div>
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
                <el-menu-item index="phage_protein_tmhmm_NCBI">NCBI</el-menu-item>
                <el-menu-item index="phage_protein_tmhmm_PhagesDB">PhagesDB</el-menu-item>
                <el-menu-item index="phage_protein_tmhmm_GPD">GPD</el-menu-item>
                <el-menu-item index="phage_protein_tmhmm_GVD">GVD</el-menu-item>
                <el-menu-item index="phage_protein_tmhmm_MGV">MGV</el-menu-item>
                <el-menu-item index="phage_protein_tmhmm_TemPhD">TemPhD</el-menu-item>
            </el-menu>
        </div>
        <div v-loading="loading" class="h-420">
            <n-data-table :columns="columns" :data="proteinList" :max-height="1600" />
        </div>
        <div>
            <n-pagination
                class="mt-10 ml-130 mb-20"
                v-model:page="pagevalue"
                v-model:pageSize="pageSize"
                show-size-picker
                :default-page-size="30"
                :page-sizes="[30, 50, 100]"
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
    <el-dialog v-model="detailVisible" title="Transmembrane Protein Detail" width="90%">
        <el-descriptions title="" :column="2" size="large" border>
            <el-descriptions-item label="ID">{{ detailInfo.id }}</el-descriptions-item>
            <el-descriptions-item label="Protein ID">
                {{ detailInfo.Protein_id }}
            </el-descriptions-item>
            <el-descriptions-item label="Phage Accession ID">
                {{ detailInfo.Phage_Acession_ID }}
            </el-descriptions-item>
            <el-descriptions-item label="Length">{{ detailInfo.Length }}</el-descriptions-item>
            <el-descriptions-item label="Number of predicted TMHs">
                {{ detailInfo.predictedTMHsNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="Exp number of AAs in TMHs">
                {{ detailInfo.ExpnumberofAAsinTMHs }}
            </el-descriptions-item>
            <el-descriptions-item label="Exp number, first 60 AAs">
                {{ detailInfo.Expnumberfirst60AAs }}
            </el-descriptions-item>
            <el-descriptions-item label="Total prob of N-in">
                {{ detailInfo.TotalprobofNin }}
            </el-descriptions-item>
            <el-descriptions-item label="POSSIBLE N-term signal sequence">
                {{ detailInfo.POSSIBLENterm }}
            </el-descriptions-item>
            <el-descriptions-item label="Inside Source">
                {{ detailInfo.insidesource }}
            </el-descriptions-item>
            <el-descriptions-item label="Inside Start">
                {{ detailInfo.insidestart }}
            </el-descriptions-item>
            <el-descriptions-item label="Inside End">
                {{ detailInfo.insideend }}
            </el-descriptions-item>
            <el-descriptions-item label="TM Helix Source">
                {{ detailInfo.TMhelixsource }}
            </el-descriptions-item>
            <el-descriptions-item label="TM Helix Start">
                {{ detailInfo.TMhelixstart }}
            </el-descriptions-item>
            <el-descriptions-item label="TM Helix End">
                {{ detailInfo.TMhelixend }}
            </el-descriptions-item>
            <el-descriptions-item label="Outside Source">
                {{ detailInfo.outsidesource }}
            </el-descriptions-item>
            <el-descriptions-item label="Outside Start">
                {{ detailInfo.outsidestart }}
            </el-descriptions-item>
            <el-descriptions-item label="Outside End">
                {{ detailInfo.outsideend }}
            </el-descriptions-item>
        </el-descriptions>
    </el-dialog>
    <el-dialog v-model="proteinInfoVisible" title="Protein Informatioin Detail" width="90%">
        <proteindetail
            v-if="proteinInfoVisible"
            v-model:proteinInfo="proteinInfo"
            v-model:dataset="dataset"
        />
    </el-dialog>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
// @ts-nocheck
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { h } from 'vue'
import { NButton, NTag, NTooltip } from 'naive-ui'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import {
    CloudDownloadOutline as downicon,
    ChevronBack,
    ChevronForward,
    FunnelOutline,
} from '@vicons/ionicons5'
import axios from 'axios'
import _ from 'lodash'
import proteindetail from '../protein/detail.vue'

const router = useRouter()
const loading = ref(false)

const detailVisible = ref(false)

const detailInfo = ref()
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeysRef.value = rowKeys
}
const dataset = ref('phage_protein_tmhmm_NCBI')

type RowData = {
    id: number
    Phage_Acession_ID: string
    Protein_id: string
    Length: string
    predictedTMHsNumber: string
    ExpnumberofAAsinTMHs: string
    Expnumberfirst60AAs: string
    TotalprobofNin: string
    POSSIBLENterm: string
    insidesource: string
    insidestart: string
    insideend: string
    TMhelixsource: string
    TMhelixstart: string
    TMhelixend: string
    outsidesource: string
    outsidestart: string
    outsideend: string
}

const pagevalue = ref(1)
const pageSize = ref(30)

const proteindata = ref()

// function checktype(row) {
//     console.log(row)
// }
onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/${dataset.value}/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    proteindata.value = data
    loading.value = false
})

const proteinList = computed(() => {
    return proteindata.value?.results
})

const count = computed(() => proteindata.value?.count)

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(`/${dataset.value}/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    proteindata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    const response = await axios.get(`/${dataset.value}/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    proteindata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    const response = await axios.get(`/${dataset.value}/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    proteindata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(`/${dataset.value}/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    proteindata.value = data
    loading.value = false
}

const searchinput = ref('')

const templatedata = ref()
const filtersearch = () => {
    templatedata.value = proteindata.value.results

    proteindata.value.results = _.filter(proteindata.value.results, obj => {
        return JSON.stringify(obj).includes(searchinput.value)
    })
}
const resetsearch = () => {
    searchinput.value = ''
    if (templatedata.value) {
        proteindata.value.results = templatedata.value
    }
}

const proteinInfo = ref()
const proteinInfoVisible = ref(false)

const viewProtein = async (row: any) => {
    loading.value = true
    const response2 = await axios.get(`/phage/protein/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            phageid: row.Phage_Acession_ID,
            proteinid: row.Protein_id,
        },
    })

    // eslint-disable-next-line prefer-destructuring
    proteinInfo.value = response2.data
    console.log(proteinInfo.value)
    loading.value = false
    proteinInfoVisible.value = true
}

const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}

const createColumns = (): DataTableColumns<RowData> => [
    {
        title: 'ID',
        key: 'id',
        align: 'center',
        sorter: 'default',
        defaultSortOrder: 'ascend',
        fixed: 'left',
        width: 130,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Phage ID' }), 'phage ID')
        },
        key: 'Phage_Acession_ID',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        render(row: any) {
            return h('div', { style: { width: '130px' } }, [
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
            return renderTooltip(h('div', null, { default: () => 'Length' }), 'protein length')
        },
        key: 'Length',
        align: 'center',
        sorter: 'default',
        width: 130,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Predicted TMHs Number' }),
                'number of predicted transmembrane helices'
            )
        },
        key: 'predictedTMHsNumber',
        align: 'center',
        sorter: 'default',
    },

    // {
    //         title: 'Completeness',
    //         key: 'completeness',
    //         align: 'center',
    //         width: 140,
    //         // filterOptions: [
    //         //     {
    //         //         label: 'transmembrane',
    //         //         value: 'transmembrane',
    //         //     },
    //         //     {
    //         //         label: 'Inside',
    //         //         value: 'Inside',
    //         //     },
    //         //     {
    //         //         label: 'Outside',
    //         //         value: 'Outside',
    //         //     },
    //         // ],
    //         // filter(value: any, row: any) {
    //         //     return row.completeness === value
    //         // },
    //         render(row: any) {
    //             return h('div', { style: { width: '100px' } }, [
    //                 h(
    //                     NTag,
    //                     {
    //                         type: complete(row.completeness),
    //                         size: 'small',
    //                     },
    //                     {
    //                         default: () => row.completeness,
    //                     }
    //                 ),
    //             ])
    //         },
    //     },
    {
        title: 'Actions',
        key: 'actions',
        width: 250,
        align: 'center',
        render(row: any) {
            return h(
                'div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-around',
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
                                detailInfo.value = row
                                detailVisible.value = true
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
                            onClick: () => viewProtein(row),
                        },
                        { default: () => 'View Protein' }
                    ),
                ]
            )
        },
    },
]
const columns = createColumns()

const handleSelectSet = async (key: any) => {
    dataset.value = key
    loading.value = true
    const response = await axios.get(`/${dataset.value}/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    proteindata.value = data
    loading.value = false
}
const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
const gofilter = () => {
    router.push({ path: '/database/filter' })
}
</script>
