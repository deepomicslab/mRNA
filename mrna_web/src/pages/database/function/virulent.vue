<template>
    <div class="h-680 flex flex-col py-5 px-20">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">Virulent Factor Information</div>
            <el-button round color="#34498E" class="ml-5 mt-2" @click="godatahelper">
                Database Helper
            </el-button>
        </div>
        <div class="flex flex-row justify-between mb-4">
            <div class="mt-1.5 ml-1 felx flex-row justify-start items-center">
                <el-button class="mb-1" @click="gofilter">
                    <n-icon class="mr-2"><FunnelOutline /></n-icon>
                    Sequence Filter
                </el-button>
            </div>
        </div>

        <div v-loading="loading" class="h-420 w-400">
            <n-data-table :columns="columns" :data="phageList" :max-height="1600" />
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
    <el-dialog v-model="anticrisprVisible" title="Protein Detail" width="90%">
        <proteindetail
            v-loading="proteinloading"
            v-if="anticrisprVisible"
            v-model:proteinInfo="proteinInfo"
            v-model:dataset="dataset"
        />
    </el-dialog>
</template>
<script setup lang="ts">
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
// @ts-nocheck
import type { DataTableColumns } from 'naive-ui'
import { h } from 'vue'
import { NButton, NTag, NTooltip } from 'naive-ui'
import axios from 'axios'
import { FunnelOutline, ChevronBack, ChevronForward } from '@vicons/ionicons5'
import proteindetail from '../protein/detail.vue'

const anticrisprVisible = ref(false)
const pagevalue = ref(1)
const pageSize = ref(30)
const dataset = ref('')
const loading = ref(false)
const proteinInfo = ref()
const anticrisprdata = ref()
const proteinloading = ref(false)

onBeforeMount(async () => {
    loading.value = true
    loading.value = true
    const response = await axios.get(`/phage_virulent_factor/`, {
        baseURL: '/api',
        timeout: 100000,
    })
    anticrisprdata.value = response.data
    loading.value = false
})

const phageList = computed(() => {
    return anticrisprdata.value?.results
})

const count = computed(() => anticrisprdata.value?.count)
const nextPage = async () => {
    loading.value = true
    const response = await axios.get(`/phage_virulent_factor/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    anticrisprdata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    const response = await axios.get(`/phage_virulent_factor/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    anticrisprdata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    const response = await axios.get(`/phage_virulent_factor/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    anticrisprdata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(`/phage_virulent_factor/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    anticrisprdata.value = data
    loading.value = false
}

const router = useRouter()
const gofilter = () => {
    router.push({ path: '/database/filter' })
}
const virulentInfo = ref({
    id: 1,
    Protein_id: '',
    Aligned_Protein_in_CARD: '',
    Phage_Acession_ID: '',
    dataset: '',
    protein: '',
})

const viewdetail = async (row: any) => {
    proteinloading.value = true
    virulentInfo.value = row

    const response2 = await axios.get(`/phage/protein/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            phageid: virulentInfo.value.Phage_Acession_ID,
            proteinid: virulentInfo.value.Protein_id,
        },
    })
    const proteindata = response2.data
    virulentInfo.value.protein = proteindata
    // eslint-disable-next-line prefer-destructuring
    proteinInfo.value = proteindata
    anticrisprVisible.value = true
    proteinloading.value = false
}
const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}
type crisprRowData = {
    ID: number
    Protein_id: string
    Source: string
    Phage_Acession_ID: string
}
const createColumns = (): DataTableColumns<crisprRowData> => [
    {
        title: 'ID',
        key: 'id',
        align: 'center',
        sorter: 'default',
        defaultSortOrder: 'ascend',
        fixed: 'left',
        width: '120px',
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
            return renderTooltip(
                h('div', null, { default: () => 'Aligned Protein in VFDB' }),
                'aligned protein ID in VFDB'
            )
        },
        key: 'Aligned_Protein_in_VFDB',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
    },

    {
        title: 'Action',
        key: 'actions',
        width: 280,
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
                            onClick: () => viewdetail(row),
                        },
                        { default: () => 'View Protein' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: 'small',
                            type: 'info',
                            onClick: async () => {
                                const response2 = await axios.get(`/phage/protein/`, {
                                    baseURL: '/api',
                                    timeout: 100000,
                                    params: {
                                        phageid: row.Phage_Acession_ID,
                                        proteinid: row.Protein_id,
                                    },
                                })
                                const content = `${response2.data.sequence}`
                                const filename = `${row.Protein_id}.fasta`
                                const blob = new Blob([content], {
                                    type: 'text/plain;charset=utf-8',
                                })
                                const url = URL.createObjectURL(blob)
                                const link = document.createElement('a')
                                link.href = url
                                link.download = filename
                                link.click()
                                URL.revokeObjectURL(url)
                            },
                        },
                        { default: () => 'Download' }
                    ),
                ]
            )
        },
    },
]
const columns = createColumns()

const paginationReactive = reactive({
    page: 1,
    pageSize: 30,
    showSizePicker: true,
    pageSizes: [30, 50, 100],
    showQuickJumper: true,
    onChange: (page: number) => {
        paginationReactive.page = page
    },
})
const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>
