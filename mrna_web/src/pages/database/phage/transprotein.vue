<template>
    <div v-show="phageStore.phagetransprotein.length !== 0">
        <div>
            <div class="text-4xl font-500 mb-8 w-350 border-b-2 border-gray-300 pb-4">
                Transmembrane Protein
            </div>
            <div class="flex w-350">
                <n-data-table
                    v-loading="loading"
                    :data="proteinList"
                    :columns="columns"
                    :max-height="250"
                    :pagination="pagination"
                />
            </div>
        </div>
        <div class="text-2xl font-500 my-10">Annotated Genome Map with Transmembrane Protein</div>
        <div
            style="box-shadow: 0 0 64px #cfd5db"
            class="w-310 h-245 ml-15"
            v-if="proteinList.length !== 0"
        >
            <transprocirco />
        </div>
    </div>
    <el-dialog v-model="proteinVisible" title="Transmembrane Protein Detail" width="90%">
        <el-descriptions title="Transmembrane Protein Detail" :column="2" size="large" border>
            <el-descriptions-item label="ID">{{ proteinInfo.id }}</el-descriptions-item>
            <el-descriptions-item label="Protein ID">
                {{ proteinInfo.Protein_id }}
            </el-descriptions-item>
            <el-descriptions-item label="Phage Accession ID">
                {{ proteinInfo.Phage_Acession_ID }}
            </el-descriptions-item>
            <el-descriptions-item label="Length">{{ proteinInfo.Length }}</el-descriptions-item>
            <el-descriptions-item label="Number of predicted TMHs">
                {{ proteinInfo.predictedTMHsNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="Exp number of AAs in TMHs">
                {{ proteinInfo.ExpnumberofAAsinTMHs }}
            </el-descriptions-item>
            <el-descriptions-item label="Exp number, first 60 AAs">
                {{ proteinInfo.Expnumberfirst60AAs }}
            </el-descriptions-item>
            <el-descriptions-item label="Total prob of N-in">
                {{ proteinInfo.TotalprobofNin }}
            </el-descriptions-item>
            <el-descriptions-item label="POSSIBLE N-term signal sequence">
                {{ proteinInfo.POSSIBLENterm }}
            </el-descriptions-item>
            <el-descriptions-item label="Inside Source">
                {{ proteinInfo.insidesource }}
            </el-descriptions-item>
            <el-descriptions-item label="Inside Start">
                {{ proteinInfo.insidestart }}
            </el-descriptions-item>
            <el-descriptions-item label="Inside End">
                {{ proteinInfo.insideend }}
            </el-descriptions-item>
            <el-descriptions-item label="TM Helix Source">
                {{ proteinInfo.TMhelixsource }}
            </el-descriptions-item>
            <el-descriptions-item label="TM Helix Start">
                {{ proteinInfo.TMhelixstart }}
            </el-descriptions-item>
            <el-descriptions-item label="TM Helix End">
                {{ proteinInfo.TMhelixend }}
            </el-descriptions-item>
            <el-descriptions-item label="Outside Source">
                {{ proteinInfo.outsidesource }}
            </el-descriptions-item>
            <el-descriptions-item label="Outside Start">
                {{ proteinInfo.outsidestart }}
            </el-descriptions-item>
            <el-descriptions-item label="Outside End">
                {{ proteinInfo.outsideend }}
            </el-descriptions-item>
        </el-descriptions>
    </el-dialog>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
// @ts-nocheck
// import { Search } from '@element-plus/icons-vue'
import { NButton } from 'naive-ui'
import axios from 'axios'
import { usePhageStore } from '@/store/phage'
import transprocirco from '../../visualize/components/transprocirco.vue'

const proteinVisible = ref(false)
const proteinInfo = ref()
const phageStore = usePhageStore()
const proteindata = ref([])
const loading = ref(false)

const props = defineProps({
    type: String,
    taskid: String,
})

onBeforeMount(async () => {
    loading.value = true
    phageStore.transproteinloaded = false
    if (props.type === 'taskresult') {
        const response = await axios.get(`tasks/result/phage/transmembranes/`, {
            baseURL: '/api',
            timeout: 100000,
            params: {
                phageid: phageStore.phageid,
                taskid: props.taskid,
            },
        })
        proteindata.value = response.data.results
    } else {
        const response = await axios.get(`phage/transprotein/`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                phageid: phageStore.phageid,
            },
        })
        proteindata.value = response.data
    }
    phageStore.phagetransprotein = proteindata.value
    loading.value = false
    phageStore.transproteinloaded = true
})

const proteinList = computed(() => {
    if (proteindata.value.length === 0) {
        return []
    }
    return proteindata.value
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
const createColumns = (): DataTableColumns<RowData> => [
    {
        title: 'Protein ID',
        key: 'Protein_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Length',
        key: 'Length',
        align: 'center',
        sorter: 'default',
        width: 220,
    },
    {
        title: 'Predicted TMHs Number',
        key: 'predictedTMHsNumber',
        align: 'center',
        sorter: 'default',
    },
    {
        title: 'Action',
        key: 'actions',
        width: '220px',
        align: 'center',
        fixed: 'right',
        render(row: any) {
            return h(
                'div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'center',
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
                                proteinVisible.value = true
                            },
                        },
                        { default: () => 'Detail' }
                    ),
                ]
            )
        },
    },
]
const columns = createColumns()
</script>
