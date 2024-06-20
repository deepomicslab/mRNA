<template>
    <n-modal
        v-model:show="isShowDetail"
        preset="card"
        class="custom-card"
        :style="{
            width: '850px',
        }"
        size="huge"
    >
        <template #header>
            <el-text class="w-200px text-2xl" truncated>
                {{ selectData.value }}
            </el-text>
        </template>
        <div class="border-t-2 border-[#FFA000] mb-5"></div>
        <div class="flex flex-row text-xl">
            <p class="mr-3 font-bold">Start:</p>
            {{ selectData.value }}
        </div>
    </n-modal>
    <div class="flex flex-row bg-gray-50 w-310 h-28">
        <div class="w-120 h-28"></div>
        <div class="text-3xl font-800 ml-7 mt-10"></div>
        <div class="flex flex-row bg-gray-50 w-310 h-28">
            <div class="w-120 h-28">
                <div
                    v-if="isShowSelect"
                    class="text-[18px] text-[#4b89da] mt-17 ml-6 leading-6 flex flex-row"
                >
                    <div class="mr-2 text-xl">
                        <n-icon>
                            <info />
                        </n-icon>
                    </div>
                    Click on a sequence to see details.
                </div>
                <div v-else class="h-28 flex flex-col">
                    <div class="flex flex-row p-2 mt-13 w-70 bg-gray-400 h-11">
                        <n-button
                            size="small"
                            class="text-[12px] ml-6 h-6 mt-0.5"
                            type="info"
                            @click="showDetail"
                        >
                            Detail
                            <template #icon>
                                <n-icon>
                                    <info />
                                </n-icon>
                            </template>
                        </n-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-row bg-gray-50 w-310 h-28">
        <div class="text-3xl font-800 ml-7 mt-10"></div>

        <el-button class="mt-15 ml-80" type="primary">
            <el-icon class="text-base mr-1 mb-0.5"><Document /></el-icon>
            Download SVG Chart
        </el-button>
        <el-button class="mt-15 ml-3" type="primary">
            <el-icon class="text-base mr-1 mb-0.5"><Document /></el-icon>
            Download PNG Chart
        </el-button>
    </div>
    <el-scrollbar class="h-165 flex flex-row items-center" v-loading="loadchart">
        <el-button class="mt-5 ml-3 absolute z-10 ml-290" type="primary" v-if="false">
            <el-icon class="text-xl"><Operation /></el-icon>
        </el-button>

        <svg id="sequenceAnnotation" :height="height - 80" :width="width"></svg>
    </el-scrollbar>
</template>
<script setup lang="ts">
// @ts-nocheck
// import { CloudDownload as down, InformationCircle as info } from '@vicons/ionicons5'
import { InformationCircle as info } from '@vicons/ionicons5'
import { Document, Operation } from '@element-plus/icons-vue'
import * as d3 from 'd3'
import _ from 'lodash'
import { NButton, NModal } from 'naive-ui'
// import axios from 'axios'
// import exampleData from '@store/example'
// import { InformationCircle as info } from '@vicons/ionicons5'
// import { TypeDict, proteinType, countGC } from '@/utils/annotation'
// import { usePhageStore } from '@/store/phage'
// import { usemrnaStore } from '@/store/mrna'
const isShowDetail = ref(false)
const isShowSelect = ref(true)
const selectData = ref(null)
// const loading = ref(false)
// const annotationData = sequencemarker
// const id= ref(1),

const showDetail = () => {
    isShowDetail.value = true
}

const loadchart = ref(true)
// For layout
const width = ref(1200)
const height = ref(800)
// const marginTop = ref(20)
const marginLeft = ref(40)
const lineHeight = ref(180)
// for draw arrow
const barareaMarginLeft = ref(70)
const barHeight = ref(30)

// draw rectangle

