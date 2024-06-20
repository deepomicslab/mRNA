<template>
    <div>
        <div>
            <iframe :src="url" scrolling="auto" frameborder="no" class="w-full h-106" />
        </div>
    </div>
</template>

<script setup lang="ts">
const FornaContainer = require('../../../../fornac/dist/fornac.js');
//import jquery from 'jquery';
//import d3 from 'd3';
//import FornaContainer from '../../../../fornac/dist/fornac.js';
const container = new FornaContainer("#rna_ss", { applyForce: false });
const options = {
    structure: '((..((....)).(((....))).))',
    sequence: 'CGCUUCAUAUAAUCCUAAUGACCUAU',
}

const url = computed(() => {
    return `http://nibiru.tbi.univie.ac.at/forna/forna.html?id=url/name&structure=${options.structure}&sequence=${options.sequence}`
})
</script>
