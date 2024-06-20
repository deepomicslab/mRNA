<template>
    <div>
        <div>
            <iframe :src="url" scrolling="auto" frameborder="no" class="w-full h-106" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { watchEffect } from 'vue'
import { usemrnaStore } from '@/store/mrna'

const mrnaStore = usemrnaStore()
const url = ref('')
/* const protein = {
    type: 'pdb',
    fileurl: 'https://storage.googleapis.com/membranome-assets/pdb_files/proteins/FCG2A_HUMAN.pdb',
} */

watchEffect(() => {
    url.value = `https://www.ncbi.nlm.nih.gov/Structure/icn3d/?type=${mrnaStore.proteinstructureList.type}&url=${mrnaStore.proteinstructureList.fileurl}`
})
/* const url = computed(() => {
    return `https://www.ncbi.nlm.nih.gov/Structure/icn3d/?type=${mrnaStore.proteinstructureList.type}&url=${mrnaStore.proteinstructureList.fileurl}`
}) */
/* const url = computed(() => {
    return `https://www.ncbi.nlm.nih.gov/Structure/icn3d/?type=${protein.type}&url=${protein.fileurl}`
}) */
</script>