function Rectangle(start, end, y) {
    return `M ${end} ${y} H ${start} V ${y + barHeight.value} H ${end} Z`
}
const exampleData = [
    {
        start: '1',
        end: '135',
        length: '135',
        sequence:
            'CUAAUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCC',
        component_type: 'main_regions',
        component_class1: "5' UTR",
        component_class2: '-',
        accession_number: "the 5' untranslated region",
        source: '',
        description: '',
    },
    {
        start: '136',
        end: '234',
        length: '99',
        sequence:
            'AUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
        component_type: 'main_regions',
        component_class1: 'CDS',
        component_class2: '-',
        accession_number: 'the coding region of mRNA',
        source: '',
        description: '',
    },
    {
        start: '235',
        end: '243',
        length: '9',
        sequence: 'AUUGAUUUU',
        component_type: 'main_regions',
        component_class1: "3' UTR",
        component_class2: '-',
        accession_number: "the 3' untranslated region",
        source: '',
        description: '',
    },
    {
        start: '4',
        end: '231',
        length: '231',
        sequence:
            'AUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCCAUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
        component_type: 'uORF',
        component_class1: 'N-terminal extension',
        component_class2: 'weak',
        accession_number: 'SEQ000000_uORF0000',
        source: 'uORF_finder',
        description: 'ORF type: N-terminal extension, with weak uKozak strength',
    },
    {
        start: '9',
        end: '86',
        length: '81',
        sequence:
            'AUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGA',
        component_type: 'uORF',
        component_class1: 'non-overlapping',
        component_class2: 'adequate',
        accession_number: 'SEQ000000_uORF0001',
        source: 'uORF_finder',
        description: 'ORF type: non-overlapping, with adequate uKozak strength',
    },
    {
        start: '23',
        end: '25',
        length: '6',
        sequence: 'AUGUAG',
        component_type: 'uORF',
        component_class1: 'non-overlapping',
        component_class2: 'adequate',
        accession_number: 'SEQ000000_uORF0002',
        source: 'uORF_finder',
        description: 'ORF type: non-overlapping, with adequate uKozak strength',
    },
    {
        start: '42',
        end: '86',
        length: '48',
        sequence: 'AUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGA',
        component_type: 'uORF',
        component_class1: 'non-overlapping',
        component_class2: 'weak',
        accession_number: 'SEQ000000_uORF0003',
        source: 'uORF_finder',
        description: 'ORF type: non-overlapping, with weak uKozak strength',
    },
    {
        start: '61',
        end: '231',
        length: '174',
        sequence:
            'AUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCCAUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
        component_type: 'uORF',
        component_class1: 'N-terminal extension',
        component_class2: 'weak',
        accession_number: 'SEQ000000_uORF0004',
        source: 'uORF_finder',
        description: 'ORF type: N-terminal extension, with weak uKozak strength',
    },
    {
        start: '136',
        end: '231',
        length: '99',
        sequence:
            'AUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
        component_type: 'uORF',
        component_class1: 'NA',
        component_class2: 'adequate',
        accession_number: 'SEQ000000_uORF0005',
        source: 'uORF_finder',
        description: 'ORF type: NA, with adequate uKozak strength',
    },
    {
        start: '142',
        end: '231',
        length: '93',
        sequence:
            'AUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
        component_type: 'uORF',
        component_class1: 'other in frame ORF on CDS',
        component_class2: 'weak',
        accession_number: 'SEQ000000_uORF0006',
        source: 'uORF_finder',
        description: 'ORF type: other in frame ORF on CDS, with weak uKozak strength',
    },
    {
        start: '83',
        end: '87',
        length: '5',
        sequence: 'ACGGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type III',
        component_class2: 'RENZYME00021',
        accession_number: 'REBASE',
        source: 'Found [Bst4CI, HpyCH4III, TaaI] recognization site on seq: ACGGU)',
        description: '',
    },
    {
        start: '30',
        end: '33',
        length: '4',
        sequence: 'AGCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00027',
        accession_number: 'REBASE',
        source: 'Found [AluI, AluBI] recognization site on seq: AGCU)',
        description: '',
    },
    {
        start: '16',
        end: '19',
        length: '4',
        sequence: 'AGGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00028',
        accession_number: 'REBASE',
        source: 'Found [SetI] recognization site on seq: AGGU)',
        description: '',
    },
    {
        start: '30',
        end: '33',
        length: '4',
        sequence: 'AGCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00028',
        accession_number: 'REBASE',
        source: 'Found [SetI] recognization site on seq: AGCU)',
        description: '',
    },
    {
        start: '169',
        end: '172',
        length: '4',
        sequence: 'ACCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00028',
        accession_number: 'REBASE',
        source: 'Found [SetI] recognization site on seq: ACCU)',
        description: '',
    },
    {
        start: '193',
        end: '196',
        length: '4',
        sequence: 'AGGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00028',
        accession_number: 'REBASE',
        source: 'Found [SetI] recognization site on seq: AGGU)',
        description: '',
    },
    {
        start: '209',
        end: '212',
        length: '4',
        sequence: 'ACCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00028',
        accession_number: 'REBASE',
        source: 'Found [SetI] recognization site on seq: ACCU)',
        description: '',
    },
    {
        start: '29',
        end: '34',
        length: '6',
        sequence: 'AAGCUU',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00034',
        accession_number: 'REBASE',
        source: 'Found [HindIII] recognization site on seq: AAGCUU)',
        description: '',
    },
    {
        start: '21',
        end: '26',
        length: '6',
        sequence: 'ACAUGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00035',
        accession_number: 'REBASE',
        source: 'Found [BspLU11I, PciI, PscI] recognization site on seq: ACAUGU)',
        description: '',
    },
    {
        start: '190',
        end: '196',
        length: '7',
        sequence: 'ACCAGGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00037',
        accession_number: 'REBASE',
        source: 'Found [CsiI, MabI, SexAI] recognization site on seq: ACCAGGU)',
        description: '',
    },
    {
        start: '21',
        end: '26',
        length: '6',
        sequence: 'ACAUGU',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00040',
        accession_number: 'REBASE',
        source: 'Found [AflIII] recognization site on seq: ACAUGU)',
        description: '',
    },
    {
        start: '179',
        end: '184',
        length: '6',
        sequence: 'AGAUCU',
        component_type: 'restriction_sites',
        component_class1: 'Type II',
        component_class2: 'RENZYME00042',
        accession_number: 'REBASE',
        source: 'Found [BglII] recognization site on seq: AGAUCU)',
        description: '',
    },
    {
        start: '79',
        end: '88',
        length: '10',
        sequence: 'CACGACGGUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00047',
        accession_number: 'REBASE',
        source: 'Found [AleI, OliI] recognization site on seq: CACGACGGUG)',
        description: '',
    },
    {
        start: '39',
        end: '47',
        length: '9',
        sequence: 'CAGAUGCUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00049',
        accession_number: 'REBASE',
        source: 'Found [AlwNI, CaiI] recognization site on seq: CAGAUGCUG)',
        description: '',
    },
    {
        start: '129',
        end: '135',
        length: '7',
        sequence: 'CACUGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00052',
        accession_number: 'REBASE',
        source: 'Found [TscAI, TspRI] recognization site on seq: CACUGCC)',
        description: '',
    },
    {
        start: '8',
        end: '11',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II, Type III',
        component_class2: 'RENZYME00053',
        accession_number: 'REBASE',
        source: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '22',
        end: '25',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II, Type III',
        component_class2: 'RENZYME00053',
        accession_number: 'REBASE',
        source: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '135',
        end: '138',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II, Type III',
        component_class2: 'RENZYME00053',
        accession_number: 'REBASE',
        source: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '141',
        end: '144',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II, Type III',
        component_class2: 'RENZYME00053',
        accession_number: 'REBASE',
        source: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '79',
        end: '88',
        length: '10',
        sequence: 'CACGACGGUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00054',
        accession_number: 'REBASE',
        source: 'Found [MslI, RseI, SmiMI] recognization site on seq: CACGACGGUG)',
        description: '',
    },
    {
        start: '129',
        end: '138',
        length: '10',
        sequence: 'CACUGCCAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00054',
        accession_number: 'REBASE',
        source: 'Found [MslI, RseI, SmiMI] recognization site on seq: CACUGCCAUG)',
        description: '',
    },
    {
        start: '146',
        end: '150',
        length: '5',
        sequence: 'CCAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00059',
        accession_number: 'REBASE',
        source: 'Found [BccI] recognization site on seq: CCAUC)',
        description: '',
    },
    {
        start: '218',
        end: '222',
        length: '5',
        sequence: 'CCAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00059',
        accession_number: 'REBASE',
        source: 'Found [BccI] recognization site on seq: CCAUC)',
        description: '',
    },
    {
        start: '97',
        end: '107',
        length: '11',
        sequence: 'CCCUGGAUUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00067',
        accession_number: 'REBASE',
        source: 'Found [AfiI, Bsc4I, BseLI, BsiYI, BslI] recognization site on seq: CCCUGGAUUGG)',
        description: '',
    },
    {
        start: '119',
        end: '123',
        length: '5',
        sequence: 'CCUUC',
        component_type: 'restriction_sites',
        component_class1: 'Type V',
        component_class2: 'RENZYME00073',
        accession_number: 'REBASE',
        source: 'Found [HpyAV] recognization site on seq: CCUUC)',
        description: '',
    },
    {
        start: '170',
        end: '174',
        length: '5',
        sequence: 'CCUUC',
        component_type: 'restriction_sites',
        component_class1: 'Type V',
        component_class2: 'RENZYME00073',
        accession_number: 'REBASE',
        source: 'Found [HpyAV] recognization site on seq: CCUUC)',
        description: '',
    },
    {
        start: '14',
        end: '18',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00075',
        accession_number: 'REBASE',
        source: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '98',
        end: '102',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00075',
        accession_number: 'REBASE',
        source: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '123',
        end: '127',
        length: '5',
        sequence: 'CCGGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00075',
        accession_number: 'REBASE',
        source: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCGGG)',
        description: '',
    },
    {
        start: '191',
        end: '195',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00075',
        accession_number: 'REBASE',
        source: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '210',
        end: '214',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00075',
        accession_number: 'REBASE',
        source: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '123',
        end: '127',
        length: '5',
        sequence: 'CCGGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00076',
        accession_number: 'REBASE',
        source: 'Found [AsuC2I, BcnI, BpuMI, NciI] recognization site on seq: CCGGG)',
        description: '',
    },
    {
        start: '14',
        end: '18',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00079',
        accession_number: 'REBASE',
        source: 'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '98',
        end: '102',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00079',
        accession_number: 'REBASE',
        source: 'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '191',
        end: '195',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00079',
        accession_number: 'REBASE',
        source: 'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '210',
        end: '214',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00079',
        accession_number: 'REBASE',
        source: 'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '81',
        end: '85',
        length: '5',
        sequence: 'CGACG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00083',
        accession_number: 'REBASE',
        source: 'Found [Hpy99I] recognization site on seq: CGACG)',
        description: '',
    },
    {
        start: '8',
        end: '11',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type II',
        component_class2: 'RENZYME00100',
        accession_number: 'REBASE',
        source: 'Found [CviAII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '22',
        end: '25',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type II',
        component_class2: 'RENZYME00100',
        accession_number: 'REBASE',
        source: 'Found [CviAII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '135',
        end: '138',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type II',
        component_class2: 'RENZYME00100',
        accession_number: 'REBASE',
        source: 'Found [CviAII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '141',
        end: '144',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type II',
        component_class2: 'RENZYME00100',
        accession_number: 'REBASE',
        source: 'Found [CviAII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '123',
        end: '126',
        length: '4',
        sequence: 'CCGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00103',
        accession_number: 'REBASE',
        source: 'Found [BsiSI, HapII, HpaII, MspI] recognization site on seq: CCGG)',
        description: '',
    },
    {
        start: '97',
        end: '102',
        length: '6',
        sequence: 'CCCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00104',
        accession_number: 'REBASE',
        source: 'Found [BsaJI, BseDI, BssECI] recognization site on seq: CCCUGG)',
        description: '',
    },
    {
        start: '210',
        end: '215',
        length: '6',
        sequence: 'CCUGGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00104',
        accession_number: 'REBASE',
        source: 'Found [BsaJI, BseDI, BssECI] recognization site on seq: CCUGGG)',
        description: '',
    },
    {
        start: '11',
        end: '14',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00136',
        accession_number: 'REBASE',
        source: 'Found [BstKTI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '36',
        end: '39',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00136',
        accession_number: 'REBASE',
        source: 'Found [BstKTI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '180',
        end: '183',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00136',
        accession_number: 'REBASE',
        source: 'Found [BstKTI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '11',
        end: '14',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00137',
        accession_number: 'REBASE',
        source: 'Found [DpnI, MalI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '36',
        end: '39',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00137',
        accession_number: 'REBASE',
        source: 'Found [DpnI, MalI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '180',
        end: '183',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00137',
        accession_number: 'REBASE',
        source: 'Found [DpnI, MalI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '107',
        end: '111',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00139',
        accession_number: 'REBASE',
        source: 'Found [BbvI, BseXI, BstV1I, Lsp1109I] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '152',
        end: '156',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00139',
        accession_number: 'REBASE',
        source: 'Found [BbvI, BseXI, BstV1I, Lsp1109I] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '215',
        end: '225',
        length: '11',
        sequence: 'GCCCCAUCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00150',
        accession_number: 'REBASE',
        source: 'Found [BstMWI, HpyF10VI, MwoI] recognization site on seq: GCCCCAUCAGC)',
        description: '',
    },
    {
        start: '44',
        end: '48',
        length: '5',
        sequence: 'GCUGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00151',
        accession_number: 'REBASE',
        source: 'Found [BlsI] recognization site on seq: GCUGC)',
        description: '',
    },
    {
        start: '107',
        end: '111',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00151',
        accession_number: 'REBASE',
        source: 'Found [BlsI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '152',
        end: '156',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00151',
        accession_number: 'REBASE',
        source: 'Found [BlsI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '69',
        end: '74',
        length: '6',
        sequence: 'GCGUGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00152',
        accession_number: 'REBASE',
        source: 'Found [BstC8I, Cac8I] recognization site on seq: GCGUGC)',
        description: '',
    },
    {
        start: '44',
        end: '48',
        length: '5',
        sequence: 'GCUGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00158',
        accession_number: 'REBASE',
        source: 'Found [BisI, Fnu4HI, Fsp4HI, GluI, ItaI, SatI] recognization site on seq: GCUGC)',
        description: '',
    },
    {
        start: '107',
        end: '111',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00158',
        accession_number: 'REBASE',
        source: 'Found [BisI, Fnu4HI, Fsp4HI, GluI, ItaI, SatI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '152',
        end: '156',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00158',
        accession_number: 'REBASE',
        source: 'Found [BisI, Fnu4HI, Fsp4HI, GluI, ItaI, SatI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00160',
        accession_number: 'REBASE',
        source: 'Found [Bsp1286I, MhlI, SduI] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '35',
        end: '39',
        length: '5',
        sequence: 'GGAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00161',
        accession_number: 'REBASE',
        source: 'Found [AclWI, AlwI, BspPI] recognization site on seq: GGAUC)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00170',
        accession_number: 'REBASE',
        source: 'Found [ApaI] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type IV',
        component_class2: 'RENZYME00171',
        accession_number: 'REBASE',
        source: 'Found [BmiI, BspLI, NlaIV, PspN4I] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '17',
        end: '21',
        length: '5',
        sequence: 'GGUGA',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00174',
        accession_number: 'REBASE',
        source: 'Found [AsuHPI, HphI] recognization site on seq: GGUGA)',
        description: '',
    },
    {
        start: '85',
        end: '89',
        length: '5',
        sequence: 'GGUGA',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00174',
        accession_number: 'REBASE',
        source: 'Found [AsuHPI, HphI] recognization site on seq: GGUGA)',
        description: '',
    },
    {
        start: '164',
        end: '167',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type III',
        component_class2: 'RENZYME00175',
        accession_number: 'REBASE',
        source: 'Found [BshFI, BsnI, BsuRI, HaeIII, PhoI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '204',
        end: '207',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type III',
        component_class2: 'RENZYME00175',
        accession_number: 'REBASE',
        source: 'Found [BshFI, BsnI, BsuRI, HaeIII, PhoI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '214',
        end: '217',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type III',
        component_class2: 'RENZYME00175',
        accession_number: 'REBASE',
        source: 'Found [BshFI, BsnI, BsuRI, HaeIII, PhoI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00179',
        accession_number: 'REBASE',
        source: 'Found [BaeGI, Bme1580I, BseSI, BstSLI] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00180',
        accession_number: 'REBASE',
        source: 'Found [BanII, Eco24I, EcoT38I, FriOI] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '44',
        end: '48',
        length: '5',
        sequence: 'GCUGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00200',
        accession_number: 'REBASE',
        source: 'Found [ApeKI, TseI] recognization site on seq: GCUGC)',
        description: '',
    },
    {
        start: '107',
        end: '111',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00200',
        accession_number: 'REBASE',
        source: 'Found [ApeKI, TseI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '152',
        end: '156',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00200',
        accession_number: 'REBASE',
        source: 'Found [ApeKI, TseI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00203',
        accession_number: 'REBASE',
        source: 'Found [Bsp120I, PspOMI] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '164',
        end: '168',
        length: '5',
        sequence: 'GGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00204',
        accession_number: 'REBASE',
        source: 'Found [AspS9I, BmgT120I, Cfr13I, PspPI, Sau96I] recognization site on seq: GGCCC)',
        description: '',
    },
    {
        start: '213',
        end: '217',
        length: '5',
        sequence: 'GGGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00204',
        accession_number: 'REBASE',
        source: 'Found [AspS9I, BmgT120I, Cfr13I, PspPI, Sau96I] recognization site on seq: GGGCC)',
        description: '',
    },
    {
        start: '21',
        end: '26',
        length: '6',
        sequence: 'ACAUGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00212',
        accession_number: 'REBASE',
        source: 'Found [BstNSI, NspI, XceI] recognization site on seq: ACAUGU)',
        description: '',
    },
    {
        start: '30',
        end: '33',
        length: '4',
        sequence: 'AGCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: AGCU)',
        description: '',
    },
    {
        start: '109',
        end: '112',
        length: '4',
        sequence: 'AGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: AGCC)',
        description: '',
    },
    {
        start: '164',
        end: '167',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '204',
        end: '207',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '214',
        end: '217',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '223',
        end: '226',
        length: '4',
        sequence: 'AGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: AGCC)',
        description: '',
    },
    {
        start: '213',
        end: '219',
        length: '7',
        sequence: 'GGGCCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00215',
        accession_number: 'REBASE',
        source: 'Found [DraII, EcoO109I] recognization site on seq: GGGCCCC)',
        description: '',
    },
    {
        start: '179',
        end: '184',
        length: '6',
        sequence: 'AGAUCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00220',
        accession_number: 'REBASE',
        source: 'Found [BstX2I, BstYI, MflI, PsuI, XhoII] recognization site on seq: AGAUCU)',
        description: '',
    },
    {
        start: '38',
        end: '42',
        length: '5',
        sequence: 'UCAGA',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00225',
        accession_number: 'REBASE',
        source: 'Found [Hpy188I] recognization site on seq: UCAGA)',
        description: '',
    },
    {
        start: '176',
        end: '181',
        length: '6',
        sequence: 'UCGAGA',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00226',
        accession_number: 'REBASE',
        source: 'Found [Hpy188III] recognization site on seq: UCGAGA)',
        description: '',
    },
    {
        start: '185',
        end: '190',
        length: '6',
        sequence: 'UCAAGA',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00226',
        accession_number: 'REBASE',
        source: 'Found [Hpy188III] recognization site on seq: UCAAGA)',
        description: '',
    },
    {
        start: '46',
        end: '49',
        length: '4',
        sequence: 'UGCA',
        component_type: 'restriction_sites',
        component_class1: 'Type V',
        component_class2: 'RENZYME00229',
        accession_number: 'REBASE',
        source: 'Found [HpyCH4V] recognization site on seq: UGCA)',
        description: '',
    },
    {
        start: '196',
        end: '199',
        length: '4',
        sequence: 'UGCA',
        component_type: 'restriction_sites',
        component_class1: 'Type V',
        component_class2: 'RENZYME00229',
        accession_number: 'REBASE',
        source: 'Found [HpyCH4V] recognization site on seq: UGCA)',
        description: '',
    },
    {
        start: '58',
        end: '61',
        length: '4',
        sequence: 'UCGA',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00237',
        accession_number: 'REBASE',
        source: 'Found [TaqI] recognization site on seq: UCGA)',
        description: '',
    },
    {
        start: '176',
        end: '179',
        length: '4',
        sequence: 'UCGA',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00237',
        accession_number: 'REBASE',
        source: 'Found [TaqI] recognization site on seq: UCGA)',
        description: '',
    },
    {
        start: '8',
        end: '11',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00246',
        accession_number: 'REBASE',
        source: 'Found [FaiI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '22',
        end: '25',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00246',
        accession_number: 'REBASE',
        source: 'Found [FaiI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '135',
        end: '138',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00246',
        accession_number: 'REBASE',
        source: 'Found [FaiI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '141',
        end: '144',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00246',
        accession_number: 'REBASE',
        source: 'Found [FaiI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '234',
        end: '237',
        length: '4',
        sequence: 'AAUU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00248',
        accession_number: 'REBASE',
        source: 'Found [MluCI, Sse9I, TasI, Tsp509I, TspEI] recognization site on seq: AAUU)',
        description: '',
    },
    {
        start: '8',
        end: '11',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00249',
        accession_number: 'REBASE',
        source: 'Found [FatI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '22',
        end: '25',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00249',
        accession_number: 'REBASE',
        source: 'Found [FatI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '135',
        end: '138',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00249',
        accession_number: 'REBASE',
        source: 'Found [FatI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '141',
        end: '144',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00249',
        accession_number: 'REBASE',
        source: 'Found [FatI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '14',
        end: '18',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00250',
        accession_number: 'REBASE',
        source: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '98',
        end: '102',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00250',
        accession_number: 'REBASE',
        source: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '123',
        end: '127',
        length: '5',
        sequence: 'CCGGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00250',
        accession_number: 'REBASE',
        source: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCGGG)',
        description: '',
    },
    {
        start: '191',
        end: '195',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00250',
        accession_number: 'REBASE',
        source: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '210',
        end: '214',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00250',
        accession_number: 'REBASE',
        source: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '14',
        end: '18',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00251',
        accession_number: 'REBASE',
        source: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '98',
        end: '102',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00251',
        accession_number: 'REBASE',
        source: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '191',
        end: '195',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00251',
        accession_number: 'REBASE',
        source: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '210',
        end: '214',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00251',
        accession_number: 'REBASE',
        source: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '11',
        end: '14',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00252',
        accession_number: 'REBASE',
        source: 'Found [BfuCI, Bsp143I, BssMI, BstMBI, DpnII, Kzo9I, MboI, NdeII, Sau3AI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '36',
        end: '39',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00252',
        accession_number: 'REBASE',
        source: 'Found [BfuCI, Bsp143I, BssMI, BstMBI, DpnII, Kzo9I, MboI, NdeII, Sau3AI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '180',
        end: '183',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00252',
        accession_number: 'REBASE',
        source: 'Found [BfuCI, Bsp143I, BssMI, BstMBI, DpnII, Kzo9I, MboI, NdeII, Sau3AI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '18',
        end: '22',
        length: '5',
        sequence: 'GUGAC',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00253',
        accession_number: 'REBASE',
        source: 'Found [MaeIII] recognization site on seq: GUGAC)',
        description: '',
    },
    {
        start: '86',
        end: '90',
        length: '5',
        sequence: 'GUGAC',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00253',
        accession_number: 'REBASE',
        source: 'Found [MaeIII] recognization site on seq: GUGAC)',
        description: '',
    },
    {
        start: '127',
        end: '131',
        length: '5',
        sequence: 'GUCAC',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00253',
        accession_number: 'REBASE',
        source: 'Found [MaeIII] recognization site on seq: GUCAC)',
        description: '',
    },
    {
        start: '18',
        end: '22',
        length: '5',
        sequence: 'GUGAC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00254',
        accession_number: 'REBASE',
        source: 'Found [NmuCI, Tsp45I] recognization site on seq: GUGAC)',
        description: '',
    },
    {
        start: '86',
        end: '90',
        length: '5',
        sequence: 'GUGAC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00254',
        accession_number: 'REBASE',
        source: 'Found [NmuCI, Tsp45I] recognization site on seq: GUGAC)',
        description: '',
    },
    {
        start: '127',
        end: '131',
        length: '5',
        sequence: 'GUCAC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00254',
        accession_number: 'REBASE',
        source: 'Found [NmuCI, Tsp45I] recognization site on seq: GUCAC)',
        description: '',
    },
    {
        start: '10',
        end: '19',
        length: '10',
        sequence: 'UGAUCCAGGU',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s0-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s0-side1',
        description: '',
    },
    {
        start: '10',
        end: '19',
        length: '10',
        sequence: 'UGAUCCAGGU',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s0-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s0-side2',
        description: '',
    },
    {
        start: '31',
        end: '40',
        length: '10',
        sequence: 'GCUUGGAUCA',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s0-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s0-side1',
        description: '',
    },
    {
        start: '31',
        end: '40',
        length: '10',
        sequence: 'GCUUGGAUCA',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s0-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s0-side2',
        description: '',
    },
    {
        start: '41',
        end: '45',
        length: '5',
        sequence: 'GAUGC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s1-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s1-side1',
        description: '',
    },
    {
        start: '41',
        end: '45',
        length: '5',
        sequence: 'GAUGC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s1-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s1-side2',
        description: '',
    },
    {
        start: '54',
        end: '58',
        length: '5',
        sequence: 'GCGUU',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s1-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s1-side1',
        description: '',
    },
    {
        start: '54',
        end: '58',
        length: '5',
        sequence: 'GCGUU',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s1-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s1-side2',
        description: '',
    },
    {
        start: '65',
        end: '73',
        length: '9',
        sequence: 'GGGAGCGUG',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s3-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s3-side1',
        description: '',
    },
    {
        start: '65',
        end: '73',
        length: '9',
        sequence: 'GGGAGCGUG',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s3-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s3-side2',
        description: '',
    },
    {
        start: '90',
        end: '98',
        length: '9',
        sequence: 'CACGCUUCC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s3-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s3-side1',
        description: '',
    },
    {
        start: '90',
        end: '98',
        length: '9',
        sequence: 'CACGCUUCC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s3-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s3-side2',
        description: '',
    },
    {
        start: '106',
        end: '110',
        length: '5',
        sequence: 'GGCAG',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s7-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s7-side1',
        description: '',
    },
    {
        start: '106',
        end: '110',
        length: '5',
        sequence: 'GGCAG',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s7-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s7-side2',
        description: '',
    },
    {
        start: '116',
        end: '120',
        length: '5',
        sequence: 'CUGCC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s7-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s7-side1',
        description: '',
    },
    {
        start: '116',
        end: '120',
        length: '5',
        sequence: 'CUGCC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s7-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s7-side2',
        description: '',
    },
    {
        start: '125',
        end: '129',
        length: '5',
        sequence: 'GGGUC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s8-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s8-side1',
        description: '',
    },
    {
        start: '125',
        end: '129',
        length: '5',
        sequence: 'GGGUC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s8-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s8-side2',
        description: '',
    },
    {
        start: '164',
        end: '168',
        length: '5',
        sequence: 'GGCCC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s8-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s8-side1',
        description: '',
    },
    {
        start: '164',
        end: '168',
        length: '5',
        sequence: 'GGCCC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s8-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s8-side2',
        description: '',
    },
    {
        start: '179',
        end: '183',
        length: '5',
        sequence: 'AGAUC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s13-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s13-side1',
        description: '',
    },
    {
        start: '179',
        end: '183',
        length: '5',
        sequence: 'AGAUC',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s13-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s13-side2',
        description: '',
    },
    {
        start: '238',
        end: '242',
        length: '5',
        sequence: 'GAUUU',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s13-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s13-side1',
        description: '',
    },
    {
        start: '238',
        end: '242',
        length: '5',
        sequence: 'GAUUU',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s13-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s13-side2',
        description: '',
    },
    {
        start: '192',
        end: '196',
        length: '5',
        sequence: 'CAGGU',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s15-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s15-side1',
        description: '',
    },
    {
        start: '192',
        end: '196',
        length: '5',
        sequence: 'CAGGU',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s15-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s15-side2',
        description: '',
    },
    {
        start: '224',
        end: '228',
        length: '5',
        sequence: 'GCCUG',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s15-side1',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s15-side1',
        description: '',
    },
    {
        start: '224',
        end: '228',
        length: '5',
        sequence: 'GCCUG',
        component_type: 'stem-loop_structure',
        component_class1: 'stem',
        component_class2: 'RSLS_s15-side2',
        accession_number: 'ViennaRNA',
        source: 'Found stem structure region: s15-side2',
        description: '',
    },
    {
        start: '188',
        end: '191',
        length: '7',
        sequence: 'AGAC',
        component_type: 'stem-loop_structure',
        component_class1: 'interior loop',
        component_class2: 'RSLS_i7',
        accession_number: 'ViennaRNA',
        source: 'Found interior loop structure region: i7',
        description: '',
    },
    {
        start: '229',
        end: '231',
        length: '7',
        sequence: 'AAC',
        component_type: 'stem-loop_structure',
        component_class1: 'interior loop',
        component_class2: 'RSLS_i7',
        accession_number: 'ViennaRNA',
        source: 'Found interior loop structure region: i7',
        description: '',
    },
    {
        start: '197',
        end: '203',
        length: '13',
        sequence: 'GCAACAA',
        component_type: 'stem-loop_structure',
        component_class1: 'interior loop',
        component_class2: 'RSLS_i8',
        accession_number: 'ViennaRNA',
        source: 'Found interior loop structure region: i8',
        description: '',
    },
    {
        start: '218',
        end: '223',
        length: '13',
        sequence: 'CCAUCA',
        component_type: 'stem-loop_structure',
        component_class1: 'interior loop',
        component_class2: 'RSLS_i8',
        accession_number: 'ViennaRNA',
        source: 'Found interior loop structure region: i8',
        description: '',
    },
    {
        start: '169',
        end: '175',
        length: '7',
        sequence: 'ACCUUCU',
        component_type: 'stem-loop_structure',
        component_class1: 'multiloop segment',
        component_class2: 'RSLS_m5',
        accession_number: 'ViennaRNA',
        source: 'Found multiloop segment structure region: m5',
        description: '',
    },
    {
        start: '20',
        end: '30',
        length: '11',
        sequence: 'GACAUGUAGAA',
        component_type: 'stem-loop_structure',
        component_class1: 'hairpin loop',
        component_class2: 'RSLS_h0',
        accession_number: 'ViennaRNA',
        source: 'Found hairpin loop structure region: h0',
        description: '',
    },
    {
        start: '46',
        end: '53',
        length: '8',
        sequence: 'UGCACUUU',
        component_type: 'stem-loop_structure',
        component_class1: 'hairpin loop',
        component_class2: 'RSLS_h1',
        accession_number: 'ViennaRNA',
        source: 'Found hairpin loop structure region: h1',
        description: '',
    },
    {
        start: '80',
        end: '84',
        length: '5',
        sequence: 'ACGAC',
        component_type: 'stem-loop_structure',
        component_class1: 'hairpin loop',
        component_class2: 'RSLS_h2',
        accession_number: 'ViennaRNA',
        source: 'Found hairpin loop structure region: h2',
        description: '',
    },
    {
        start: '111',
        end: '115',
        length: '5',
        sequence: 'CCAGA',
        component_type: 'stem-loop_structure',
        component_class1: 'hairpin loop',
        component_class2: 'RSLS_h3',
        accession_number: 'ViennaRNA',
        source: 'Found hairpin loop structure region: h3',
        description: '',
    },
    {
        start: '208',
        end: '213',
        length: '6',
        sequence: 'GACCUG',
        component_type: 'stem-loop_structure',
        component_class1: 'hairpin loop',
        component_class2: 'RSLS_h5',
        accession_number: 'ViennaRNA',
        source: 'Found hairpin loop structure region: h5',
        description: '',
    },
    {
        start: '170',
        end: '186',
        length: '17',
        sequence: 'CCUUCUUCGAGAUCUUC',
        component_type: 'IRES',
        component_class1: '0.27',
        component_class2: 'hsa_ires_00452.1',
        accession_number: 'IRESbase',
        source: 'Found a sequence region with high homology to IRES:hsa_ires_00452.1, with an e-value of 0.27',
        description: '',
    },
]
const chooseColor = (d: unknown) => {
    let color = ''
    switch (d) {
        case "5' UTR":
            color = '#45bf43'
            break
        case 'CDS':
            color = '#5490F8'
            break
        case "3' UTR":
            color = '#29cbce'
            break
        /* case 'Type I':
            color = '#DF3AD2'
            break
        case 'Type II':
            color = '#9dc6e7'
            break
        case 'Type III':
            color = '#0FF0BF'
            break
        case 'Type IV':
            color = '#9343f0'
            break
        case 'Type V':
            color = '#ec364e'
            break
        case 'N-terminal extension':
            color = '#90ed7d'
            break */
        default:
            color = '#445d8f'
            break
    }
    // additional cases for other indices if needed
    return color
}
const annotationData = ref(null)

