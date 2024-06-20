<template>
    <div class="h-680 flex flex-col py-10 px-30">
        <div class="mt-5 mb-18">
            <div class="flex flex-row w-200">
                <div class="text-4xl font-500 mb-12">{{ subclusterinfo.subcluster }}</div>
                <div class="mt-1.5 ml-10">
                    <el-button class="ml-5" @click="detailclick" v-show="isVisableDetailButton">
                        <template #icon>
                            <View />
                        </template>
                        View
                    </el-button>
                    <el-button class="ml-5" @click="detailclick" v-show="!isVisableDetailButton">
                        <template #icon>
                            <Hide />
                        </template>
                        Hide
                    </el-button>
                </div>
            </div>
            <el-descriptions
                v-show="!isVisableDetailButton"
                class="w-330 text-xl"
                :column="2"
                size="large"
                border
            >
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Representative Sequence</div>
                    </template>
                    {{ subclusterinfo.repsequence }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Members</div>
                    </template>
                    {{ subclusterinfo.member }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Host</div>
                    </template>
                    {{ subclusterinfo.host }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Average Size(bp)</div>
                    </template>
                    {{ subclusterinfo.average_length }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Average GC Content(%)</div>
                    </template>
                    {{ subclusterinfo.average_gc }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Average Genes</div>
                    </template>
                    {{ subclusterinfo.average_genes }}
                </el-descriptions-item>
                <!-- <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Average tRNAs</div>
                    </template>
                    {{ subclusterinfo.trna }}
                </el-descriptions-item> -->
            </el-descriptions>
        </div>
        <div class="flex flex-row justify-between mb-4">
            <div class="flex flex-row w-200">
                <div class="text-4xl font-500 mb-8">Phage Members</div>
                <div class="mt-1.5 ml-4">
                    <n-dropdown trigger="hover" :options="dropdownoptions" :show-arrow="true">
                        <n-button>
                            DownLoad
                            <template #icon>
                                <n-icon><downicon /></n-icon>
                            </template>
                        </n-button>
                    </n-dropdown>
                </div>
            </div>

            <!-- <div class="w-70 h-9 flex flex-row">
                <span class="w-20 text-base mt-2">Search:</span>
                <n-input></n-input>
            </div> -->
        </div>
        <div v-loading="loading">
            <n-data-table
                :columns="columns"
                :data="phageList"
                :row-key="rowKey"
                :pagination="pagination"
                :scroll-x="1550"
                :max-height="1600"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag, NEllipsis } from 'naive-ui'
import axios from 'axios'
// import _ from 'lodash'
//
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
import { View, Hide } from '@element-plus/icons-vue'

const isVisableDetailButton = ref(false)
const detailclick = () => {
    isVisableDetailButton.value = !isVisableDetailButton.value
}
const dropdownoptions = [
    {
        label: 'Selected Data',
        key: 'SelectedData',
    },
    {
        label: 'All Data',
        key: 'All Datau',
    },
]
const router = useRouter()
const route = useRoute()
const subclusterdata = ref([
    {
        id: '',
        subcluster: '',
        repsequence: '',
        member: '',
        average_length: '',
        average_gc: '',
        host: '',
        average_genes: null,
        trna: '',
        cluster: '',
    },
])
const phagedata = ref()
const loading = ref(false)
onBeforeMount(async () => {
    loading.value = true
    const subclusterid = computed(() => route.query?.subclusterid as unknown as number)
    const response = await axios.get(`/subcluster/detail`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            subclusterid: subclusterid.value,
        },
    })
    const { data } = response
    subclusterdata.value = data

    const responses2 = await axios.get(`/phage/subcluster`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            subclusterid: subclusterid.value,
        },
    })
    const phageresdata = responses2.data
    phagedata.value = phageresdata
    loading.value = false
})
type RowData = {
    id: number
    Acession_ID: string
    Data_Sets: string
    length: string
    gc_content: any
    host: string
    completeness: string
    taxonomy: string
    cluster: string
    subcluster: string
}

const subclusterinfo = computed(() => {
    return subclusterdata.value[0]
})
const phageList = computed(() => {
    return phagedata.value
})
const pagination = reactive({
    page: 1,
    pageSize: 30,
    showSizePicker: true,
    pageSizes: [30, 50, 100],
    onChange: (page: number) => {
        pagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        pagination.pageSize = pageSize
        pagination.page = 1
    },
})

