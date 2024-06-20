<template>
    <div class="flex flex-col mx-1/12 justify-start h-900">
        <div class="mt-14">
            <div class="flex flex-row w-200">
                <div class="text-4xl font-500 mb-8">Cluster Informtion</div>
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
            <el-descriptions class="text-xl" :column="2" size="large" border v-show="detailinfo">
                <el-descriptions-item class="text-xl">
                    <template #label>
                        <div class="cell-item">Cluster ID</div>
                    </template>
                    {{ ClusterStore.clusterdata.cluster }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item"># of subclusters</div>
                    </template>
                    {{ ClusterStore.clusterdata.subclusters }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item"><div class="cell-item"># of members</div></div>
                    </template>
                    {{ ClusterStore.clusterdata.member }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Avg Length(bp)</div>
                    </template>
                    {{ ClusterStore.clusterdata.average_length }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Avg GC%</div>
                    </template>
                    {{ ClusterStore.clusterdata.average_gc }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="flex flex-row justify-between mb-4 mt-10 w-330">
            <div class="text-4xl font-500 mb-4">Subclusters</div>
        </div>

        <div v-loading="loadSubcluster">
            <n-data-table
                :columns="subclustercolumns"
                :data="subclusterList"
                :row-key="rowKey"
                :max-height="280"
                :pagination="pagination"
            />
        </div>

        <div class="mt-1">
            <div class="flex flex-row w-200">
                <div class="text-4xl font-500 mb-5">Phage Members</div>
                <el-dropdown class="mx-4 mt-2">
                    <el-button type="primary">
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
                <el-button class="mt-2" type="primary" @click="showalignment">
                    <template #icon>
                        <el-icon><Platform /></el-icon>
                    </template>
                    Multiple Alignment
                </el-button>
            </div>
            <div v-loading="loadPhage">
                <n-data-table
                    :columns="columns"
                    :data="phageList"
                    :row-key="rowKey"
                    :pagination="pagination2"
                    :scroll-x="1550"
                    :max-height="280"
                    @update:checked-row-keys="handleCheck"
                />
            </div>
        </div>

        <div class="w-330 mt-10" v-show="showtree">
            <div class="flex flex-row w-200">
                <div class="text-4xl font-500 mb-8">Comparative Tree for the Cluster</div>
            </div>
            <el-scrollbar style="box-shadow: 0 0 64px #cfd5db" class="h-200 w-300">
                <tree />
            </el-scrollbar>
        </div>

        <div class="w-330 mt-10" v-show="showtree">
            <div class="flex flex-row w-200">
                <div class="text-4xl font-500 mb-8">Tree Heatmap for Cluster</div>
            </div>
            <el-scrollbar style="box-shadow: 0 0 64px #cfd5db" class="h-200 w-300">
                <heatmaptree />
            </el-scrollbar>
        </div>
    </div>
    <el-dialog
        v-model="downloaddialogVisible"
        title="Select download data type"
        width="30%"
        align-center
    >
        <div>
            <el-checkbox-group v-model="checkList" :max="1">
                <el-checkbox label="Download FASTA Data" />
                <el-checkbox label="Download GBK Data" />
                <el-checkbox label="Download GFF3 Data" />
                <el-checkbox label="Download Meta Data" />
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="downloaddialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="downloadrequest">Download</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="alignmentdialogVisible" width="75%" align-center>
        <div class="flex flex-row justify-between mt-5 ml-10">
            <div class="flex flex-row w-200">
                <div class="text-2xl font-500">Alignment Detail Map</div>
                <el-button @click="switchmap" class="ml-10" type="primary" v-if="isShowDetail">
                    see overview
                </el-button>
                <el-button @click="switchmap" class="ml-10" type="primary" v-if="!isShowDetail">
                    see detail
                </el-button>
                <el-popover placement="right" :width="400" trigger="click">
                    <template #reference>
                        <el-button class="ml-10" type="primary">
                            Select Phage to view result
                        </el-button>
                    </template>
                    <n-data-table
                        :data="orderList"
                        :columns="columns2"
                        :max-height="550"
                        :row-key="rowKey2"
                        @update:checked-row-keys="handleCheck2"
                    />
                    <div class="my-3 w-full flex flex-row justify-center">
                        <el-button class="mt-1" type="primary" @click="seeresult">
                            View Result
                        </el-button>
                    </div>
                </el-popover>
            </div>
        </div>
        <div v-loading="maploading">
            <div class="ml-10" v-show="isShowDetail">
                <compline />
            </div>
            <div class="ml-10" v-show="!isShowDetail">
                <compcirco2 />
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
// @ts-nocheck
import type { DataTableColumns } from 'naive-ui'
import axios from 'axios'
import _ from 'lodash'
// import { CloudDownloadOutline as di, FunnelOutline } from '@vicons/ionicons5'
// import { Search, View, ArrowDown } from '@element-plus/icons-vue'
import { Platform, View, Hide } from '@element-plus/icons-vue'
//import { NButton, NTag, NEllipsis } from 'naive-ui'
import { NButton, NTag} from 'naive-ui'
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
import tree from '../../visualizer/tree/index.vue'
import heatmaptree from '../../visualizer/treeheatmap/index.vue'
import { useClusterStore } from '@/store/cluster'
import compline from '../../visualize/comparison.vue'
import compcirco2 from '../../visualize/components/comparisoncirco.vue'
import { usePhageStore } from '@/store/phage'

const detailinfo = ref(true)
const ClusterStore = useClusterStore()
const phageStore = usePhageStore()

const subclusterdata = ref([] as any[])
const phagedata = ref([] as any[])
const alignmentdialogVisible = ref(false)
const isShowDetail = ref(true)
const route = useRoute()
const clusterid = computed(() => route.query?.clusterid as number)
const maploading = ref(false)
const loadSubcluster = ref(false)
const loadPhage = ref(false)
const showtree = ref(false)
const isVisableDetailButton = ref(false)

const detailclick = () => {
    isVisableDetailButton.value = !isVisableDetailButton.value
    detailinfo.value = !detailinfo.value
}
const alignmentdata = ref({
    sortedlist: [],
    alignment: [],
    circlealignment: [],
})
onBeforeMount(async () => {
    const respons = await axios.get(`/cluster/detail`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            id: clusterid.value,
        },
    })
    ClusterStore.clusterdata = respons.data
    // important!!! dataload value must be false in initial
    ClusterStore.dataload = false
    loadSubcluster.value = true
    loadPhage.value = true
    const respons4 = await axios.get(`/cluster/tree`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            id: clusterid.value,
        },
    })
    ClusterStore.tasktreetext = respons4.data
    if (respons4.data !== '') {
        showtree.value = true
    }
    const response = await axios.get(`/subclusters`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            clusterid: clusterid.value,
        },
    })
    const { data } = response
    subclusterdata.value = data
    loadSubcluster.value = false

    const responses2 = await axios.get(`/phage/cluster`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            clusterid: clusterid.value,
        },
    })

    phagedata.value = responses2.data
    ClusterStore.taskclusterdata = responses2.data
    loadPhage.value = false

    const responses3 = await axios.get(`cluster/heatmap`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            clusterid: clusterid.value,
        },
    })
    ClusterStore.taskclustercount = responses3.data
    ClusterStore.dataload = true
})

