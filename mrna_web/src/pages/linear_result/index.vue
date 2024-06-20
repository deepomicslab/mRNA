<template>
    <div class="h-680 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">linear design result</div>
            <el-button round color="#34498E" class="ml-5 mt-2" @click="godatahelper">
                Database Helper
            </el-button>
        </div>
        <div>
            <p>UniProtID:</p>
            <textarea v-model="UniProtID"></textarea>
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
                <el-menu-item index="phage_protein_RefSeq">Antigen</el-menu-item>
            </el-menu>
        </div>
        <div v-loading="loading" class="h-42">
            <n-data-table
                :columns="columns"
                :data="AntigenList"
                :row-key="rowKey"
                :max-height="1600"
                @update:checked-row-keys="handleCheck"
            />
        </div>
        <div v-if="showIframe">
            <iframe :src="url" scrolling="auto" frameborder="no" class="mt-100 w-full h-106" />
        </div>
        <div>
            <n-pagination
                class="mt-10 ml-130 mb-45"
                v-model:page="pagevalue"
                v-model:pageSize="pageSize"
                show-size-picker
                :default-page-size="10"
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
import { NButton, NTooltip } from 'naive-ui'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { CloudDownloadOutline as downicon, ChevronBack, ChevronForward } from '@vicons/ionicons5'
import axios from 'axios'
import _ from 'lodash'
// import secStructure from '../resultdisplay/second_structure.vue'
// import { watchEffect } from 'vue'
// import { usemrnaStore } from '@/store/mrna'

// import proteindetail from './detail.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
const UniProtID = ref('')

// 当组件加载时获取查询参数
onMounted(() => {
    UniProtID.value = route.query.UniProtID
})

const router = useRouter()
const loading = ref(false)

// const proteinVisible = ref(false)
const showIframe = ref(false)
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
const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}
type RowData = {
    ID: number
    AgACC: string
    AntigenName: string
    mRNA_sequence: string
    mRNA_structure: string
    mRNA_folding_free_energy: string
    mRNA_CAI: number
}

/* type RowData = {
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
*/
const pagevalue = ref(1)
const pageSize = ref(10)

