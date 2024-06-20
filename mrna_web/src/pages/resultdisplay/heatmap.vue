<template>
    <div class="h-140">
        <p>heatmap</p>
        <svg id="Viz_area" :height="Height" :width="Width"></svg>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable */
import * as d3 from 'd3'

//import _ from 'lodash'
//import { TypeDict, proteinType } from '@/utils/annotation'
//import { usePhageStore } from '@/store/phage'

//const phageStore = usePhageStore()

const Width = ref(1000)
const Height = ref(700)
const width = ref(700)
const height = ref(500)
const leftMargin = ref(200)
const rightMargin = ref(200)
const topMargin = ref(30)
const bottomMargin = ref(500)

const demodata = [[1,0.1,0.4,0.5,0.3,0.9,0.4,0.3,0.2,0.9,0.3],[2,0.3,0.2,0.1,0.9,0.5,0.2,0.4,0.1,0.5,0.2],[3,0.5,0.3,0.8,0.9,0.8,0.5,0.1,0.8,0.4,0.7],
[4,0.4,0.8,0.4,0.8,0.1,0.3,0.7,0.5,0.3,0.9],[5,0.9,0.7,0.4,0.7,0.4,0.9,0.8,0.3,0.1,0.2]]
const parameterclass = [
    "Translation Score",
    "Half-Life",
    "Protein Score",
    "RNA  Secondary Structure Metrics",
    "Autoimmune Score",
    "Motif Risk",
    "MHC Affinity",
    "T-Cell Score",
    "B-Cell Score",
    "Enzyme Sites",
]

// Different protein class has different color
const chooseColor = (d: unknown, flag: number) => {
    let color = '';
    // when d is protein_class
    if (flag == 1) {
        switch (d) {
            case 'Translation Score':
                color = '#45bf43';
                break;
            case 'Half-Life':
                color = '#5490F8';
                break;
            case 'Protein Score':
                color = '#29cbce';
                break;
            case 'RNA  Secondary Structure Metrics':
                color = '#DF3AD2';
                break;
            case 'Autoimmune Score':
                color = '#9dc6e7';
                break;
            case 'Motif Risk':
                color = '#0FF0BF';
                break;
            case 'MHC Affinity':
                color = '#9343f0';
                break;
            case 'T-Cell Score':
                color = '#ec364e';
                break;
            case 'B-Cell Score':
                color = '#90ed7d';
                break;
            case 'Enzyme Sites':
                color = '#445d8f';
                break;
            // additional cases for other indices if needed
        }
        return color;
    }
    // when d is final
    switch (d.class) {
        case 'Translation Score':
                color = '#45bf43';
                break;
            case 'Half-Life':
                color = '#5490F8';
                break;
            case 'Protein Score':
                color = '#29cbce';
                break;
            case 'RNA  Secondary Structure Metrics':
                color = '#DF3AD2';
                break;
            case 'Autoimmune Score':
                color = '#9dc6e7';
                break;
            case 'Motif Risk':
                color = '#0FF0BF';
                break;
            case 'MHC Affinity':
                color = '#9343f0';
                break;
            case 'T-Cell Score':
                color = '#ec364e';
                break;
            case 'B-Cell Score':
                color = '#90ed7d';
                break;
            case 'Enzyme Sites':
                color = '#445d8f';
                break;
        // additional cases for other indices if needed
    }
    return color;
};


// const margin = {top: 10, right: 10, bottom: 100, left: 100}

