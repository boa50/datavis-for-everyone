import { getChart, getMargin } from '../../node_modules/visual-components/index.js'
import { paletteDarkBg } from '../../colours.js'
import { addChart as addLine } from './charts/line.js'
import { addChart as addColumn } from './charts/column.js'
import { addChart as addHeatmap } from './charts/heatmap.js'
import { addChart as addLinedBubbles } from './charts/lined-bubbles.js'

const getData = () =>
    d3.csv('../data/education-investing.csv')
        .then(d => d.map(v => { return { ...v, expenditureShare: +v.expenditureShare } }))


getData().then(data => {
    const countryColour = d3
        .scaleOrdinal()
        .domain(['Kenya', 'Finland', 'Brazil'])
        .range([paletteDarkBg.amber, paletteDarkBg.blue, paletteDarkBg.vermillion])
    const countryOrder = ['Finland', 'Brazil', 'Kenya']

    data = data
        .filter(d => ['Finland', 'Brazil', 'Kenya'].includes(d.country))
        .sort((a, b) => countryOrder.indexOf(a.country) - countryOrder.indexOf(b.country))

    addLine(
        getChart({
            id: 'chart1',
            margin: getMargin({ right: 80, top: 16 }),
            chartDimensions: {}
        }),
        // data,
        data.filter(d => ['Kenya'].includes(d.country)),
        countryColour
    )

    addColumn(
        getChart({
            id: 'chart2',
            margin: getMargin({ top: 30 }),
            chartDimensions: {}
        }),
        data,
        countryColour
    )

    addHeatmap(
        getChart({
            id: 'chart3',
            margin: getMargin({ left: 32, top: 128, bottom: 128 }),
            chartDimensions: {}
        }),
        data,
        countryColour
    )

    addLinedBubbles(
        getChart({
            id: 'chart4',
            margin: getMargin({ left: 128, bottom: 86, top: 86, right: 128 }),
            chartDimensions: {}
        }),
        data.filter(d => d.year >= 2010),
        countryColour
    )
})