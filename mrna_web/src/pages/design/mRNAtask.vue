<template>
    <el-form ref="form" label-width="120px">
        <el-form-item label="Job title">
            <el-input v-model:value="jobtitle" placeholder="Job Title" clearable></el-input>
        </el-form-item>
        <el-form-item label="Input/Upload">
            <n-radio-group v-model:value="inputtype">
                <n-radio-button value="upload">UPLOAD FILE</n-radio-button>
                <n-radio-button value="paste">Input</n-radio-button>
            </n-radio-group>
        </el-form-item>
        <el-form-item v-if="inputtype === 'upload'" label="Upload File">
            <n-upload
                v-model:file-list="fileList"
                directory-dnd
                :default-upload="false"
                accept=".fasta,.fa"
                @update:file-list="handleFileListChange"
                @remove="remove"
                show-remove-button
            >
                <n-upload-dragger>
                    <div class="flex flex-col justify-center items-center">
                        <div class="text-[90px] mt-10" style="color: #028090">
                            <i-fa-cloud-upload />
                        </div>
                        <p class="text-h5 mt-3 font-light" style="color: #028090">
                            Click or drag a file to this area to upload your file
                        </p>

                        <p class="text-sp mt-3 mb-3 text-opacity-100" style="color: #f07167"></p>
                        <p class="text-sp mb-3 text-opacity-100" style="color: #f07167">
                            Supported formats: .fasta / .fa
                        </p>
                    </div>
                </n-upload-dragger>
            </n-upload>
        </el-form-item>
        <el-form-item v-if="inputtype === 'paste'" label="Nucleotide Sequence">
            <div
                class="rounded w-240 h-100 mt-8 rounded-2xl flex-col flex justify-center items-center"
                style="box-shadow: 0 0 64px #cfd5db"
                v-if="inputtype === 'paste'"
            >
                <el-row class="search-bar" align="middle" type="flex">
                    <el-col :span="8">
                        <el-input
                            v-model="searchQuery"
                            placeholder="Find a gene, protein or chemical"
                        ></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="selectedCategory" placeholder="All">
                            <el-option label="All" value="all"></el-option>
                            <el-option label="Genes" value="genes"></el-option>
                            <el-option label="Proteins" value="proteins"></el-option>
                            <el-option label="Chemicals" value="chemicals"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="performSearch">Search</el-button>
                    </el-col>
                </el-row>
                <div id="app" style="display: flex; align-items: center; gap: 10px">
                    <span>example seraches：</span>
                    <p
                        @click="
                            fillSequence(
                                'MTRNKFIPNKFSIISFSVLLFAISSSQAIEVNAMNEHYTESDIKRNHKTEKNKTEKEKFKDSINNLVKTEFTNETLDKIQQTQDLLKKIPKDVLEIYSELGGEIYFTDIDLVEHKELQDLSEEEKNSMNSRGEKVPFASRFVFEKKRETPKLIINIKDYAINSEQSKEVYYEIGKGISLDIISKDKSLDPEFLNLIKSLSDDSDSSDLLFSQKFKEKLELNNKSIDINFIKENLTEFQHAFSLAFSYYFAPDHRTVLELYAPDMFEYMNKLEKGGFEKISESLKKEGVEKDRIDVLKGEKALKASGLVPEHADAFKKIARELNTYILFRPVNKLATNLIKSGVATKGLNVHGKSSDWGPVAGYIPFDQDLSKKHGQQLAVEKGNLENKKSITEHEGEIGKIPLKLDHLRIEELKENGIILKGKKEIDNGKKYYLLESNNQVYEFRISDENNEVQYKTKEGKITVLGEKFNWRNIEVMAKVEGVLKPLTADYDLFALAPSLTEIKKQIPQKEWDKVVNTPNSLEKQKGVTNLLIKYGIERKPDSTKGTLSNWQKQMLDRLNEAVKYTGYTGGDVVNHGTEQDNEEFPEKDNEIFIINPEGEFILTKNWEMTGRFIEKNITGKDYLYYFNRSYNKIAPGNKAYIEWTDPITKAKINTIPTSAEFIKNLSSIRRSSNVGVYKDSGDKDEFAKKESVKKIAGYLSDYYNSANHIFSQEKKRKISIFRGIQAYNEIENVLKSKQIAPEYKNYFQYLKERITNQVQLLLTHQKSNIEFKLLYKQLNFTENETDNFEVFQKIIDEK'
                            )
                        "
                        style="color: blue; cursor: pointer; margin: 0"
                    >
                        P40136
                    </p>
                    <p
                        @click="
                            fillSequence(
                                'MKKRKVLIPLMALSTILVSSTGNLEVIQAEVKQENRLLNESESSSQGLLGYYFSDLNFQAPMVVTSSTTGDLSIPSSELENIPSENQYFQSAIWSGFIKVKKSDEYTFATSADNHVTMWVDDQEVINKASNSNKIRLEKGRLYQIKIQYQRENPTEKGLDFKLYWTDSQNKKEVISSDNLQLPELKQKSSNSRKKRSTSAGPTVPDRDNDGIPDSLEVEGYTVDVKNKRTFLSPWISNIHEKKGLTKYKSSPEKWSTASDPYSDFEKVTGRIDKNVSPEARHPLVAAYPIVHVDMENIILSKNEDQSTQNTDSQTRTISKNTSTSRTHTSEVHGNAEVHASFFDIGGSVSAGFSNSNSSTVAIDHSLSLAGERTWAETMGLNTADTARLNANIRYVNTGTAPIYNVLPTTSLVLGKNQTLATIKAKENQLSQILAPNNYYPSKNLAPIALNAQDDFSSTPITMNYNQFLELEKTKQLRLDTDQVYGNIATYNFENGRVRVDTGSNWSEVLPQIQETTARIIFNGKDLNLVERRIAAVNPSDPLETTKPDMTLKEALKIAFGFNEPNGNLQYQGKDITEFDFNFDQQTSQNIKNQLAELNATNIYTVLDKIKLNAKMNILIRDKRFHYDRNNIAVGADESVVKEAHREVINSSTEGLLLNIDKDIRKILSGYIVEIEDTEGLKEVINDRYDMLNISSLRQDGKTFIDFKKYNDKLPLYISNPNYKVNVYAVTKENTIINPSENGDTSTNGIKKILIFSKKGYEIG'
                            )
                        "
                        style="color: blue; cursor: pointer; margin: 0"
                    >
                        P13423
                    </p>
                </div>

                <div class="w-190 mt-1 flex flex-row text-lg">
                    <n-input
                        round
                        placeholder="Nucleotide Sequence"
                        type="textarea"
                        clearable
                        :rows="10"
                        v-model:value="pastefile"
                    ></n-input>
                </div>
                <div class="mt-4">
                    <n-button-group>
                        <n-button round size="large" class="w-50">Paste</n-button>
                        <n-button round size="large" class="w-50">Copy</n-button>
                    </n-button-group>
                </div>
            </div>
        </el-form-item>
        <el-form-item v-if="inputtype === 'paste'" label="parameters">
            <div class="form-row">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="CAI weight: λ=">
                            <el-input v-model="caiWeight" placeholder="Enter CAI weight"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Codon usage:">
                            <el-select v-model="codonUsage" placeholder="Select codon usage">
                                <el-option label="Human" value="human"></el-option>
                                <el-option label="Yeast" value="yeast"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form-item>
        <el-form-item>
            <div class="mt-4">
                <n-button round size="large" class="w-120" @click="fillSequence('ACGCGTGCA')">
                    example
                </n-button>
                <n-button round size="large" class="w-120" @click="golinearresult">run</n-button>
            </div>
        </el-form-item>

        <el-form-item>
            <div style="background-color: #ececec; padding: 20px">
                <Row :gutter="16">
                    <Col :span="8">
                        <Card title="Autoimmune" :bordered="false">
                            <p>card content</p>
                            <el-button text @click="dialogFormVisible = true">Setting</el-button>

                            <el-dialog
                                v-model="dialogFormVisible"
                                title="Parameters for Autoimmune"
                            >
                                <el-form :model="form">
                                    <el-form-item
                                        label="Promotion name"
                                        :label-width="formLabelWidth"
                                    >
                                        <el-input v-model="immuneparameter1" />
                                    </el-form-item>
                                    <el-form-item label="Zones" :label-width="formLabelWidth">
                                        <el-select
                                            v-model="immuneparameter2"
                                            placeholder="Please select a zone"
                                        >
                                            <el-option label="Zone No.1" value="1" />
                                            <el-option label="Zone No.2" value="2" />
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                                <template #footer>
                                    <span class="dialog-footer">
                                        <el-button @click="dialogFormVisible = false">
                                            Cancel
                                        </el-button>
                                        <el-button
                                            type="primary"
                                            @click="dialogFormVisible = false"
                                        >
                                            Confirm
                                        </el-button>
                                    </span>
                                </template>
                            </el-dialog>
                        </Card>
                    </Col>
                    <Col :span="8">
                        <Card title="Motify risk" :bordered="false">
                            <p>card content</p>
                            <el-button text @click="dialogFormVisible = true">Setting</el-button>

                            <el-dialog
                                v-model="dialogFormVisible"
                                title="Parameters for Autoimmune"
                            >
                                <el-form :model="form">
                                    <el-form-item
                                        label="Promotion name"
                                        :label-width="formLabelWidth"
                                    >
                                        <el-input v-model="immuneparameter1" />
                                    </el-form-item>
                                    <el-form-item label="Zones" :label-width="formLabelWidth">
                                        <el-select
                                            v-model="immuneparameter2"
                                            placeholder="Please select a zone"
                                        >
                                            <el-option label="Zone No.1" value="1" />
                                            <el-option label="Zone No.2" value="2" />
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                                <template #footer>
                                    <span class="dialog-footer">
                                        <el-button @click="dialogFormVisible = false">
                                            Cancel
                                        </el-button>
                                        <el-button
                                            type="primary"
                                            @click="dialogFormVisible = false"
                                        >
                                            Confirm
                                        </el-button>
                                    </span>
                                </template>
                            </el-dialog>
                        </Card>
                    </Col>
                    <Col :span="8">
                        <Card title="RNA secondary" :bordered="false">
                            <p>card content</p>
                            <el-button text @click="dialogFormVisible = true">Setting</el-button>

                            <el-dialog
                                v-model="dialogFormVisible"
                                title="Parameters for Autoimmune"
                            >
                                <el-form :model="form">
                                    <el-form-item
                                        label="Promotion name"
                                        :label-width="formLabelWidth"
                                    >
                                        <el-input v-model="immuneparameter1" />
                                    </el-form-item>
                                    <el-form-item label="Zones" :label-width="formLabelWidth">
                                        <el-select
                                            v-model="immuneparameter2"
                                            placeholder="Please select a zone"
                                        >
                                            <el-option label="Zone No.1" value="1" />
                                            <el-option label="Zone No.2" value="2" />
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                                <template #footer>
                                    <span class="dialog-footer">
                                        <el-button @click="dialogFormVisible = false">
                                            Cancel
                                        </el-button>
                                        <el-button
                                            type="primary"
                                            @click="dialogFormVisible = false"
                                        >
                                            Confirm
                                        </el-button>
                                    </span>
                                </template>
                            </el-dialog>
                        </Card>
                    </Col>
                </Row>
            </div>
        </el-form-item>
    </el-form>
    <div class="mt-15 flex flex-row justify-center">
        <el-button
            size="large"
            color="#34498E"
            :width="70"
            class="text-white hover:text-white focus:text-white active:text-white text-2xl"
            @click="submit"
        >
            Submit
        </el-button>
        <el-button
            size="large"
            color="#34498E"
            :width="70"
            class="text-white hover:text-white focus:text-white active:text-white text-2xl"
            @click="reset"
        >
            reset
        </el-button>
        <el-button
            size="large"
            color="#34498E"
            :width="70"
            class="text-white hover:text-white focus:text-white active:text-white text-2xl"
            @click="rundemo"
        >
            rundemo
        </el-button>
    </div>
    <template>
        <div style="height: 300px">
            <el-steps direction="vertical" :active="1">
                <el-step title="Step 1" />
                <el-step title="Step 2" />
                <el-step title="Step 3" />
            </el-steps>
        </div>
    </template>
