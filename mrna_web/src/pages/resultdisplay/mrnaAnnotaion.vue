<template>
    <div class="flex flex-row bg-gray-50 w-310 h-28">
        <div class="w-120 h-28"></div>
        <div class="text-3xl font-800 ml-7 mt-10"></div>

        <el-button class="mt-15 ml-80" type="primary" @click="downloadsvg">
            <el-icon class="text-base mr-1 mb-0.5"><Document /></el-icon>
            Download SVG Chart
        </el-button>
        <el-button class="mt-15 ml-3" type="primary" @click="downloadSVGAsPNG">
            <el-icon class="text-base mr-1 mb-0.5"><Document /></el-icon>
            Download PNG Chart
        </el-button>
    </div>
    <el-scrollbar class="h-165 flex flex-row items-center" v-loading="loadchart">
        <el-button class="mt-5 ml-3 absolute z-10 ml-290" type="primary" v-if="false">
            <el-icon class="text-xl"><Operation /></el-icon>
        </el-button>

        <svg id="mrnaAnnotation" :height="height" :width="width"></svg>
    </el-scrollbar>
    <div class="w-310 h-30 bg-gray-200 flex justify-center">
        <svg id="Legend_area" height="120" width="1140"></svg>
    </div>
</template>
<script setup lang="ts">
// @ts-nocheck
// import { CloudDownload as down, InformationCircle as info } from '@vicons/ionicons5'
import { Document, Operation } from '@element-plus/icons-vue'
import * as d3 from 'd3'
import _ from 'lodash'
// import { TypeDict, proteinType, countGC } from '@/utils/annotation'
// import { usePhageStore } from '@/store/phage'
// import { usemrnaStore } from '@/store/mrna'

