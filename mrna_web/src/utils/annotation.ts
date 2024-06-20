import _ from 'lodash'

export const TypeDict = {
    lysis: { color: '#ec364e', abbr: 'Lys', name: 'Lysis' },
    integration: { color: '#9dc6e7', abbr: 'Int', name: 'Integration' },
    replication: { color: '#0FF0BF', abbr: 'Rep', name: 'Replication' },
    tRNA_related: { color: '#90ed7d ', abbr: 'tRNA-related', name: 'tRNA-related' },
    regulation: { color: '#445d8f', abbr: 'Reg', name: 'Regulation' },
    packaging: { color: '#9343f0', abbr: 'Pkg', name: 'Packaging' },
    assembly: { color: '#45bf43', abbr: 'Asm', name: 'Assembly' },
    infection: { color: '#5490F8', abbr: 'Inf', name: 'Infection' },
    immune: { color: '#DF3AD2', abbr: 'Imm', name: 'Immune' },
    mix: { color: '#ff6500', abbr: 'Mix', name: 'Mix' },
    hypothetical: { color: '#29cbce', abbr: 'Hyp', name: 'Hypothetical' },
    unsorted: { color: '#ffa235', abbr: 'Uns', name: 'Unsorted' },
}

export const proteinType = Object.keys(TypeDict)

// export const proteinType = [
//     'hypothetical',
//     'infection',
//     'assembly',
//     'unsorted',
//     'replication',
//     'packaging',
//     'lysis',
//     'regulation',
//     'immune',
//     'integration',
//     'tRNARelated',
//     'mix',
// ]

export const shallowGray = '#dadada'

export const gcTypeDict = {
    content: { color: '#367dd6', name: 'GC Content' },
    plus: { color: '#fb475e', name: 'GC Skew+' },
    minus: { color: '#019992', name: 'GC Skew-' },
}

export const gcType = Object.keys(gcTypeDict)

export const coverageDict = {
    4: { color: '#c4c4c4', text: '<50%' },
    5: { color: '#b1b1b1', text: '>=50%' },
    6: { color: '#a7a7a7', text: '>=60%' },
    7: { color: '#9d9d9d', text: '>=70%' },
    8: { color: '#939393', text: '>=80%' },
    9: { color: '#808080', text: '>=90%' },
}

export const identityDict = {
    4: { color: '#feeff5', text: '< 50%' },
    5: { color: '#fcc2d9', text: '>=50%' },
    6: { color: '#fba9c9', text: '>=60%' },
    7: { color: '#f979ab', text: '>=70%' },
    8: { color: '#f7488c', text: '>=80%' },
    9: { color: '#f5176d', text: '>=90%' },
}

// 计算一个字符串中G和C所占百分比
export const countGC = (stringTxt: string) => {
    const gcNumber = _.countBy(stringTxt.split(''), s => {
        return s === 'G' || s === 'C'
    }).true
    if (Number.isNaN(gcNumber) || typeof gcNumber === 'undefined') return 0
    return gcNumber / stringTxt.length
}

export const countGCSkew = (stringTxt: string) => {
    let gNumber = _.countBy(stringTxt.split(''), s => {
        return s === 'G'
    }).true
    let cNumber = _.countBy(stringTxt.split(''), s => {
        return s === 'C'
    }).true
    if (Number.isNaN(gNumber) || typeof gNumber === 'undefined') {
        gNumber = 0
    }
    if (Number.isNaN(cNumber) || typeof cNumber === 'undefined') {
        cNumber = 0
    }
    if (gNumber + cNumber === 0) return 0
    return (gNumber - cNumber) / (gNumber + cNumber)
}