// Labels of columns
// const protein_class = proteinType
// append the svg object to the body of the page
onMounted(() => {const svg = d3
        .select('#Viz_area')
        .append('svg')
        .attr('width', width.value + leftMargin.value + rightMargin.value + 50)
        .attr('height', height.value + topMargin.value + bottomMargin.value)
        .append('g')
        .attr('transform', `translate(${leftMargin.value},${topMargin.value})`)

    // Build X scales and axis:
    const xdomain=[1,2,3,4,5]
    const x = d3
        .scaleBand()
        .range([0, width.value - leftMargin.value])
        .domain(xdomain)
        .padding(0.001)
    let xAix = svg
        .append('g')
        .attr('transform', 'translate(' + leftMargin.value + ',' + height.value + ')')
        .call(d3.axisBottom(x))
    xAix.select('.domain').remove()
    xAix.selectAll('.tick').selectAll('line').remove()
    xAix.selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.5em')
        .attr('dy', '-.8em')
        .attr('transform', 'rotate(-90)')

    // Build the first Y scales and axis:
    const y = d3
        .scaleBand()
        .range([height.value / 2 - 5, 0])
        .domain(parameterclass)
        .padding(0.01)

    const y1 = d3
        .scaleBand()
        .range([height.value, height.value / 2 + 5])
        .domain(parameterclass)
        .padding(0.01)

    // Build the second Y scales and axis:
    let y1Aix = svg
        .append('g')
        .attr('transform', 'translate(' + leftMargin.value + ',' + (height.value / 2 + 5) + ')')
        .call(d3.axisLeft(y))
    y1Aix.select('.domain').remove()
    y1Aix.selectAll('.tick').selectAll('line').remove()
    y1Aix.selectAll('text').attr('transform', 'translate(' + -y.bandwidth() + ',0)')

    y1Aix
        .selectAll('textRec')
        .data(parameterclass)
        .enter()
        .append('rect')
        .attr('x', function (d) {
            return -y.bandwidth()
        })
        .attr('y', function (d) {
            return y(d) + y.bandwidth() / 4
        })
        .style('width', y.bandwidth() / 2)
        .style('height', y.bandwidth() / 2)
        .style('fill', function (d) {
            return chooseColor(d, 1)
        })
    const tooltip = svg.append('svg').attr('height', 100).attr('width', 210).style('opacity', 0)
    tooltip
        .append('rect')
        .attr('x', 0)
        .attr('width', 210)
        .attr('height', 70)
        .style('fill', 'black')
        .style('opacity', 0.8)
    const toolText1 = tooltip
        .append('text')
        .style('fill', 'white')
        .attr('transform', `translate(10,20)`)
        .style('font-size', 12)
    

    // create the black box, emerge when a column is selected
    const myCol = svg
        .append('rect')
        .style('opacity', 0)
        .style('fill-opacity', 0)
        .style('height', height.value/2)
        .style('width', x.bandwidth())
        .style('stroke', 'black')
        .style('stroke-width', '2')
    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function () {
        tooltip.style('opacity', 1)
        myCol.style('opacity', 1)
    }
    const mousemove = function (md: { layerX: number; layerY: number; }, d: { value: any; perc: any; }) {
        svg.selectAll('.myRec').style('opacity', 0.2)
        d3.select(this).style('opacity', 1)
        // console.log(d)
        myCol
            .attr(
                'x',
                Math.floor((md.layerX - 2 * leftMargin.value) / x.bandwidth()) * x.bandwidth() +
                    leftMargin.value
            )
            .attr('y', height.value/2-5)

        tooltip
            .style('opacity', 1)
            .attr('x', md.layerX - leftMargin.value + 30)
            .attr('y', md.layerY - topMargin.value + 30)
        toolText1.text(function () {
            return `The exact value : ${d.value}`
        })
        
    }
    const mouseleave = function () {
        svg.selectAll('.myRec').style('opacity', 1)
        tooltip.style('opacity', 0)
        myCol.style('opacity', 0)
    }
    
        // create a list 'final' in the format {id:Phage_Acession_ID, class: protein_class, value:0, perc:0}
        let final = []
        // console.log(myVars);
        for (let m = 0; m < demodata.length; m++) {
            for (let n = 0; n < demodata[m].length-1; n++) {
                final.push({
                    id: demodata[m][0],
                    class: parameterclass[n],
                    value: demodata[m][n+1],
                })
            }
        }
        // calculate the max value for each row
        //let protein_class_max = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        
        // Build gradient color scale
        let recColor = function (d) {
            //let class_i = _.indexOf(protein_class, d.class)
            let color = chooseColor(d, 0)
            return d3
                .scaleLinear()
                .range(['#F7F7F7', color])
                .domain([0, 1])
        }

        // gradient color rect
        let label = svg
            .append('g')
            .attr('transform', 'translate(20,' + (height.value / 2 + 5) + ')')
        const defs = label.append('defs') //append defs
        const linearGradient = defs
            .selectAll('graDef') //append <linearGradient> in defs
            .data(parameterclass)
            .enter()
            .append('linearGradient')
            .attr('id', function (d) {
                return 'gradient' + d
            })
             //corresponding id "gradient" + the name of the protein class
        linearGradient.append('stop').attr('offset', '0%').attr('stop-color', '#F7F7F7')
        linearGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', function (d) {
                return chooseColor(d, 1)
            })


        // heatmap
        svg.selectAll('myRec')
            .data(final) //, function(d) { return d.class+':'+d.id;})
            .enter()
            .append('rect')
            .attr('class', 'myRec')
            .attr('x', function (d) {
                return x(d.id) + leftMargin.value + 1
            })
            .attr('y', function (d) {
                return y1(d.class)
            })
            .attr('width', x.bandwidth() - 2)
            .attr('height', y1.bandwidth() - 1)
            .style('fill', function (d) {
                return recColor(d)(d.value)
            })
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)
        })


</script>