const annotationData = {
    result: [
        {
            start: 1,
            end: 135,
            length: 135,
            sequence:
                'CUAAUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCC',
            component_type: 'main_regions',
            component_class1: "5' UTR",
            component_class2: null,
            accession_number: null,
            source: '-',
            description: "the 5' untranslated region",
        },
        {
            start: 136,
            end: 234,
            length: 99,
            sequence:
                'AUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
            component_type: 'main_regions',
            component_class1: 'CDS',
            component_class2: null,
            accession_number: null,
            source: '-',
            description: 'the coding region of mRNA',
        },
        {
            start: 235,
            end: 243,
            length: 9,
            sequence: 'AUUGAUUUU',
            component_type: 'main_regions',
            component_class1: "3' UTR",
            component_class2: null,
            accession_number: null,
            source: '-',
            description: "the 3' untranslated region",
        },
        {
            start: 4,
            end: 231,
            length: 231,
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
            start: 9,
            end: 86,
            length: 81,
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
            start: 23,
            end: 25,
            length: 6,
            sequence: 'AUGUAG',
            component_type: 'uORF',
            component_class1: 'non-overlapping',
            component_class2: 'adequate',
            accession_number: 'SEQ000000_uORF0002',
            source: 'uORF_finder',
            description: 'ORF type: non-overlapping, with adequate uKozak strength',
        },
        {
            start: 42,
            end: 86,
            length: 48,
            sequence: 'AUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGA',
            component_type: 'uORF',
            component_class1: 'non-overlapping',
            component_class2: 'weak',
            accession_number: 'SEQ000000_uORF0003',
            source: 'uORF_finder',
            description: 'ORF type: non-overlapping, with weak uKozak strength',
        },
        {
            start: 61,
            end: 231,
            length: 174,
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
            start: 136,
            end: 231,
            length: 99,
            sequence:
                'AUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
            component_type: 'uORF',
            component_class1: null,
            component_class2: 'adequate',
            accession_number: 'SEQ000000_uORF0005',
            source: 'uORF_finder',
            description: 'ORF type: NA, with adequate uKozak strength',
        },
        {
            start: 142,
            end: 231,
            length: 93,
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
            start: 83,
            end: 87,
            length: 5,
            sequence: 'ACGGU',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type III',
            component_class2: null,
            accession_number: 'RENZYME00021',
            source: 'REBASE',
            description: 'Found [Bst4CI, HpyCH4III, TaaI] recognization site on seq: ACGGU)',
        },
        {
            start: 30,
            end: 33,
            length: 4,
            sequence: 'AGCU',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00027',
            source: 'REBASE',
            description: 'Found [AluI, AluBI] recognization site on seq: AGCU)',
        },
        {
            start: 16,
            end: 19,
            length: 4,
            sequence: 'AGGU',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00028',
            source: 'REBASE',
            description: 'Found [SetI] recognization site on seq: AGGU)',
        },
        {
            start: 30,
            end: 33,
            length: 4,
            sequence: 'AGCU',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00028',
            source: 'REBASE',
            description: 'Found [SetI] recognization site on seq: AGCU)',
        },
        {
            start: 169,
            end: 172,
            length: 4,
            sequence: 'ACCU',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00028',
            source: 'REBASE',
            description: 'Found [SetI] recognization site on seq: ACCU)',
        },
        {
            start: 193,
            end: 196,
            length: 4,
            sequence: 'AGGU',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00028',
            source: 'REBASE',
            description: 'Found [SetI] recognization site on seq: AGGU)',
        },
        {
            start: 209,
            end: 212,
            length: 4,
            sequence: 'ACCU',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00028',
            source: 'REBASE',
            description: 'Found [SetI] recognization site on seq: ACCU)',
        },
        {
            start: 29,
            end: 34,
            length: 6,
            sequence: 'AAGCUU',
            component_type: 'restriction_sites',
            component_class1: 'Type III',
            component_class2: null,
            accession_number: 'RENZYME00034',
            source: 'REBASE',
            description: 'Found [HindIII] recognization site on seq: AAGCUU)',
        },
        {
            start: 21,
            end: 26,
            length: 6,
            sequence: 'ACAUGU',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00035',
            source: 'REBASE',
            description: 'Found [BspLU11I, PciI, PscI] recognization site on seq: ACAUGU)',
        },
        {
            start: 190,
            end: 196,
            length: 7,
            sequence: 'ACCAGGU',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00037',
            source: 'REBASE',
            description: 'Found [CsiI, MabI, SexAI] recognization site on seq: ACCAGGU)',
        },
        {
            start: 21,
            end: 26,
            length: 6,
            sequence: 'ACAUGU',
            component_type: 'restriction_sites',
            component_class1: 'Type III',
            component_class2: null,
            accession_number: 'RENZYME00040',
            source: 'REBASE',
            description: 'Found [AflIII] recognization site on seq: ACAUGU)',
        },
        {
            start: 179,
            end: 184,
            length: 6,
            sequence: 'AGAUCU',
            component_type: 'restriction_sites',
            component_class1: 'Type II',
            component_class2: null,
            accession_number: 'RENZYME00042',
            source: 'REBASE',
            description: 'Found [BglII] recognization site on seq: AGAUCU)',
        },
        {
            start: 79,
            end: 88,
            length: 10,
            sequence: 'CACGACGGUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00047',
            source: 'REBASE',
            description: 'Found [AleI, OliI] recognization site on seq: CACGACGGUG)',
        },
        {
            start: 39,
            end: 47,
            length: 9,
            sequence: 'CAGAUGCUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00049',
            source: 'REBASE',
            description: 'Found [AlwNI, CaiI] recognization site on seq: CAGAUGCUG)',
        },
        {
            start: 129,
            end: 135,
            length: 7,
            sequence: 'CACUGCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00052',
            source: 'REBASE',
            description: 'Found [TscAI, TspRI] recognization site on seq: CACUGCC)',
        },
        {
            start: 8,
            end: 11,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II, Type III',
            component_class2: null,
            accession_number: 'RENZYME00053',
            source: 'REBASE',
            description: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        },
        {
            start: 22,
            end: 25,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II, Type III',
            component_class2: null,
            accession_number: 'RENZYME00053',
            source: 'REBASE',
            description: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        },
        {
            start: 135,
            end: 138,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II, Type III',
            component_class2: null,
            accession_number: 'RENZYME00053',
            source: 'REBASE',
            description: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        },
        {
            start: 141,
            end: 144,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II, Type III',
            component_class2: null,
            accession_number: 'RENZYME00053',
            source: 'REBASE',
            description: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        },
        {
            start: 79,
            end: 88,
            length: 10,
            sequence: 'CACGACGGUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00054',
            source: 'REBASE',
            description: 'Found [MslI, RseI, SmiMI] recognization site on seq: CACGACGGUG)',
        },
        {
            start: 129,
            end: 138,
            length: 10,
            sequence: 'CACUGCCAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00054',
            source: 'REBASE',
            description: 'Found [MslI, RseI, SmiMI] recognization site on seq: CACUGCCAUG)',
        },
        {
            start: 146,
            end: 150,
            length: 5,
            sequence: 'CCAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00059',
            source: 'REBASE',
            description: 'Found [BccI] recognization site on seq: CCAUC)',
        },
        {
            start: 218,
            end: 222,
            length: 5,
            sequence: 'CCAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00059',
            source: 'REBASE',
            description: 'Found [BccI] recognization site on seq: CCAUC)',
        },
        {
            start: 97,
            end: 107,
            length: 11,
            sequence: 'CCCUGGAUUGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00067',
            source: 'REBASE',
            description:
                'Found [AfiI, Bsc4I, BseLI, BsiYI, BslI] recognization site on seq: CCCUGGAUUGG)',
        },
        {
            start: 119,
            end: 123,
            length: 5,
            sequence: 'CCUUC',
            component_type: 'restriction_sites',
            component_class1: 'Type V',
            component_class2: null,
            accession_number: 'RENZYME00073',
            source: 'REBASE',
            description: 'Found [HpyAV] recognization site on seq: CCUUC)',
        },
        {
            start: 170,
            end: 174,
            length: 5,
            sequence: 'CCUUC',
            component_type: 'restriction_sites',
            component_class1: 'Type V',
            component_class2: null,
            accession_number: 'RENZYME00073',
            source: 'REBASE',
            description: 'Found [HpyAV] recognization site on seq: CCUUC)',
        },
        {
            start: 14,
            end: 18,
            length: 5,
            sequence: 'CCAGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00075',
            source: 'REBASE',
            description: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCAGG)',
        },
        {
            start: 98,
            end: 102,
            length: 5,
            sequence: 'CCUGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00075',
            source: 'REBASE',
            description: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCUGG)',
        },
        {
            start: 123,
            end: 127,
            length: 5,
            sequence: 'CCGGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00075',
            source: 'REBASE',
            description: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCGGG)',
        },
        {
            start: 191,
            end: 195,
            length: 5,
            sequence: 'CCAGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00075',
            source: 'REBASE',
            description: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCAGG)',
        },
        {
            start: 210,
            end: 214,
            length: 5,
            sequence: 'CCUGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00075',
            source: 'REBASE',
            description: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCUGG)',
        },
        {
            start: 123,
            end: 127,
            length: 5,
            sequence: 'CCGGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00076',
            source: 'REBASE',
            description: 'Found [AsuC2I, BcnI, BpuMI, NciI] recognization site on seq: CCGGG)',
        },
        {
            start: 14,
            end: 18,
            length: 5,
            sequence: 'CCAGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00079',
            source: 'REBASE',
            description:
                'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCAGG)',
        },
        {
            start: 98,
            end: 102,
            length: 5,
            sequence: 'CCUGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00079',
            source: 'REBASE',
            description:
                'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCUGG)',
        },
        {
            start: 191,
            end: 195,
            length: 5,
            sequence: 'CCAGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00079',
            source: 'REBASE',
            description:
                'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCAGG)',
        },
        {
            start: 210,
            end: 214,
            length: 5,
            sequence: 'CCUGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00079',
            source: 'REBASE',
            description:
                'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCUGG)',
        },
        {
            start: 81,
            end: 85,
            length: 5,
            sequence: 'CGACG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00083',
            source: 'REBASE',
            description: 'Found [Hpy99I] recognization site on seq: CGACG)',
        },
        {
            start: 8,
            end: 11,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type II',
            component_class2: null,
            accession_number: 'RENZYME00100',
            source: 'REBASE',
            description: 'Found [CviAII] recognization site on seq: CAUG)',
        },
        {
            start: 22,
            end: 25,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type II',
            component_class2: null,
            accession_number: 'RENZYME00100',
            source: 'REBASE',
            description: 'Found [CviAII] recognization site on seq: CAUG)',
        },
        {
            start: 135,
            end: 138,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type II',
            component_class2: null,
            accession_number: 'RENZYME00100',
            source: 'REBASE',
            description: 'Found [CviAII] recognization site on seq: CAUG)',
        },
        {
            start: 141,
            end: 144,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type II',
            component_class2: null,
            accession_number: 'RENZYME00100',
            source: 'REBASE',
            description: 'Found [CviAII] recognization site on seq: CAUG)',
        },
        {
            start: 123,
            end: 126,
            length: 4,
            sequence: 'CCGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II',
            component_class2: null,
            accession_number: 'RENZYME00103',
            source: 'REBASE',
            description: 'Found [BsiSI, HapII, HpaII, MspI] recognization site on seq: CCGG)',
        },
        {
            start: 97,
            end: 102,
            length: 6,
            sequence: 'CCCUGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00104',
            source: 'REBASE',
            description: 'Found [BsaJI, BseDI, BssECI] recognization site on seq: CCCUGG)',
        },
        {
            start: 210,
            end: 215,
            length: 6,
            sequence: 'CCUGGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00104',
            source: 'REBASE',
            description: 'Found [BsaJI, BseDI, BssECI] recognization site on seq: CCUGGG)',
        },
        {
            start: 11,
            end: 14,
            length: 4,
            sequence: 'GAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00136',
            source: 'REBASE',
            description: 'Found [BstKTI] recognization site on seq: GAUC)',
        },
        {
            start: 36,
            end: 39,
            length: 4,
            sequence: 'GAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00136',
            source: 'REBASE',
            description: 'Found [BstKTI] recognization site on seq: GAUC)',
        },
        {
            start: 180,
            end: 183,
            length: 4,
            sequence: 'GAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00136',
            source: 'REBASE',
            description: 'Found [BstKTI] recognization site on seq: GAUC)',
        },
        {
            start: 11,
            end: 14,
            length: 4,
            sequence: 'GAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00137',
            source: 'REBASE',
            description: 'Found [DpnI, MalI] recognization site on seq: GAUC)',
        },
        {
            start: 36,
            end: 39,
            length: 4,
            sequence: 'GAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00137',
            source: 'REBASE',
            description: 'Found [DpnI, MalI] recognization site on seq: GAUC)',
        },
        {
            start: 180,
            end: 183,
            length: 4,
            sequence: 'GAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00137',
            source: 'REBASE',
            description: 'Found [DpnI, MalI] recognization site on seq: GAUC)',
        },
        {
            start: 107,
            end: 111,
            length: 5,
            sequence: 'GCAGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00139',
            source: 'REBASE',
            description: 'Found [BbvI, BseXI, BstV1I, Lsp1109I] recognization site on seq: GCAGC)',
        },
        {
            start: 152,
            end: 156,
            length: 5,
            sequence: 'GCAGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00139',
            source: 'REBASE',
            description: 'Found [BbvI, BseXI, BstV1I, Lsp1109I] recognization site on seq: GCAGC)',
        },
        {
            start: 215,
            end: 225,
            length: 11,
            sequence: 'GCCCCAUCAGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00150',
            source: 'REBASE',
            description: 'Found [BstMWI, HpyF10VI, MwoI] recognization site on seq: GCCCCAUCAGC)',
        },
        {
            start: 44,
            end: 48,
            length: 5,
            sequence: 'GCUGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00151',
            source: 'REBASE',
            description: 'Found [BlsI] recognization site on seq: GCUGC)',
        },
        {
            start: 107,
            end: 111,
            length: 5,
            sequence: 'GCAGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00151',
            source: 'REBASE',
            description: 'Found [BlsI] recognization site on seq: GCAGC)',
        },
        {
            start: 152,
            end: 156,
            length: 5,
            sequence: 'GCAGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00151',
            source: 'REBASE',
            description: 'Found [BlsI] recognization site on seq: GCAGC)',
        },
        {
            start: 69,
            end: 74,
            length: 6,
            sequence: 'GCGUGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00152',
            source: 'REBASE',
            description: 'Found [BstC8I, Cac8I] recognization site on seq: GCGUGC)',
        },
        {
            start: 44,
            end: 48,
            length: 5,
            sequence: 'GCUGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00158',
            source: 'REBASE',
            description:
                'Found [BisI, Fnu4HI, Fsp4HI, GluI, ItaI, SatI] recognization site on seq: GCUGC)',
        },
        {
            start: 107,
            end: 111,
            length: 5,
            sequence: 'GCAGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00158',
            source: 'REBASE',
            description:
                'Found [BisI, Fnu4HI, Fsp4HI, GluI, ItaI, SatI] recognization site on seq: GCAGC)',
        },
        {
            start: 152,
            end: 156,
            length: 5,
            sequence: 'GCAGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00158',
            source: 'REBASE',
            description:
                'Found [BisI, Fnu4HI, Fsp4HI, GluI, ItaI, SatI] recognization site on seq: GCAGC)',
        },
        {
            start: 213,
            end: 218,
            length: 6,
            sequence: 'GGGCCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00160',
            source: 'REBASE',
            description: 'Found [Bsp1286I, MhlI, SduI] recognization site on seq: GGGCCC)',
        },
        {
            start: 35,
            end: 39,
            length: 5,
            sequence: 'GGAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00161',
            source: 'REBASE',
            description: 'Found [AclWI, AlwI, BspPI] recognization site on seq: GGAUC)',
        },
        {
            start: 213,
            end: 218,
            length: 6,
            sequence: 'GGGCCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00170',
            source: 'REBASE',
            description: 'Found [ApaI] recognization site on seq: GGGCCC)',
        },
        {
            start: 213,
            end: 218,
            length: 6,
            sequence: 'GGGCCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type IV',
            component_class2: null,
            accession_number: 'RENZYME00171',
            source: 'REBASE',
            description: 'Found [BmiI, BspLI, NlaIV, PspN4I] recognization site on seq: GGGCCC)',
        },
        {
            start: 17,
            end: 21,
            length: 5,
            sequence: 'GGUGA',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00174',
            source: 'REBASE',
            description: 'Found [AsuHPI, HphI] recognization site on seq: GGUGA)',
        },
        {
            start: 85,
            end: 89,
            length: 5,
            sequence: 'GGUGA',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00174',
            source: 'REBASE',
            description: 'Found [AsuHPI, HphI] recognization site on seq: GGUGA)',
        },
        {
            start: 164,
            end: 167,
            length: 4,
            sequence: 'GGCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type III',
            component_class2: null,
            accession_number: 'RENZYME00175',
            source: 'REBASE',
            description:
                'Found [BshFI, BsnI, BsuRI, HaeIII, PhoI] recognization site on seq: GGCC)',
        },
        {
            start: 204,
            end: 207,
            length: 4,
            sequence: 'GGCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type III',
            component_class2: null,
            accession_number: 'RENZYME00175',
            source: 'REBASE',
            description:
                'Found [BshFI, BsnI, BsuRI, HaeIII, PhoI] recognization site on seq: GGCC)',
        },
        {
            start: 214,
            end: 217,
            length: 4,
            sequence: 'GGCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type III',
            component_class2: null,
            accession_number: 'RENZYME00175',
            source: 'REBASE',
            description:
                'Found [BshFI, BsnI, BsuRI, HaeIII, PhoI] recognization site on seq: GGCC)',
        },
        {
            start: 213,
            end: 218,
            length: 6,
            sequence: 'GGGCCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00179',
            source: 'REBASE',
            description:
                'Found [BaeGI, Bme1580I, BseSI, BstSLI] recognization site on seq: GGGCCC)',
        },
        {
            start: 213,
            end: 218,
            length: 6,
            sequence: 'GGGCCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II',
            component_class2: null,
            accession_number: 'RENZYME00180',
            source: 'REBASE',
            description: 'Found [BanII, Eco24I, EcoT38I, FriOI] recognization site on seq: GGGCCC)',
        },
        {
            start: 44,
            end: 48,
            length: 5,
            sequence: 'GCUGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00200',
            source: 'REBASE',
            description: 'Found [ApeKI, TseI] recognization site on seq: GCUGC)',
        },
        {
            start: 107,
            end: 111,
            length: 5,
            sequence: 'GCAGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00200',
            source: 'REBASE',
            description: 'Found [ApeKI, TseI] recognization site on seq: GCAGC)',
        },
        {
            start: 152,
            end: 156,
            length: 5,
            sequence: 'GCAGC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00200',
            source: 'REBASE',
            description: 'Found [ApeKI, TseI] recognization site on seq: GCAGC)',
        },
        {
            start: 213,
            end: 218,
            length: 6,
            sequence: 'GGGCCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00203',
            source: 'REBASE',
            description: 'Found [Bsp120I, PspOMI] recognization site on seq: GGGCCC)',
        },
        {
            start: 164,
            end: 168,
            length: 5,
            sequence: 'GGCCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00204',
            source: 'REBASE',
            description:
                'Found [AspS9I, BmgT120I, Cfr13I, PspPI, Sau96I] recognization site on seq: GGCCC)',
        },
        {
            start: 213,
            end: 217,
            length: 5,
            sequence: 'GGGCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00204',
            source: 'REBASE',
            description:
                'Found [AspS9I, BmgT120I, Cfr13I, PspPI, Sau96I] recognization site on seq: GGGCC)',
        },
        {
            start: 21,
            end: 26,
            length: 6,
            sequence: 'ACAUGU',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00212',
            source: 'REBASE',
            description: 'Found [BstNSI, NspI, XceI] recognization site on seq: ACAUGU)',
        },
        {
            start: 30,
            end: 33,
            length: 4,
            sequence: 'AGCU',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00214',
            source: 'REBASE',
            description: 'Found [CviJI] recognization site on seq: AGCU)',
        },
        {
            start: 109,
            end: 112,
            length: 4,
            sequence: 'AGCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00214',
            source: 'REBASE',
            description: 'Found [CviJI] recognization site on seq: AGCC)',
        },
        {
            start: 164,
            end: 167,
            length: 4,
            sequence: 'GGCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00214',
            source: 'REBASE',
            description: 'Found [CviJI] recognization site on seq: GGCC)',
        },
        {
            start: 204,
            end: 207,
            length: 4,
            sequence: 'GGCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00214',
            source: 'REBASE',
            description: 'Found [CviJI] recognization site on seq: GGCC)',
        },
        {
            start: 214,
            end: 217,
            length: 4,
            sequence: 'GGCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00214',
            source: 'REBASE',
            description: 'Found [CviJI] recognization site on seq: GGCC)',
        },
        {
            start: 223,
            end: 226,
            length: 4,
            sequence: 'AGCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00214',
            source: 'REBASE',
            description: 'Found [CviJI] recognization site on seq: AGCC)',
        },
        {
            start: 213,
            end: 219,
            length: 7,
            sequence: 'GGGCCCC',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II',
            component_class2: null,
            accession_number: 'RENZYME00215',
            source: 'REBASE',
            description: 'Found [DraII, EcoO109I] recognization site on seq: GGGCCCC)',
        },
        {
            start: 179,
            end: 184,
            length: 6,
            sequence: 'AGAUCU',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II',
            component_class2: null,
            accession_number: 'RENZYME00220',
            source: 'REBASE',
            description:
                'Found [BstX2I, BstYI, MflI, PsuI, XhoII] recognization site on seq: AGAUCU)',
        },
        {
            start: 38,
            end: 42,
            length: 5,
            sequence: 'UCAGA',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00225',
            source: 'REBASE',
            description: 'Found [Hpy188I] recognization site on seq: UCAGA)',
        },
        {
            start: 176,
            end: 181,
            length: 6,
            sequence: 'UCGAGA',
            component_type: 'restriction_sites',
            component_class1: 'Type III',
            component_class2: null,
            accession_number: 'RENZYME00226',
            source: 'REBASE',
            description: 'Found [Hpy188III] recognization site on seq: UCGAGA)',
        },
        {
            start: 185,
            end: 190,
            length: 6,
            sequence: 'UCAAGA',
            component_type: 'restriction_sites',
            component_class1: 'Type III',
            component_class2: null,
            accession_number: 'RENZYME00226',
            source: 'REBASE',
            description: 'Found [Hpy188III] recognization site on seq: UCAAGA)',
        },
        {
            start: 46,
            end: 49,
            length: 4,
            sequence: 'UGCA',
            component_type: 'restriction_sites',
            component_class1: 'Type V',
            component_class2: null,
            accession_number: 'RENZYME00229',
            source: 'REBASE',
            description: 'Found [HpyCH4V] recognization site on seq: UGCA)',
        },
        {
            start: 196,
            end: 199,
            length: 4,
            sequence: 'UGCA',
            component_type: 'restriction_sites',
            component_class1: 'Type V',
            component_class2: null,
            accession_number: 'RENZYME00229',
            source: 'REBASE',
            description: 'Found [HpyCH4V] recognization site on seq: UGCA)',
        },
        {
            start: 58,
            end: 61,
            length: 4,
            sequence: 'UCGA',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00237',
            source: 'REBASE',
            description: 'Found [TaqI] recognization site on seq: UCGA)',
        },
        {
            start: 176,
            end: 179,
            length: 4,
            sequence: 'UCGA',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00237',
            source: 'REBASE',
            description: 'Found [TaqI] recognization site on seq: UCGA)',
        },
        {
            start: 8,
            end: 11,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00246',
            source: 'REBASE',
            description: 'Found [FaiI] recognization site on seq: CAUG)',
        },
        {
            start: 22,
            end: 25,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00246',
            source: 'REBASE',
            description: 'Found [FaiI] recognization site on seq: CAUG)',
        },
        {
            start: 135,
            end: 138,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00246',
            source: 'REBASE',
            description: 'Found [FaiI] recognization site on seq: CAUG)',
        },
        {
            start: 141,
            end: 144,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00246',
            source: 'REBASE',
            description: 'Found [FaiI] recognization site on seq: CAUG)',
        },
        {
            start: 234,
            end: 237,
            length: 4,
            sequence: 'AAUU',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00248',
            source: 'REBASE',
            description:
                'Found [MluCI, Sse9I, TasI, Tsp509I, TspEI] recognization site on seq: AAUU)',
        },
        {
            start: 8,
            end: 11,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00249',
            source: 'REBASE',
            description: 'Found [FatI] recognization site on seq: CAUG)',
        },
        {
            start: 22,
            end: 25,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00249',
            source: 'REBASE',
            description: 'Found [FatI] recognization site on seq: CAUG)',
        },
        {
            start: 135,
            end: 138,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00249',
            source: 'REBASE',
            description: 'Found [FatI] recognization site on seq: CAUG)',
        },
        {
            start: 141,
            end: 144,
            length: 4,
            sequence: 'CAUG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00249',
            source: 'REBASE',
            description: 'Found [FatI] recognization site on seq: CAUG)',
        },
        {
            start: 14,
            end: 18,
            length: 5,
            sequence: 'CCAGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00250',
            source: 'REBASE',
            description: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCAGG)',
        },
        {
            start: 98,
            end: 102,
            length: 5,
            sequence: 'CCUGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00250',
            source: 'REBASE',
            description: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCUGG)',
        },
        {
            start: 123,
            end: 127,
            length: 5,
            sequence: 'CCGGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00250',
            source: 'REBASE',
            description: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCGGG)',
        },
        {
            start: 191,
            end: 195,
            length: 5,
            sequence: 'CCAGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00250',
            source: 'REBASE',
            description: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCAGG)',
        },
        {
            start: 210,
            end: 214,
            length: 5,
            sequence: 'CCUGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00250',
            source: 'REBASE',
            description: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCUGG)',
        },
        {
            start: 14,
            end: 18,
            length: 5,
            sequence: 'CCAGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II',
            component_class2: null,
            accession_number: 'RENZYME00251',
            source: 'REBASE',
            description: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCAGG)',
        },
        {
            start: 98,
            end: 102,
            length: 5,
            sequence: 'CCUGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II',
            component_class2: null,
            accession_number: 'RENZYME00251',
            source: 'REBASE',
            description: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCUGG)',
        },
        {
            start: 191,
            end: 195,
            length: 5,
            sequence: 'CCAGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II',
            component_class2: null,
            accession_number: 'RENZYME00251',
            source: 'REBASE',
            description: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCAGG)',
        },
        {
            start: 210,
            end: 214,
            length: 5,
            sequence: 'CCUGG',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II',
            component_class2: null,
            accession_number: 'RENZYME00251',
            source: 'REBASE',
            description: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCUGG)',
        },
        {
            start: 11,
            end: 14,
            length: 4,
            sequence: 'GAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II',
            component_class2: null,
            accession_number: 'RENZYME00252',
            source: 'REBASE',
            description:
                'Found [BfuCI, Bsp143I, BssMI, BstMBI, DpnII, Kzo9I, MboI, NdeII, Sau3AI] recognization site on seq: GAUC)',
        },
        {
            start: 36,
            end: 39,
            length: 4,
            sequence: 'GAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II',
            component_class2: null,
            accession_number: 'RENZYME00252',
            source: 'REBASE',
            description:
                'Found [BfuCI, Bsp143I, BssMI, BstMBI, DpnII, Kzo9I, MboI, NdeII, Sau3AI] recognization site on seq: GAUC)',
        },
        {
            start: 180,
            end: 183,
            length: 4,
            sequence: 'GAUC',
            component_type: 'restriction_sites',
            component_class1: 'Type I, Type II',
            component_class2: null,
            accession_number: 'RENZYME00252',
            source: 'REBASE',
            description:
                'Found [BfuCI, Bsp143I, BssMI, BstMBI, DpnII, Kzo9I, MboI, NdeII, Sau3AI] recognization site on seq: GAUC)',
        },
        {
            start: 18,
            end: 22,
            length: 5,
            sequence: 'GUGAC',
            component_type: 'restriction_sites',
            component_class1: 'Type III',
            component_class2: null,
            accession_number: 'RENZYME00253',
            source: 'REBASE',
            description: 'Found [MaeIII] recognization site on seq: GUGAC)',
        },
        {
            start: 86,
            end: 90,
            length: 5,
            sequence: 'GUGAC',
            component_type: 'restriction_sites',
            component_class1: 'Type III',
            component_class2: null,
            accession_number: 'RENZYME00253',
            source: 'REBASE',
            description: 'Found [MaeIII] recognization site on seq: GUGAC)',
        },
        {
            start: 127,
            end: 131,
            length: 5,
            sequence: 'GUCAC',
            component_type: 'restriction_sites',
            component_class1: 'Type III',
            component_class2: null,
            accession_number: 'RENZYME00253',
            source: 'REBASE',
            description: 'Found [MaeIII] recognization site on seq: GUCAC)',
        },
        {
            start: 18,
            end: 22,
            length: 5,
            sequence: 'GUGAC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00254',
            source: 'REBASE',
            description: 'Found [NmuCI, Tsp45I] recognization site on seq: GUGAC)',
        },
        {
            start: 86,
            end: 90,
            length: 5,
            sequence: 'GUGAC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00254',
            source: 'REBASE',
            description: 'Found [NmuCI, Tsp45I] recognization site on seq: GUGAC)',
        },
        {
            start: 127,
            end: 131,
            length: 5,
            sequence: 'GUCAC',
            component_type: 'restriction_sites',
            component_class1: 'Type I',
            component_class2: null,
            accession_number: 'RENZYME00254',
            source: 'REBASE',
            description: 'Found [NmuCI, Tsp45I] recognization site on seq: GUCAC)',
        },
        {
            start: 10,
            end: 19,
            length: 10,
            sequence: 'UGAUCCAGGU',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s0-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s0-side1',
        },
        {
            start: 10,
            end: 19,
            length: 10,
            sequence: 'UGAUCCAGGU',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s0-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s0-side2',
        },
        {
            start: 31,
            end: 40,
            length: 10,
            sequence: 'GCUUGGAUCA',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s0-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s0-side1',
        },
        {
            start: 31,
            end: 40,
            length: 10,
            sequence: 'GCUUGGAUCA',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s0-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s0-side2',
        },
        {
            start: 41,
            end: 45,
            length: 5,
            sequence: 'GAUGC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s1-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s1-side1',
        },
        {
            start: 41,
            end: 45,
            length: 5,
            sequence: 'GAUGC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s1-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s1-side2',
        },
        {
            start: 54,
            end: 58,
            length: 5,
            sequence: 'GCGUU',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s1-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s1-side1',
        },
        {
            start: 54,
            end: 58,
            length: 5,
            sequence: 'GCGUU',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s1-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s1-side2',
        },
        {
            start: 65,
            end: 73,
            length: 9,
            sequence: 'GGGAGCGUG',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s3-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s3-side1',
        },
        {
            start: 65,
            end: 73,
            length: 9,
            sequence: 'GGGAGCGUG',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s3-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s3-side2',
        },
        {
            start: 90,
            end: 98,
            length: 9,
            sequence: 'CACGCUUCC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s3-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s3-side1',
        },
        {
            start: 90,
            end: 98,
            length: 9,
            sequence: 'CACGCUUCC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s3-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s3-side2',
        },
        {
            start: 106,
            end: 110,
            length: 5,
            sequence: 'GGCAG',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s7-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s7-side1',
        },
        {
            start: 106,
            end: 110,
            length: 5,
            sequence: 'GGCAG',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s7-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s7-side2',
        },
        {
            start: 116,
            end: 120,
            length: 5,
            sequence: 'CUGCC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s7-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s7-side1',
        },
        {
            start: 116,
            end: 120,
            length: 5,
            sequence: 'CUGCC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s7-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s7-side2',
        },
        {
            start: 125,
            end: 129,
            length: 5,
            sequence: 'GGGUC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s8-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s8-side1',
        },
        {
            start: 125,
            end: 129,
            length: 5,
            sequence: 'GGGUC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s8-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s8-side2',
        },
        {
            start: 164,
            end: 168,
            length: 5,
            sequence: 'GGCCC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s8-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s8-side1',
        },
        {
            start: 164,
            end: 168,
            length: 5,
            sequence: 'GGCCC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s8-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s8-side2',
        },
        {
            start: 179,
            end: 183,
            length: 5,
            sequence: 'AGAUC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s13-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s13-side1',
        },
        {
            start: 179,
            end: 183,
            length: 5,
            sequence: 'AGAUC',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s13-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s13-side2',
        },
        {
            start: 238,
            end: 242,
            length: 5,
            sequence: 'GAUUU',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s13-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s13-side1',
        },
        {
            start: 238,
            end: 242,
            length: 5,
            sequence: 'GAUUU',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s13-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s13-side2',
        },
        {
            start: 192,
            end: 196,
            length: 5,
            sequence: 'CAGGU',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s15-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s15-side1',
        },
        {
            start: 192,
            end: 196,
            length: 5,
            sequence: 'CAGGU',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s15-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s15-side2',
        },
        {
            start: 224,
            end: 228,
            length: 5,
            sequence: 'GCCUG',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s15-side1',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s15-side1',
        },
        {
            start: 224,
            end: 228,
            length: 5,
            sequence: 'GCCUG',
            component_type: 'stem-loop_structure',
            component_class1: 'stem',
            component_class2: null,
            accession_number: 'RSLS_s15-side2',
            source: 'ViennaRNA',
            description: 'Found stem structure region: s15-side2',
        },
        {
            start: 188,
            end: 191,
            length: 7,
            sequence: 'AGAC',
            component_type: 'stem-loop_structure',
            component_class1: 'interior loop',
            component_class2: null,
            accession_number: 'RSLS_i7',
            source: 'ViennaRNA',
            description: 'Found interior loop structure region: i7',
        },
        {
            start: 229,
            end: 231,
            length: 7,
            sequence: 'AAC',
            component_type: 'stem-loop_structure',
            component_class1: 'interior loop',
            component_class2: null,
            accession_number: 'RSLS_i7',
            source: 'ViennaRNA',
            description: 'Found interior loop structure region: i7',
        },
        {
            start: 197,
            end: 203,
            length: 13,
            sequence: 'GCAACAA',
            component_type: 'stem-loop_structure',
            component_class1: 'interior loop',
            component_class2: null,
            accession_number: 'RSLS_i8',
            source: 'ViennaRNA',
            description: 'Found interior loop structure region: i8',
        },
        {
            start: 218,
            end: 223,
            length: 13,
            sequence: 'CCAUCA',
            component_type: 'stem-loop_structure',
            component_class1: 'interior loop',
            component_class2: null,
            accession_number: 'RSLS_i8',
            source: 'ViennaRNA',
            description: 'Found interior loop structure region: i8',
        },
        {
            start: 169,
            end: 175,
            length: 7,
            sequence: 'ACCUUCU',
            component_type: 'stem-loop_structure',
            component_class1: 'multiloop segment',
            component_class2: null,
            accession_number: 'RSLS_m5',
            source: 'ViennaRNA',
            description: 'Found multiloop segment structure region: m5',
        },
        {
            start: 20,
            end: 30,
            length: 11,
            sequence: 'GACAUGUAGAA',
            component_type: 'stem-loop_structure',
            component_class1: 'hairpin loop',
            component_class2: null,
            accession_number: 'RSLS_h0',
            source: 'ViennaRNA',
            description: 'Found hairpin loop structure region: h0',
        },
        {
            start: 46,
            end: 53,
            length: 8,
            sequence: 'UGCACUUU',
            component_type: 'stem-loop_structure',
            component_class1: 'hairpin loop',
            component_class2: null,
            accession_number: 'RSLS_h1',
            source: 'ViennaRNA',
            description: 'Found hairpin loop structure region: h1',
        },
        {
            start: 80,
            end: 84,
            length: 5,
            sequence: 'ACGAC',
            component_type: 'stem-loop_structure',
            component_class1: 'hairpin loop',
            component_class2: null,
            accession_number: 'RSLS_h2',
            source: 'ViennaRNA',
            description: 'Found hairpin loop structure region: h2',
        },
        {
            start: 111,
            end: 115,
            length: 5,
            sequence: 'CCAGA',
            component_type: 'stem-loop_structure',
            component_class1: 'hairpin loop',
            component_class2: null,
            accession_number: 'RSLS_h3',
            source: 'ViennaRNA',
            description: 'Found hairpin loop structure region: h3',
        },
        {
            start: 208,
            end: 213,
            length: 6,
            sequence: 'GACCUG',
            component_type: 'stem-loop_structure',
            component_class1: 'hairpin loop',
            component_class2: null,
            accession_number: 'RSLS_h5',
            source: 'ViennaRNA',
            description: 'Found hairpin loop structure region: h5',
        },
        {
            start: 170,
            end: 186,
            length: 17,
            sequence: 'CCUUCUUCGAGAUCUUC',
            component_type: 'IRES',
            component_class1: null,
            component_class2: '0.27',
            accession_number: 'hsa_ires_00452.1',
            source: 'IRESbase',
            description:
                'Found a sequence region with high homology to IRES:hsa_ires_00452.1, with an e-value of 0.27',
        },
    ],
    sequence:
        'CUAAUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCCAUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGAAUUGAUUUU',
}
/* const annotation_data1 = {
    result: [
        {
            start: 1,
            end: 135,
            length: 135,
            sequence:
                'CUAAUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCC',
            component_type: 'main_regions',
            component_class1: "5' UTR",
            component_class2: null,
            accession_number: null,
            source: '-',
            description: "the 5' untranslated region",
        },
        {
            start: 136,
            end: 234,
            length: 99,
            sequence:
                'AUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
            component_type: 'main_regions',
            component_class1: 'CDS',
            component_class2: null,
            accession_number: null,
            source: '-',
            description: 'the coding region of mRNA',
        },
    ],
    sequence:
        'CUAAUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCCAUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGAAUUGAUUUU',
} */
// const phageStore = usePhageStore()

