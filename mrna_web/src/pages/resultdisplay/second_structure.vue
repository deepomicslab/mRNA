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
const url = ref('') /* const options = {
    structure: '((..((....)).(((....))).))',
    sequence: 'CGCUUCAUAUAAUCCUAAUGACCUAU',
} */
// console.log(mrnaStore.StructureList)

watchEffect(() => {
    url.value = `http://nibiru.tbi.univie.ac.at/forna/forna.html?id=url/name&structure=${mrnaStore.StructureList.structure}&sequence=${mrnaStore.StructureList.sequence}`
})

/* const url = computed(() => {
    return `http://nibiru.tbi.univie.ac.at/forna/forna.html?id=url/name&structure=${mrnaStore.StructureList.structure}&sequence=${mrnaStore.StructureList.sequence}`
}) */
/* const url = computed(() => {
    return `http://nibiru.tbi.univie.ac.at/forna/forna.html?id=url/name&structure=${options.structure}&sequence=${options.sequence}`
}) */
</script>
