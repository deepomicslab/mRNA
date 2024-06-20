<template>
    <div class="flex flex-col w-full h-full">
        <el-scrollbar class="w-full h-full" ref="scrollbarRef">
            <div class="flex flex-col h-200 w-550">
                <div class="font-600 text-3xl ml-20 mt-10 justify-center items-center">
                    Input Sequence
                </div>
                <div class="flex flex-col justify-center items-center left">
                    <div class="ml-5">
                        <n-radio-group v-model:value="tasktype">
                            <n-radio-button value="mRNA">For mRNA-seqence</n-radio-button>
                            <n-radio-button value="Peptide">For peptide</n-radio-button>
                        </n-radio-group>
                    </div>
                    <div class="spacer"></div>
                    <div>
                        <input type="text" v-model="searchText" />
                    </div>
                    <div>
                        <mRNAtask></mRNAtask>
                    </div>
                    <n-alert type="info" closable :bordered="false" class="w-180 bg-[#9ab4c5]">
                        <template #icon>
                            <el-icon class="text-lg mt-2 text-[#34498E]">
                                <InfoFilled />
                            </el-icon>
                        </template>
                        <template #header>
                            <p class="text-lg text-gray-50">Submit Note</p>
                        </template>
                    </n-alert>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
// @ts-nocheck
import type { UploadFileInfo } from 'naive-ui'
// import axios from 'axios'
import { useRouter } from 'vue-router'
// import { useRouter, RouterLink } from 'vue-router'
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import mRNAtask from './mRNAtask.vue'

const fileList = ref<UploadFileInfo[]>([])
const submitfile = ref<File>()
// const inputtype = ref('upload')
// const pastefile = ref('')

const userid = ref('')

/* const props = defineProps({
    src: http://rna.tbi.univie.ac.at/forna/forna.html
}) */
const realHeight = ref(`800px;`)
const loading = ref(true)

const router = useRouter()

/* eslint-disable */
const handleFileListChange = (data: UploadFileInfo[]) => {
    if (data[0].name.match(/(.fasta)$/g) === null && data[0].name.match(/(.fa)$/g) === null) {
        window.$message.error('Uploaded file must be fasta format.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data[0].file?.size === 0 || data[0].file?.size === undefined) {
        window.$message.error('Uploaded file cannot be empty.', { closable: true, duration: 5000 })
        data.pop()
    } else if (data[0].file.size / 1024 / 1024 > 10) {
        window.$message.error('Uploaded file cannot exceed 10MB.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data.length > 1) {
        window.$message.error('Cannot upload more than one files.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data.length === 1) {
        submitfile.value = data[0].file
        fileList.value[0] = data[0]
    }
}
const remove = () => {
    submitfile.value = undefined
    fileList.value.pop()
}
//const router = useRouter()

const godemo = () => {
    router.push({ path: '/task/result/mRNAdesign', query: { taskid: 91 } })
}


const submit =  () => {
    router.push({
        path: '/design/display.vue',})
}


onBeforeMount(() => {
    const { userId, getUserIdFromCookie } = useUserIdGenerator()
    getUserIdFromCookie()
    userid.value = userId.value as string
})
onMounted(() => {
    setTimeout(() => { loading.value = false; }, 100);
    window.onresize = function (){
      realHeight.value = document.documentElement.clientHeight - 50 + "px;";
    };
  })
const gosubmithelper = () => {
    router.push({ path: '/tutorial', query: { type: 'mRNAdesign' } })
}
</script>

<style lang="scss" scoped>
:deep(.el-tree-node__content) {
    height: 48px !important;
}
</style>