// const props = defineProps({
//     proteinUrl: String,
//     geneUrl: String,
// })
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
// const triangleOffset = ref(15)
// const arrowWeight = ref(7)
// for note label
// const regionHeight = ref(51)

// For calculate GC-content
// const gcwindow = ref(20)
// const gcContentData = ref()

// const isShowDetail = ref(false)
// const isShowSelect = ref(true)
// const selectProtein = reactive({
// Protein_id: '',
// })

// const title = ref('')

const selectProteinData = ref()

/* const showDetail = () => {
    isShowDetail.value = true
} */
// draw arrow method
function Rectangle(start, end, y) {
    return `M ${end} ${y} H ${start} V ${y + barHeight.value} H ${end} Z`
}
const chooseColor = (d: unknown) => {
    let color = ''
    // when d is protein_class
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
        case 'RNA  Secondary Structure Metrics':
            color = '#DF3AD2'
            break
        case 'Autoimmune Score':
            color = '#9dc6e7'
            break
        case 'Motif Risk':
            color = '#0FF0BF'
            break
        case 'MHC Affinity':
            color = '#9343f0'
            break
        case 'T-Cell Score':
            color = '#ec364e'
            break
        case 'B-Cell Score':
            color = '#90ed7d'
            break
        default:
            color = '#445d8f'
            break
    }
    // additional cases for other indices if needed
    return color
}
onMounted(() => {
    const wholestart = 0 // 设置开始值
    const wholeend = annotationData.sequence.length // 设置结束值
    const splitAnnotationData = _.groupBy(annotationData.result, 'component_type')
    height.value = lineHeight.value + 250
    const svg = d3
        .select('#mrna_annotation')
        .attr('transform', `translate(${marginLeft.value}, 0)`)
        .on('dblclick', function () {
            console.log('666')
        })

    // const gcY = d3.scaleLinear().domain([20, 80]).range([40, 0])

    const bararea = svg
        .append('svg')
        .attr('height', height.value)
        .attr('width', 1000)
        .attr('x', barareaMarginLeft.value)
        .attr('y', 0)
    // 创建线性比例尺对象
    const scaleX = d3.scaleLinear().domain([wholestart, wholeend]).range([0, 100])

    // 创建底部刻度轴生成器
    const xAxis = d3
        .axisBottom(scaleX)
        .ticks(10) // 设置刻度线的数量为 10
        .tickFormat(function (t) {
            return t === 0 ? 0 : `${t}` // 设置刻度线的显示格式
        })

    // 在指定位置创建 <g> 元素，并应用刻度轴生成器
    svg.append('g')
        .attr('transform', `translate(${barareaMarginLeft.value}, ${lineHeight.value + 100})`)
        .attr('color', '#818181')
        .call(xAxis)
    const mainRegionsData = splitAnnotationData.main_regions // 获取 "main_regions" 组件类型的注释数据数组
    const firstMainRegionData = mainRegionsData[0]
    bararea
        .selectAll('geneline')
        .data(firstMainRegionData)
        .enter()
        .append('path')
        .attr('class', 'geneline')
        .attr('d', function (i) {
            const startX = d3.scaleLinear().domain([wholestart, wholeend]).range([0, 100])(
                Number(i.start)
            )
            const endX = d3.scaleLinear().domain([wholestart, wholeend]).range([0, 100])(
                Number(i.end)
            )
            Rectangle(startX, endX, lineHeight.value + 65)
        })
        .attr('fill', function (i) {
            chooseColor(i.component_class1)
        })
})
// draw region method
// function regionLine(start, end, y, close) {
//     if (close === '[1, 1]') {
//         return `M ${start} ${y} V ${y - regionHeight.value}  H ${end} V ${y}`
//     }
//     if (close === '[1, 0]') {
//         return `M ${start} ${y} V ${y - regionHeight.value}  H ${end} `
//     }
//     if (close === '[0, 0]') {
//         return `M ${start} ${y - regionHeight.value}  H ${end}  `
//     }
//     return `M ${start} ${y - regionHeight.value}  H ${end} V ${y} `
// }
/* const fastadata = computed(() => {
    return phageStore.phagefastadata
})
const proteindata = computed(() => {
    return phageStore.phageprotein
})

const loaddata = computed(() => {
    return phageStore.phagedataloaded
}) */