</template>
<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import { reactive, ref } from 'vue'
// import ElementUI from 'element-ui'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Card from './module.vue'
import Row from './Row.vue'
import Col from './Column.vue'
// import Autoimmune from './Autoimmune.vue'
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})

const fileList = ref<UploadFileInfo[]>([])
const submitfile = ref<File>()
const inputtype = ref('upload')
const pastefile = ref('')
const jobtitle = ref('')
const immuneparameter1 = ref('')
const immuneparameter2 = ref('')
const pagevalue = ref(1)
const pageSize = ref(10)
// const router = useRouter()
// const select = ref('')

const searchQuery = ref('')
const selectedCategory = ref('all')
const loading = ref(false)

const router = useRouter()
const Antigendata = ref()
const caiWeight = ref('')
const codonUsage = ref('')
const golinearresult = () => {
    router.push({ path: '/linear_result', query: { UniProtID: searchQuery.value } })
}

console.log(searchQuery.value)
const performSearch = async () => {
    loading.value = true
    // const response = await axios.get(`/${dataset.value}/`, {
    const response = await axios.get(`/TAntigens/search/?UniProtID=${searchQuery.value}`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    console.log(Antigendata.value)
    console.log(Antigendata.value[0].Antigensequence)
    pastefile.value = data[0].Antigensequence
    loading.value = false
}

const fillSequence = (sequence: string) => {
    pastefile.value = sequence
}

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
    } /* else if (data.length === 1) {
        submitfile.value = data[0].file
        fileList.value[0] = data[0]
    } */
}
const remove = () => {
    submitfile.value = undefined
    fileList.value.pop()
}
</script>
