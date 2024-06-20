<template>
    <div class="flex flex-col justify-center items-center h-full">
        <div class="w-290">
            <div class="flex flex-row w-200">
                <div class="text-4xl font-500 mb-12">Protein Detail</div>
                <div class="mt-1.5 ml-10">
                    <el-button @click="downloadprotein">
                        <template #icon>
                            <n-icon><downicon /></n-icon>
                        </template>
                        Download Sequence
                    </el-button>
                </div>
            </div>
            <el-descriptions class="w-310 text-xl" :column="2" size="large" border>
                <el-descriptions-item v-if="props.type !== 'taskresult'">
                    <template #label>
                        <div class="cell-item">Phage ID</div>
                    </template>

                    <!-- <el-button type="text">
                   
                            {{ proteinInfo.Phage_Acession_ID }}
                  
                    </el-button> -->
                    {{ proteinInfo.Phage_Acession_ID }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Protein ID</div>
                    </template>
                    {{ proteinInfo.Protein_id }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Orf Prediction Source</div>
                    </template>
                    <el-tag v-if="props.type === 'taskresult'">prodigal</el-tag>
                    <el-tag v-else>{{ proteinInfo.Source }}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item v-if="props.type === 'taskresult'">
                    <template #label>
                        <div class="cell-item">Function Prediction Source</div>
                    </template>
                    <el-tag>{{ proteinInfo.protein_function_prediction_source }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item v-else>
                    <template #label>
                        <div class="cell-item">Function Prediction Source</div>
                    </template>
                    <el-tag>{{ proteinInfo.Function_prediction_source }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Function classification</div>
                    </template>
                    <el-tag
                        v-for="key in classlist"
                        :key="key"
                        :color="typedTypeDict[key].color"
                        class="text-white"
                    >
                        {{ key }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Protein Product</div>
                    </template>
                    {{ proteinInfo.Protein_product }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Strand</div>
                    </template>
                    {{ proteinInfo.Strand }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Start Point</div>
                    </template>
                    {{ proteinInfo.Start_location }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">End Point</div>
                    </template>
                    {{ proteinInfo.Stop_location }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="w-290 mt-6" v-show="props.type !== 'taskresult'">
            <div class="flex flex-row w-200">
                <div class="text-2xl font-500 mb-4">Protein Physicochemical Info</div>
                <div class="ml-10"></div>
            </div>

            <el-descriptions class="w-310 text-xl" :column="2" size="large" border>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Protein molecular weight</div>
                    </template>
                    {{ proteinInfo.molecular_weight }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Protein aromaticity</div>
                    </template>
                    {{ proteinInfo.aromaticity }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Protein instability index</div>
                    </template>
                    {{ proteinInfo.instability_index }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Protein isoelectric point</div>
                    </template>
                    {{ proteinInfo.isoelectric_point }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Helix secondary structure fraction</div>
                    </template>
                    {{ proteinInfo.Helix_secondary_structure_fraction }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Turn secondary structure fraction</div>
                    </template>
                    {{ proteinInfo.Turn_secondary_structure_fraction }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Sheet secondary structure fraction</div>
                    </template>
                    {{ proteinInfo.Sheet_secondary_structure_fraction }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Reduced molar extinction coefficient</div>
                    </template>
                    {{ proteinInfo.Reduced_molar_extinction_coefficient }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Oxidized molar extinction coefficient</div>
                    </template>
                    {{ proteinInfo.Oxidized_molar_extinction_coefficient }}
                </el-descriptions-item>
            </el-descriptions>
            <div></div>
        </div>
        <div class="w-290 mt-6">
            <div class="flex flex-row w-290">
                <div class="text-2xl font-500 mb-4">Protein Sequence</div>
            </div>

            <el-input
                autosize
                type="textarea"
                class="font-mono mt-1 tracking-wide text-lg"
                readonly
                v-model="sequence"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
//
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
import { PropType } from 'vue'
import { TypeDict } from '@/utils/annotation'

const props = defineProps({
    proteinInfo: Object as PropType<any>,
    dataset: String,
    type: String,
})

const typedTypeDict = TypeDict as { [key: string]: { color: string } }
const classlist = computed(() => {
    if (props.proteinInfo.Protein_function_classification === undefined) return []
    return props.proteinInfo.Protein_function_classification.split(';').slice(0, -1) as string[]
})
const sequence = computed(() => {
    if (props.proteinInfo.sequence === undefined) return ''
    return props.proteinInfo.sequence
})
const downloadprotein = () => {
    const filename = `${props.proteinInfo.Protein_id}.fasta`
    const blob = new Blob([sequence.value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
}
</script>