/* watch(loaddata, () => {
    if (loaddata.value) {
        d3.select('#Viz_area_annotation').selectAll('*').remove()
        d3.select('#Legend_area').selectAll('*').remove()
        const textList = _.drop(_.split(fastadata.value, '\n'))
        const fastastring = _.join(textList, '')
        let x = 0
        const calArray = []
        while (x + gcwindow.value < fastastring.length) {
            const gcContent = countGC(fastastring.slice(x, x + gcwindow.value))
            calArray.push([x + gcwindow.value / 2, gcContent])
            x += gcwindow.value
        }
        const splitGC = _.groupBy(calArray, d => {
            // eslint-disable-next-line no-bitwise
            return (Number(d[0]) / 10000) | 0
        })
        gcContentData.value = splitGC

        const data = proteindata.value
        title.value = data[0].Phage_Acession_ID
        // const copydata = JSON.parse(JSON.stringify(data))

        const splitdata = _.groupBy(data, d => {
            // eslint-disable-next-line no-bitwise
            return (Number(d.Stop_location) / 10000) | 0
        })

        _.forEach(splitdata, (group, k) => {
            _.forEach(group, d => {
                // eslint-disable-next-line no-bitwise
                const s = (Number(d.Start_location) / 10000) | 0
                if (s !== Number(k)) {
                    const newDict = { ...d }
                    newDict.Stop_location = k * 10000
                    // eslint-disable-next-line no-param-reassign
                    d.Start_location = newDict.Stop_location
                    splitdata[String(s)].push(newDict)
                }
            })
        })

        // The legend at the bottom
        const legnedSvg = d3.select('#Legend_area')
        legnedSvg
            .selectAll('legendLabel')
            .data(proteinType)
            .enter()
            .append('rect')
            .attr('x', function (d, i) {
                // eslint-disable-next-line no-bitwise
                return ((i / 2) | 0) * 140 + 140
            })
            .attr('y', function (d, i) {
                return (i % 2) * 30 + 35
            })
            .attr('width', 20)
            .attr('height', 20)
            .style('fill', function (d) {
                return TypeDict[d].color
            })
        legnedSvg
            .selectAll('legendText')
            .data(proteinType)
            .enter()
            .append('text')
            .attr('x', function (d, i) {
                // eslint-disable-next-line no-bitwise
                return ((i / 2) | 0) * 140 + 170
            })
            .attr('y', function (d, i) {
                return (i % 2) * 30 + 47
            })
            .style('fill', '#818181')
            .text(function (d) {
                return TypeDict[d].name
            })
            .attr('text-anchor', 'start')
            .style('alignment-baseline', 'middle')
*/