const rowKey = (row: any) => {
    return row.id
}
const download = (row: any) => {
    console.log(row)
    window.open('http://localhost:8328/public/dataExample/data_demo/data.zip')
}
const detail = (row: any) => {
    router.push({ path: '/database/phage/detail', query: { phageid: row.id } })
}
const complete = (comp: any) => {
    if (comp === 'Medium-quality') {
        return 'info'
    }
    if (comp === 'High-quality') {
        return 'success'
    }
    if (comp === 'Low-quality') {
        return 'warning'
    }
    if (comp === 'Complete') {
        return 'success'
    }
    return 'warning'
}
/*const createColumns = (): DataTableColumns<RowData> => {
    return [
        {
            type: 'selection',
        },
        {
            title: 'ID',
            key: 'id',
            sorter: 'default',
            align: 'center',
            width: 80,
            fixed: 'left',
        },
        {
            title: 'Phage ID',
            key: 'Acession_ID',
            align: 'center',
            fixed: 'left',
            width: 125,
            render(row: any) {
                return h('div', null, [
                    h(
                        NButton,
                        {
                            type: 'info',
                            text: true,
                            size: 'small',
                            style: { width: '100px' },
                            onClick: () => {
                                window.open(`${row.reference}`)
                            },
                        },
                        [
                            h(NEllipsis, null, {
                                default: () => {
                                    return row.Acession_ID
                                },
                            }),
                        ]
                    ),
                ])
            },
        },
        {
            title: 'Data Source',
            key: 'Data_Sets',
            align: 'center',
            width: 125,
            filterOptions: [
                {
                    label: 'Genbank',
                    value: 1,
                },
                {
                    label: 'RefSeq',
                    value: 2,
                },
                {
                    label: 'DDBJ',
                    value: 3,
                },
                {
                    label: 'EMBL',
                    value: 4,
                },
                {
                    label: 'Genbank',
                    value: 5,
                },
                {
                    label: 'PhagesDB',
                    value: 6,
                },
                {
                    label: 'GPD',
                    value: 7,
                },
                {
                    label: 'GVD',
                    value: 8,
                },
                {
                    label: 'MGV',
                    value: 9,
                },
                {
                    label: 'TemPhD',
                    value: 10,
                },
            ],
            filter(value: any, row: any) {
                return row.Data_Sets === value
            },
            render(row: any) {
                return h('div', { style: { width: '100px' } }, [
                    h(
                        NTag,
                        {
                            type: 'info',
                            size: 'small',
                        },
                        {
                            default: () => {
                                const dataset = [
                                    'Genbank',
                                    'RefSeq',
                                    'DDBJ',
                                    'EMBL',
                                    'Genbank',
                                    'PhagesDB',
                                    'GPD',
                                    'GVD',
                                    'MGV',
                                    'TemPhD',
                                ]
                                return dataset[row.Data_Sets - 1]
                            },
                        }
                    ),
                ])
            },
        },
        {
            title: 'Taxonomy',
            key: 'taxonomy',
            align: 'center',
            width: 120,
        },
        {
            title: 'Genome length(bp)',
            key: 'length',
            sorter: 'default',
            align: 'center',
            width: 128,
        },
        {
            title: 'Host',
            key: 'host',
            align: 'center',
            width: 200,
            ellipsis: {
                tooltip: true,
            },
        },
        {
            title: 'GC Content',
            key: 'gc_content',
            sorter: 'default',
            align: 'center',
            width: 120,
        },
        {
            title: 'Completeness',
            key: 'completeness',
            align: 'center',
            width: 140,
            filterOptions: [
                {
                    label: 'Medium-quality',
                    value: 'Medium-quality',
                },
                {
                    label: 'High-quality',
                    value: 'High-quality',
                },
                {
                    label: 'Low-quality',
                    value: 'Low-quality',
                },
                {
                    label: 'Complete',
                    value: 'Complete',
                },
                {
                    label: 'Not-determined',
                    value: 'Not-determined',
                },
            ],
            filter(value: any, row: any) {
                return row.completeness === value
            },
            render(row: any) {
                return h('div', { style: { width: '100px' } }, [
                    h(
                        NTag,
                        {
                            type: complete(row.completeness),
                            size: 'small',
                        },
                        {
                            default: () => row.completeness,
                        }
                    ),
                ])
            },
        },
        {
            title: 'Clusters',
            key: 'cluster',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: 130,
        },
        {
            title: 'Subclusters',
            key: 'subcluster',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: 130,
        },
        {
            title: 'Action',
            key: 'actions',
            align: 'center',
            width: 180,
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
                                size: 'small',
                                type: 'info',
                                onClick: () => detail(row),
                            },
                            { default: () => 'Detail' }
                        ),
                        h(
                            NButton,
                            {
                                strong: true,
                                size: 'small',
                                type: 'primary',
                                onClick: () => download(row),
                            },
                            {
                                default: () => 'Download',
                            }
                        ),
                    ]
                )
            },
        },
    ]
}

const columns = createColumns()
</script>
*/