/* const getsequencemarker = async id => {
    // loading.value = true

    const response = await axios.get('/task/result/sequencemarker/', {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: id,
            mrnaid: id,
        },
    })
    const { data: sequencemarker } = response
    console.log(sequencemarker)
    annotationData.value = sequencemarker
}

const id = 1
getsequencemarker(id)
*/
watch(annotationData, () => {
    const start = 0
    // console.log(annotationData)
    // const end = annotationData.value.sequence.length
    const longestEndObject = exampleData.reduce((acc, obj) => {
        if (parseInt(obj.end, 10) > parseInt(acc.end, 10)) {
            return obj
        }
        return acc
    })
    const { end } = longestEndObject
    const splitAnnotationData = _.groupBy(exampleData, 'component_type')
    // const splitAnnotationData = _.groupBy(annotationData.value.result, 'component_type')
    console.log(splitAnnotationData)
    // const rectHeight = lineHeight.value + 65
    // const labelOffsetX = 10

    height.value = lineHeight.value + 250
    const svg = d3
        .select('#sequenceAnnotation')
        .attr('transform', `translate(${marginLeft.value}, 0)`)

    // const gcY = d3.scaleLinear().domain([20, 80]).range([40, 0])
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', barareaMarginLeft.value)
        .attr('height', height.value)
        .attr('fill', 'white')

    const g = svg.append('g')

    const bararea = g
        .append('svg')
        .attr('height', height.value)
        .attr('width', 1000)
        .attr('x', barareaMarginLeft.value)
        .attr('y', 0)

    const scaleX = d3.scaleLinear().domain([start, end]).range([0, 1000])
    const xAxis = d3
        .axisBottom(scaleX)
        .ticks(10)
        .tickFormat(function (t) {
            return t === 0 ? 0 : `${t}`
        })

    svg.append('g')
        .attr('transform', `translate(${barareaMarginLeft.value}, ${lineHeight.value + 100})`)
        .attr('class', 'x-axis')
        .attr('color', '#818181')
        .call(xAxis)

    const mainRegionsData = splitAnnotationData.main_regions
    // const miRNAData = splitAnnotationData.miRNAs_targets
    // const uORFData = splitAnnotationData.uORF
    // const iresData = splitAnnotationData.IRES
    // const loopstructureData = splitAnnotationData['stem-loop_structure']
    // const secondaryStructureData = splitAnnotationData.secondary_structure
    const restrictionSitesData = splitAnnotationData.restriction_sites
    const groupedData = [
        mainRegionsData,
        // miRNAData,
        // uORFData,
        // iresData,
        // secondaryStructureData,
        restrictionSitesData,
        // loopstructureData,
    ]
    const TypeLabel = [
        'mainRegionsData',
        // miRNAData,
        // 'uORFData',
        // 'iresData',
        // secondaryStructureData,
        'restrictionSitesData',
        // 'loopstructureData',
    ]
    const toolarea = svg.append('svg').attr('height', 100).attr('width', 260).style('opacity', 0)
    toolarea
        .append('rect')
        .attr('x', 0)
        .attr('width', 260)
        .attr('height', 70)
        .style('fill', 'black')
        .style('opacity', 0.6)
    const toolText1 = toolarea
        .append('text')
        .style('fill', 'white')
        .attr('transform', `translate(10,20)`)
        .style('font-size', 12)
    const toolText2 = toolarea
        .append('text')
        .style('fill', 'white')
        .attr('transform', `translate(10,40)`)
        .style('font-size', 12)
    const toolText3 = toolarea
        .append('text')
        .style('fill', 'white')
        .attr('transform', `translate(10,60)`)
        .style('font-size', 12)

    // Arrow Bar
    const mouseenter = function (md, mv) {
        bararea.selectAll('.geneline').style('opacity', 0.3)
        d3.select(this).style('opacity', 1)
        toolarea
            .style('opacity', 1)
            .attr('x', md.layerX - 30)
            .attr('y', md.layerY - 30)
        toolText1.text(function () {
            return `component_type : ${mv.component_type}`
        })
        toolText2.text(function () {
            return `component_class1 : ${mv.component_class1}`
        })
        toolText3.text(function () {
            return `location : ${Number(mv.start)}-${Number(mv.end)}`
        })
    }
    const mouseleave = function () {
        bararea.selectAll('.geneline').style('opacity', 1)
        toolarea.style('opacity', 0).attr('x', 0).attr('y', 0)
    }
    const click = function (md, mv) {
        // console.log(mv)
        // bararea.selectAll('.geneline').style('stroke', '#818181').attr('stroke-width', '1px')
        isShowSelect.value = false
        selectData.value = mv
        console.log(selectData.value)
        console.log(selectData.value.start)
        d3.select(this).style('stroke', '#818181').attr('stroke-width', '2px').value = mv
    }
    // console.log(groupedData)
    for (let j = 0; j < 2; j += 1) {
        svg.append('text')
            .attr('x', 0)
            .attr('y', lineHeight.value + 84 - 52 * j)
            .text(TypeLabel[j])
            .style('font-size', '10px')
            .style('fill', 'black')
        bararea
            .selectAll('geneline')
            .data(groupedData[j])
            .enter()
            .append('path')
            .attr('class', 'geneline')
            .attr('d', function (i) {
                const startX = d3.scaleLinear().domain([start, end]).range([0, 1000])(
                    Number(i.start)
                )
                const endX = d3.scaleLinear().domain([start, end]).range([0, 1000])(Number(i.end))
                return Rectangle(startX, endX, lineHeight.value + 65)
            })
            .attr('fill', function (i) {
                return chooseColor(i.component_class1)
            })
            .attr('transform', `translate(0, ${lineHeight.value - 180 - 50 * j})`)
            .on('mouseenter ', mouseenter)
            .on('mouseleave', mouseleave)
            .on('click', click)
    }
    loadchart.value = false
})
</script>