const subclusterList = computed(() => {
    return _.map(subclusterdata.value, (row: any) => {
        // eslint-disable-next-line
        row.average_gc = parseFloat(row.average_gc).toFixed(2)
        return row
    })
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
const pagination2 = reactive({
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
const phageList = computed(() => {
    return _.map(phagedata.value, (row: any) => {
        // eslint-disable-next-line
        row.gc_content = parseFloat(row.gc_content).toFixed(2)
        return row
    })
})
const router = useRouter()

const rowKey = (row: any) => {
    return row.id
}

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

const downloaddialogVisible = ref(false)
const downloadtype = ref('')
const checkList = ref([] as any[])
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeysRef.value = rowKeys
}

const downloadrequest = async () => {
    if (checkList.value.length === 0) {
        window.$message.warning('Please select download data type', {
            closable: true,
            duration: 5000,
        })
    } else if (downloadtype.value === 'selected') {
        if (checkList.value.includes('Download FASTA Data')) {
            window.open(`/api/phage/fasta/?phageids=${checkedRowKeysRef.value}`, '_blank')
        }
        if (checkList.value.includes('Download GFF3 Data')) {
            console.log('88888')
            window.open(`/api/phage/gff/?phageids=${checkedRowKeysRef.value}`, '_blank')
        }
        if (checkList.value.includes('Download GBK Data')) {
            window.open(`/api/phage/gbk/?phageids=${checkedRowKeysRef.value}`, '_blank')
        }
        if (checkList.value.includes('Download Meta Data')) {
            window.open(`/api/phage/meta/?phageids=${checkedRowKeysRef.value}`, '_blank')
        }
    } else if (downloadtype.value === 'single') {
        if (checkList.value.includes('Download Meta Data')) {
            window.open(`/api/phage/meta/?phageid=${checkedRowKeysRef.value[0]}`, '_blank')
        }
        if (checkList.value.includes('Download FASTA Data')) {
            window.open(`/api/phage/fasta/?phageid=${checkedRowKeysRef.value[0]}`, '_blank')
        }
        if (checkList.value.includes('Download GFF3 Data')) {
            window.open(`/api/phage/gff/?phageid=${checkedRowKeysRef.value[0]}`, '_blank')
        }
        if (checkList.value.includes('Download GBK Data')) {
            window.open(`/api/phage/gbk/?phageid=${checkedRowKeysRef.value[0]}`, '_blank')
        }
    } else {
        if (checkList.value.includes('Download Meta Data')) {
            window.open(`/api/phage/meta/`, '_blank')
        }
        if (checkList.value.includes('Download FASTA Data')) {
            window.open(`/api/phage/fasta/`, '_blank')
        }
        if (checkList.value.includes('Download GFF3 Data')) {
            window.open(`/api/phage/gff/`, '_blank')
        }
        if (checkList.value.includes('Download GBK Data')) {
            window.open(`/api/phage/gbk/`, '_blank')
        }
    }
}
const downloadselected = () => {
    if (checkedRowKeysRef.value.length === 0) {
        window.$message.warning('Please select data', {
            closable: true,
            duration: 5000,
        })
    } else {
        downloaddialogVisible.value = true
        downloadtype.value = 'selected'
    }
}
const downloadall = () => {
    downloaddialogVisible.value = true
    downloadtype.value = 'all'
}
const download = (row: any) => {
    downloadtype.value = 'single'
    downloaddialogVisible.value = true
    checkedRowKeysRef.value = [row.id]
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
const createColumns = (): DataTableColumns<RowData> => {
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

type subclusterRowData = {
    id: number
    repsequence: string
    member: string
    average_length: string
    average_gc: string
    host: string
    average_genes: string
    trna: string
}
const createsubclusterColumns = (): DataTableColumns<subclusterRowData> => {
    return [
        {
            title: 'ID',
            key: 'id',
            sorter: 'default',
            align: 'center',
            width: 80,
            fixed: 'left',
        },

        {
            title: 'Representative Sequence',
            key: 'repsequence',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
        },
        {
            title: '# of Members',
            key: 'member',
            sorter: 'default',
            align: 'center',
        },
        {
            title: 'Host',
            key: 'host',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
        },
        {
            title: 'Avg Size(bp)',
            key: 'average_length',
            sorter: 'default',
            align: 'center',
        },
        {
            title: 'Avg GC%',
            key: 'average_gc',
            sorter: 'default',
            align: 'center',
        },

        {
            title: 'Avg # of genes',
            key: 'average_genes',
            sorter: 'default',
            align: 'center',
        },
        {
            title: 'Action',
            key: 'actions',
            align: 'center',
            render(row) {
                return h('div', {}, [
                    h(
                        NButton,
                        {
                            strong: true,
                            size: 'small',
                            type: 'info',
                            onClick: () => {
                                router.push({
                                    path: '/database/cluster/subcluster',
                                    query: { subclusterid: row.id },
                                })
                            },
                        },
                        { default: () => 'Subcluster Detail' }
                    ),
                ])
            },
        },
    ]
}

const subclustercolumns = createsubclusterColumns()

const showalignment = async () => {
    maploading.value = true
    alignmentdialogVisible.value = true
    phageStore.alignmentloaded = false
    const response2 = await axios.get(`cluster/alignment`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            id: clusterid.value,
        },
    })

    alignmentdata.value = response2.data.results
    phageStore.phagecomparisondata = alignmentdata.value
    phageStore.alignmentloaded = true
    maploading.value = false
}

const switchmap = () => {
    isShowDetail.value = !isShowDetail.value
    console.log(isShowDetail.value)
}

const orderList = computed(() => {
    return alignmentdata.value.sortedlist
})
type orderListRowData = {
    order: number
    phage_id: string
}
const rowKey2 = (row: RowData) => {
    return row.phage_id
}
const checkedRowKeysRef2 = ref<DataTableRowKey[]>([])
function handleCheck2(rowKeys: DataTableRowKey[]) {
    if (rowKeys.length > 3) {
        window.$message.warning('Please select no more than three sequences', {
            closable: true,
            duration: 5000,
        })
    } else {
        checkedRowKeysRef2.value = rowKeys
    }
}
const createColumns2 = (): DataTableColumns<orderListRowData> => [
    {
        type: 'selection',
    },
    {
        title: 'Order',
        key: 'order',
        align: 'center',
        width: '100px',
    },
    {
        title: 'Phage ID',
        key: 'phage_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
    },
]
const columns2 = createColumns2()

const seeresult = async () => {
    if (checkedRowKeysRef2.value.length === 0) {
        window.$message.warning('Please select phage ids', {
            closable: true,
            duration: 5000,
        })
    } else {
        maploading.value = true
        phageStore.alignmentloaded = false
        const response2 = await axios.get(`cluster/alignment`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                id: clusterid.value,
                phageids: checkedRowKeysRef2.value.join(', '),
            },
        })
        alignmentdata.value = response2.data.results
        phageStore.phagecomparisondata = alignmentdata.value
        phageStore.alignmentloaded = true
        maploading.value = false
    }
}
</script>
