import { defineStore } from 'pinia'

export const usePhageStore = defineStore('phagedata', () => {
    const taskphagelist = ref([])
    const taskproteinlist = ref([])
    const phageid = ref()
    const phageprotein = ref()
    const phageaccid = ref()
    const phagedataloaded = ref(false)
    const phagefastadata = ref('')
    const phagetrna = ref([])
    const trnaloaed = ref(false)
    const phageanti = ref([])
    const antiloaded = ref(false)
    const phagecrispr = ref([])
    const crisprloaded = ref(false)
    const phageterminator = ref([])
    const terminatorloaded = ref(false)
    const phagetransprotein = ref([])
    const transproteinloaded = ref(false)
    const phagearvf = ref({ ar: [], vf: [] })
    const arvfloaded = ref(false)
    const phagecomparisonline = ref([])
    const phagealignmentorder = ref([])
    const alignmentloaded = ref(false)
    const phagecomparisondata = ref({ alignment: [], proteins: [], circlealignment: [] })
    const heatmaploaded = ref(false)
    return {
        phageid,
        phageprotein,
        phageaccid,
        phagefastadata,
        phagetrna,
        phageanti,
        phagecrispr,
        phageterminator,
        phagetransprotein,
        phagearvf,
        phagecomparisonline,
        phagealignmentorder,
        alignmentloaded,
        phagecomparisondata,
        phagedataloaded,
        terminatorloaded,
        transproteinloaded,
        antiloaded,
        arvfloaded,
        crisprloaded,
        trnaloaed,
        taskphagelist,
        taskproteinlist,
        heatmaploaded,
    }
})