const Antigendata = ref()
// const mRNA_structure = ref()
// const mRNA_sequence = ref()

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
onMounted(async () => {
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/TAntigens/search/?UniProtID=${UniProtID.value}`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    // mRNA_structure.value = data[0].mRNA_structure
    // mRNA_sequence.value = data[0].mRNA_sequence
    loading.value = false
})

// const AntigenList = computed(() => {
//   return Antigendata.value?.results
// })
const AntigenList = computed(() => {
    return Antigendata.value
})
console.log(Antigendata)
console.log(AntigenList.value)
const count = computed(() => Antigendata.value?.count)
console.log(count)
// const mrnaStore = usemrnaStore()
const url = ref('')

// console.log(mrnaStore.StructureList)
/* const mRNA_structure = computed(() => {
    return Antigendata.value[0]
})
console.log(mRNA_structure)
const mRNA_sequence = computed(() => {
    return Antigendata.value[0].mRNA_sequence
})
console.log(mRNA_sequence)

url.value = `http://nibiru.tbi.univie.ac.at/forna/forna.html?id=url/name&structure=${mRNA_structure}&sequence=${mRNA_sequence}`
 */
// url.value = `http://nibiru.tbi.univie.ac.at/forna/forna.html?id=url/name&structure=${mRNA_structure.value}&sequence=${mRNA_sequence.value}`
// const url = `http://nibiru.tbi.univie.ac.at/forna/forna.html?id=url/name&structure=((((.((((.....(((((((..((((((((.((((((((((.((..((..((((.((((..((((....((((((((((((((.((((((((....))))))))..))))).((((.(((.(((((((((((.((((...)))).))))))))))).)))))))..(((((((((.(((((.......((((((((((.(..(.....)..).))))).)))))))))).))))))))).(((((.(((((((.(((((((((..........(((((((((((((((((...))))))))))))))))))))))))))))))))).)))))..........))).).))))).....))))..))))))))..))..)).))))))))))..))))))))..)).))))).)))).))))....&sequence=AUGGGGGCCCCCACGCUGCCACCGGCCUGGCAGCCUUUUCUGAAGGAUCACCGGAUCUCCACCUUCAAGAAUUGGCCCUUCCUCGAGGGGUGCGCCUGCACCCCUGAGAGGAUGGCCGAGGCCGGGUUCAUUCACUGUCCCACAGAGAAUGAGCCCGACCUGGCCCAGUGCUUCUUCUGCUUCAAGGAGCUCGAGGGGUGGGAGCCCGACGACGACCCCAUCGAGGAGCACAAGAAGCACAGUUCUGGGUGCGCCUUCCUGUCCGUGAAGAAGCAGUUUGAGGAGCUCACCCUGGGUGAGUUCCUCAAGCUGGACAGGGAGCGCGCCAAGAACAAGAUCGCCAAGGAGACCAAUAACAAGAAGAAGGAGUUCGAGGAGACUGCAGAGAAGGUGCGCCGGGCCAUUGAGCAGCUGGCCGCCAUGGAC`
// console.log(url.value)
const nextPage = async () => {
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/TAntigens/search/?UniProtID=${UniProtID.value}`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/TAntigens/search/?UniProtID=${UniProtID.value}`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/TAntigens/search/?UniProtID=${UniProtID.value}`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/TAntigens/search/?UniProtID=${UniProtID.value}`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}

const rowKey = (row: RowData) => {
    return row.id
}

const searchinput = ref('')

const templatedata = ref()
const filtersearch = () => {
    templatedata.value = Antigendata.value.results

    Antigendata.value.results = _.filter(Antigendata.value.results, obj => {
        return JSON.stringify(obj).includes(searchinput.value)
    })
}
const resetsearch = () => {
    searchinput.value = ''
    if (templatedata.value) {
        Antigendata.value.results = templatedata.value
    }
}
const updateIframe = (structure, sequence) => {
    const encodedStructure = encodeURIComponent(structure)
    const encodedSequence = encodeURIComponent(sequence)
    url.value = `http://nibiru.tbi.univie.ac.at/forna/forna.html?id=url/name&structure=${encodedStructure}&sequence=${encodedSequence}`
    showIframe.value = true
}
const createColumns = (): DataTableColumns<RowData> => [
    {
        type: 'selection',
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'ID' }), 'ID')
        },
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
        title() {
            return renderTooltip(h('div', null, { default: () => 'AgACC' }), 'AgACC')
        },
        key: 'AgACC',
        align: 'center',
        sorter: 'default',
        defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'AntigenName' }), 'AntigenName')
        },
        key: 'AntigenName',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'mRNA_sequence' }),
                'mRNA_sequence'
            )
        },
        key: 'mRNA_sequence',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'mRNA_structure' }),
                'mRNA_structure'
            )
        },
        key: 'mRNA_structure',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'mRNA_folding_free_energy' }),
                'mRNA_folding_free_energy'
            )
        },
        key: 'mRNA_folding_free_energy',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'mRNA_CAI' }), 'mRNA_CAI')
        },
        key: 'mRNA_CAI',
        align: 'center',
        sorter: 'default',
        // defaultSortOrder: 'ascend',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Action',
        key: 'action',
        align: 'center',
        fixed: 'right',
        render(row) {
            return h(
                NButton,
                {
                    type: 'primary',
                    onClick: () => updateIframe(row.mRNA_structure, row.mRNA_sequence),
                },
                { default: () => 'Show Structure' }
            )
        },
    },
]
const columns = createColumns()

const handleSelectSet = async (key: any) => {
    dataset.value = key
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/TAntigens/search/?aUniProtID=${UniProtID.value}`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}
const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>