function downloadsvg() {
    const svgElement = document.getElementById('Viz_area_annotation') as HTMLElement
    const svgData = new XMLSerializer().serializeToString(svgElement as SVGElement)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'annotation.svg'
    link.click()
    URL.revokeObjectURL(url)
}
const downloadSVGAsPNG = async () => {
    const svgElement = document.getElementById('Viz_area_annotation') as HTMLElement
    const svgData = new XMLSerializer().serializeToString(svgElement as SVGElement)
    const svgDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`

    const img = new Image()
    img.src = svgDataURL

    await new Promise(resolve => {
        img.onload = () => {
            resolve()
        }
    })

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (ctx) {
        ctx.drawImage(img, 0, 0)
    }

    canvas.toBlob(blob => {
        if (blob) {
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = 'my-svg-image.png'
            link.click()

            URL.revokeObjectURL(url)
        }
    }, 'image/png')
}
/* _.forEach(splitdata, (d, k) => {
            const start = Number(k) * 10000
            const end = (Number(k) + 1) * 10000
            // Main X axis
            svg.append('g')
                .attr(
                    'transform',
                    `translate(${barareaMarginLeft.value},${k * lineHeight.value + 100})`
                )
                .attr('color', '#818181')
                .call(
                    d3
                        .axisBottom(d3.scaleLinear().domain([start, end]).range([0, 1000]))
                        .ticks(10)
                        .tickFormat(function (t) {
                            return t === 0 ? 0 : `${t / 1000}`
                        })
                )
            
            // Add some text in figure
            svg.append('text')
                .attr(
                    'transform',
                    `translate(${1000 + barareaMarginLeft.value + 8},${
                        k * lineHeight.value + 115.5
                    })`
                )
                .style('fill', '#818181')
                .text('(kb)')
                .style('font-size', 11)
*/

// GC-Content Y axis
/*  svg.append('g')
                .attr(
                    'transform',
                    `translate(${1000 + barareaMarginLeft.value + 2},${k * lineHeight.value + 130})`
                )
                .attr('color', '#818181')
                .call(
                    d3
                        .axisRight(gcY)

                        .tickValues([20, 50, 80])
                        .tickFormat(function (t) {
                            return `${t}%`
                        })
                )
                .style('font-size', 10)
            svg.append('text')
                .attr('transform', `translate(13,${k * lineHeight.value + 149})`)
                .style('fill', '#818181')
                .text('GC-')
                .style('font-size', 14)
            svg.append('text')
                .attr('transform', `translate(0,${k * lineHeight.value + 168})`)
                .style('fill', '#818181')
                .text('Content')
                .style('font-size', 14)

            // Draw GC-Content plot
            // backgrad for GC-Content plot
            svg.append('rect')
                .attr('x', 0)
                .attr('width', 1000)
                .attr('height', 40)
                .style('fill', '#8ab3e7')
                .style('opacity', '0.2')
                .attr(
                    'transform',
                    `translate(${barareaMarginLeft.value},${k * lineHeight.value + 130})`
                )
            // draw GC-Content line
            svg.append('path')
                .datum(gcContentData.value[k])
                .attr('fill', '#367dd6')
                .attr(
                    'd',
                    d3
                        .area()
                        .x(function (c) {
                            return d3.scaleLinear().domain([start, end]).range([0, 1000])(c['0'])
                        })
                        .y0(gcY(50))
                        .y1(function (c) {
                            // A bug in d3.area() when the value is NaN
                            if (Number.isNaN(c['1'])) {
                                return gcY(50)
                            }
                            return gcY(c['1'] * 100)
                        })
                )
                .attr(
                    'transform',
                    `translate(${barareaMarginLeft.value},${k * lineHeight.value + 130})`
                )
            const toolarea = svg
                .append('svg')
                .attr('height', 100)
                .attr('width', 260)
                .style('opacity', 0)
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
                    return `Classification : ${mv.Protein_function_classification}`
                })
                toolText2.text(function () {
                    return `Product : ${mv.Protein_product}`
                })
                toolText3.text(function () {
                    return `location : ${Number(mv.Start_location)}-${Number(mv.Stop_location)}`
                })
            }
            const mouseleave = function () {
                bararea.selectAll('.geneline').style('opacity', 1)
                toolarea.style('opacity', 0).attr('x', 0).attr('y', 0)
            }
            const click = function (md, mv) {
                bararea
                    .selectAll('.geneline')
                    .style('stroke', '#818181')
                    .attr('stroke-width', '1px')
                isShowSelect.value = false
                d3.select(this).style('stroke', '#FE0e79').attr('stroke-width', '2px')
                selectProtein.Protein_id = mv.Protein_id
                selectProteinData.value = mv
            }
            bararea
                .selectAll('geneline')
                .data(d)
                .enter()
                .append('path')
                .attr('class', 'geneline')
                .attr('d', function (i) {
                    const startX = d3.scaleLinear().domain([start, end]).range([0, 1000])(
                        Number(i.Start_location)
                    )
                    const endX = d3.scaleLinear().domain([start, end]).range([0, 1000])(
                        Number(i.Stop_location)
                    )

                    return i.Strand === '+'
                        ? forwordtriangle(startX, endX, k * lineHeight.value + 65)
                        : backtriangle(startX, endX, k * lineHeight.value + 65)
                })
                .attr('fill', function (i) {
                    const classlist = i.Protein_function_classification?.split(';').slice(
                        0,
                        -1
                    ) as string[]
                    if (classlist.length === 1) {
                        if (classlist[0] in TypeDict) {
                            return TypeDict[classlist[0]].color
                        }
                        return TypeDict.mix.color
                    }
                    return TypeDict.mix.color
                })
                .attr('stroke', '#5b5b5b')
                .attr('stroke-width', '1px')
                .on('mouseenter ', mouseenter)
                .on('mouseleave', mouseleave)
                .on('click', click)
        })
        loadchart.value = false
    }
}) */
</script>
