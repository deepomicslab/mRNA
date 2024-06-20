import { defineStore } from 'pinia'

export const usemrnaStore = defineStore('mrna', () => {
    const StructureList = ref([])

    return {
        StructureList,
}
})
