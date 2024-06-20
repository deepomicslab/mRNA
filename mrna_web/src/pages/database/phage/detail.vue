<template>
    <div class="flex flex-col mx-1/10 justify-start">
        <div class="w-300 mt-18 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Phage Informtion</div>
                <div class="mt-1.5 ml-10">
                    <el-button class="ml-5" @click="download">
                        <template #icon>
                            <n-icon><di /></n-icon>
                        </template>
                        DownLoad Phage Data
                    </el-button>
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
                class="w-350 text-xl mt-8"
                :column="2"
                size="large"
                border
                v-loading="loaddata"
            >
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Phage ID</div>
                    </template>

                    <el-button type="text">
                        <a :href="phagedetail.reference" target="_blank" class="btn">
                            {{ phagedetail.Acession_ID }}
                        </a>
                    </el-button>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Data Source</div>
                    </template>
                    <n-tag type="primary" size="small">
                        {{ dataset[phagedetail.Data_Sets - 1] }}
                    </n-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Taxonomy</div>
                    </template>
                    <el-button type="text" v-if="phagedetail.taxonomy !== 'NA'">
                        {{ phagedetail.taxonomy }}
                    </el-button>
                    <p v-else>{{ phagedetail.taxonomy }}</p>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Completeness</div>
                    </template>
                    <n-tag :type="complete(phagedetail.completeness)" size="small">
                        {{ phagedetail.completeness }}
                    </n-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Genome Length(bp)</div>
                    </template>
                    {{ formatLengthNumber(phagedetail.length) }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Host</div>
                    </template>
                    <el-button type="text">{{ phagedetail.host }}</el-button>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">GC Content(%)</div>
                    </template>
                    {{ parseFloat(phagedetail.gc_content).toFixed(2) }}%
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Lifestyle</div>
                    </template>
                    <n-tag :type="lifestyleColor(phagedetail.lifestyle)" size="small">
                        {{ phagedetail.lifestyle }}
                    </n-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Cluster</div>
                    </template>
                    <el-button type="text">{{ phagedetail.cluster }}</el-button>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Subcluster</div>
                    </template>
                    <el-button type="text">{{ phagedetail.subcluster }}</el-button>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item"># of Gene</div>
                    </template>
                    {{ genes }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item"># of Terminator</div>
                    </template>
                    {{ phageStore.phageterminator.length }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item"># of tRNA & tmRNA</div>
                    </template>
                    {{ phageStore.phagetrna.length }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item"># of Anti-CRISPR Protein</div>
                    </template>
                    {{ phageStore.phageanti.length }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item"># of CRISPR Array</div>
                    </template>
                    {{ phageStore.phagecrispr.length }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item"># of Virulent Factor</div>
                    </template>
                    {{ phageStore.phagearvf.vf.length }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item"># of Antimicrobial Resistance Gene</div>
                    </template>
                    {{ phageStore.phagearvf.ar.length }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item"># of Transmembrane Protein</div>
                    </template>
                    {{ phageStore.phagetransprotein.length }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="w-330 mt-15 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Gene Annotation</div>
            </div>
            <div class="flex flex-row w-350 justify-between mb-5 mt-8">
                <el-button @click="downloadtsv">
                    <template #icon>
                        <n-icon><di /></n-icon>
                    </template>
                    DownLoad Gene Annotation Data
                </el-button>

                <!-- <el-input class="w-50" size="small">
                    <template #append>
                        <el-button :icon="Search" />
                    </template>
                </el-input> -->
            </div>
            <div class="w-350" v-loading="loaddata">
                <n-data-table
                    :data="proteinList"
                    :columns="columns"
                    :pagination="pagination"
                    :max-height="250"
                    :row-key="rowKey"
                />
            </div>
        </div>

        <div class="mt-5 ml-15">
            <div class="flex flex-row w-200">
                <div class="text-2xl font-500 mb-5">Annotated Genome Map</div>
                <div class="mt-1.5 ml-10">
                    <el-button @click="showswicth" v-show="annoshow">View in Circo</el-button>
                    <el-button @click="showswicth" v-show="!annoshow">View in Detail</el-button>
                </div>
            </div>
            <div
                style="box-shadow: 0 0 64px #cfd5db"
                class="w-310 h-200 mt-5 ml-10 mb-20"
                v-show="annoshow"
            >
                <annotation />
            </div>
        </div>
        <div
            style="box-shadow: 0 0 64px #cfd5db"
            class="w-350 h-250 ml-2 mt-5 mb-20"
            v-show="!annoshow"
        >
            <circo />
        </div>
        <div class="mt-20 ml-10" v-show="phageStore.phageterminator.length !== 0">
            <terminator />
        </div>
        <div class="mt-20 ml-10" v-show="phageStore.phagetrna.length !== 0"><trna /></div>
        <div class="mt-20 ml-10" v-show="phageStore.phageanti.length !== 0"><anti /></div>
        <div class="mt-20 ml-10" v-show="phageStore.phagecrispr.length !== 0"><crispr /></div>
        <div
            class="mt-20 ml-10"
            v-show="phageStore.phagearvf.ar.length !== 0 || phageStore.phagearvf.vf.length !== 0"
        >
            <arvf />
        </div>
        <div class="mt-20 ml-10 mb-20" v-show="phageStore.phagetransprotein.length !== 0">
            <transprotein />
        </div>
    </div>

    <el-dialog v-model="proteinVisible" title="Protein Detail" width="90%">
        <proteindetail v-model:proteinInfo="proteinInfo" v-model:dataset="datasets" />
    </el-dialog>
    <el-dialog
        v-model="downloadphagedialogVisible"
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
                <el-button @click="downloadphagedialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="downloadrequest">Download</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- <el-dialog
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
    </el-dialog> -->
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import { CloudDownloadOutline as di } from '@vicons/ionicons5'
//
import axios from 'axios'
import { NButton, NTag } from 'naive-ui'
import _ from 'lodash'
import { View, Hide } from '@element-plus/icons-vue'
import { dataset } from '@/utils/phage'
import proteindetail from '../protein/detail.vue'
import annotation from '../../visualize/components/annotation.vue'
import circo from '../../visualize/components/circo.vue'
import terminator from './terminator.vue'
import anti from './anti.vue'
import crispr from './crispr.vue'
import trna from './trna.vue'
import transprotein from './transprotein.vue'
import arvf from './arvf.vue'
import { usePhageStore } from '@/store/phage'
// import { useVisualizeStore } from '@/store/visualize'
// const visualizeStore = useVisualizeStore()

const phageStore = usePhageStore()
const loaddata = ref(false)
const annoshow = ref(true)
const isVisableDetailButton = ref(false)
const detailclick = () => {
    isVisableDetailButton.value = !isVisableDetailButton.value
}
const showswicth = () => {
    annoshow.value = !annoshow.value
}
const route = useRoute()
const phageid = computed(() => route.query?.phageid as number)

const phagedata = ref({
    id: 1,
    Acession_ID: '',
    length: '',
    gc_content: '',
    host: '',
    completeness: '',
    taxonomy: '',
    cluster: '',
    subcluster: '',
    Data_Sets: '',
})

const proteinVisible = ref(false)
const proteindata = ref([] as any[])
const proteinInfo = ref()
const datasets = ref('')

const downloadphagedialogVisible = ref(false)

const downloadtype = ref('')
const checkList = ref([] as any[])
const checkedRowKeysRef = ref<DataTableRowKey[]>([])

const downloadrequest = async () => {
    if (checkList.value.length === 0) {
        window.$message.warning('Please select download data type', {
            closable: true,
            duration: 5000,
        })
    } else {
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
    }
}

const download = () => {
    downloadtype.value = 'single'
    downloadphagedialogVisible.value = true
    checkedRowKeysRef.value = [phageid.value]
}

onBeforeMount(async () => {
    loaddata.value = true
    phageStore.phagedataloaded = false
    phageStore.phageid = phageid.value
    const response = await axios.get(`/phage/detail`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            id: phageid.value,
        },
    })
    const { data } = response
    phagedata.value = data
    phageStore.phageaccid = data.Acession_ID
    const response2 = await axios.get(`/proteins`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            phageid: phageid.value,
        },
    })
    const prodata = response2.data
    proteindata.value = prodata
    phageStore.phageprotein = prodata
    loaddata.value = false

    const response3 = await axios.get(`phage/fasta/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            phageid: phageid.value,
        },
    })

    phageStore.phagefastadata = response3.data
    phageStore.phagedataloaded = true
})

const phagedetail = computed(() => phagedata.value)

const proteinList = computed(() => proteindata.value)
const genes = computed(() => {
    return proteinList.value.length
})

const formatLengthNumber = num => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(0)}, ${((num / 1000).toFixed(0) % 1000)
            .toString()
            .padStart(3, '0')}, ${(num % 1000).toString().padStart(3, '0')}`
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}, ${(num % 1000).toString().padStart(3, '0')}`
    }
    return num.toString()
}
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
    protein_id: string
    annotate_Source: string
    protein_product: string
    protein_sort_class: string
    start_point: string
    end_point: string
    strand: string
}
const rowKey = (row: RowData) => {
    return row.id
}
const createColumns = (): DataTableColumns<RowData> => [
    {
        type: 'selection',
    },

    {
        title: 'Protein ID',
        key: 'Protein_id',
        align: 'center',
        width: '150',
    },
    {
        title: 'Source',
        key: 'Source',
        align: 'center',
        width: '120px',
    },
    {
        title: 'Function classification',
        key: 'Protein_function_classification',
        align: 'center',
        width: '250px',
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
    },
    {
        title: 'Protein Product',
        key: 'Protein_product',
        align: 'center',
        width: '250px',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Start Point',
        key: 'Start_location',
        align: 'center',
        width: '120px',
        sorter: 'default',
    },
    {
        title: 'End Point',
        key: 'Stop_location',
        align: 'center',
        width: '120px',
        sorter: 'default',
    },
    {
        title: 'Strand',
        key: 'Strand',
        width: '90px',
        align: 'center',
    },
    {
        title: 'Action',
        key: 'actions',
        width: 100,
        align: 'center',
        render(row) {
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
                                console.log(row)
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

const lifestyleColor = (style: any) => {
    if (style === 'virulent') {
        return 'error'
    }
    return 'info'
}
const downloadtsv = () => {
    console.log(proteinList.value)
    if (proteinList.value.length !== 0) {
        const headers = _.keys(proteinList.value[0])
        const formattedData = [headers]
        proteinList.value.forEach(item => {
            const row = _.values(item)
            formattedData.push(row)
        })
        const tsvContent = formattedData.map(row => row.join('\t')).join('\n')
        const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'gene_annotation.tsv'
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(url)
        document.body.removeChild(link)
    }
}
</script>
