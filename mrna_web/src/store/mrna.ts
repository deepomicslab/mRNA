import { defineStore } from 'pinia'

export const usemrnaStore = defineStore('mrna', () => {
    const StructureList = ref([])
    const proteinstructureList = ref([])
    // const sequencemarker = ref({ result: [], sequence: [], circlealignment: [] })
    const sequencemarker = ref({ result: [], sequence: [] })
    return {
        StructureList,
        proteinstructureList,
        sequencemarker,
    }
})
