<template>
    <div v-show="arList.length !== 0 || vfList.length !== 0">
        <div class="text-4xl font-500 mb-8 w-350 border-b-2 border-gray-300 pb-4">
            Virulent Factor / Antimicrobial Resistance Gene
        </div>
        <div v-if="vfList.length !== 0" class="flex-col w-350">
            <div class="text-2xl font-500 mb-4 w-350 pb-4">Virulent Factor</div>
            <n-data-table
                v-loading="loading"
                :data="vfList"
                :columns="vfColumns"
                :max-height="250"
                :pagination="vfPagination"
            />
        </div>
        <div v-if="arList.length !== 0" class="flex-col w-350 mt-10">
            <div class="text-2xl font-500 mb-4 w-350 pb-4">Antimicrobial Resistance Gene</div>
            <n-data-table
                v-loading="loading"
                :data="arList"
                :columns="arColumns"
                :max-height="250"
                :pagination="arPagination"
            />
        </div>

        <div class="text-2xl font-500 my-10">Annotated Genome Map</div>
        <div
            style="box-shadow: 0 0 64px #cfd5db"
            class="w-300 h-220 ml-20"
            v-if="arList.length !== 0 || vfList.length !== 0"
        >
            <arvfcirco />
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
// @ts-nocheck
// import { Search } from '@element-plus/icons-vue'
// import { NButton } from 'naive-ui'
import axios from 'axios'
import { usePhageStore } from '@/store/phage'
import arvfcirco from '../../visualize/components/arvfcirco.vue'

const props = defineProps({
    type: String,
    taskid: String,
})

const phageStore = usePhageStore()
const arvfdata = ref({ ar: [], vf: [] })
const loading = ref(false)

onBeforeMount(async () => {
    loading.value = true
    phageStore.arvfloaded = false
    if (props.type === 'taskresult') {
        const response = await axios.get(`tasks/result/phage/arvgs/`, {
            baseURL: '/api',
            timeout: 100000,
            params: {
                phageid: phageStore.phageid,
                taskid: props.taskid,
            },
        })
        arvfdata.value = response.data.results
    } else {
        const response = await axios.get(`phage/arvf/`, {
            baseURL: '/api',
            timeout: 100000,
            params: {
                phageid: phageStore.phageid,
            },
        })
        arvfdata.value = response.data
    }

    console.log(arvfdata.value)
    loading.value = false
    phageStore.arvfloaded = true
    phageStore.phagearvf = arvfdata.value
    console.log(arvfdata.value)
})

const vfList = computed(() => {
    return arvfdata.value?.vf
})

const arList = computed(() => {
    return arvfdata.value?.ar
})

const vfPagination = reactive({
    page: 1,
    pageSize: 30,
    showSizePicker: true,
    pageSizes: [30, 50, 100],
    onChange: (page: number) => {
        vfPagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        vfPagination.pageSize = pageSize
        vfPagination.page = 1
    },
})
type VfRowData = {
    id: number
    Protein_id: string
    Aligned_Protein_in_VFDB: string
    Phage_Acession_ID: string
    dataset: string
}
const createVfColumns = (): DataTableColumns<VfRowData> => [
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
        title: 'Protein ID',
        key: 'Protein_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Aligned Protein in VFDB',
        key: 'Aligned_Protein_in_VFDB',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Dataset',
        key: 'dataset',
        align: 'center',
        width: 130,
        disabled: false,
    },
]
const vfColumns = createVfColumns()

const arPagination = reactive({
    page: 1,
    pageSize: 30,
    showSizePicker: true,
    pageSizes: [30, 50, 100],
    onChange: (page: number) => {
        arPagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        arPagination.pageSize = pageSize
        arPagination.page = 1
    },
})
type ArRowData = {
    id: number
    Protein_id: string
    Aligned_Protein_in_CARD: string
    Phage_Acession_ID: string
    dataset: string
}
const createArColumns = (): DataTableColumns<ArRowData> => [
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
        title: 'Protein ID',
        key: 'Protein_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Aligned Protein in CARD',
        key: 'Aligned_Protein_in_CARD',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
    },
]
const arColumns = createArColumns()
</script>
