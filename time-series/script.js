import { getChart, getMargin } from '../node_modules/visual-components/index.js'
import { palette } from '../colours.js'
import { addChart as addLine } from './charts/line.js'
import { addChart as addColumn } from './charts/column.js'
import { addChart as addHeatmap } from './charts/heatmap.js'
import { addChart as addLinedBubbles } from './charts/lined-bubbles.js'

const getData = () =>
    d3.csv('data/education-investing.csv')
        .then(d => d.map(v => { return { ...v, expenditureShare: +v.expenditureShare } }))


getData().then(data => {
    const countryColour = d3
        .scaleOrdinal()
        .domain(['Kenya', 'Finland', 'Brazil', 'Canada', 'New Zealand', 'Japan'])
        .range([palette.orange, palette.skyBlue, palette.bluishGreen, palette.reddishPurple, palette.blue, palette.vermillion])
    const countryOrder = ['Finland', 'Brazil', 'New Zealand', 'Canada', 'Kenya', 'Japan']

    data.sort((a, b) => countryOrder.indexOf(a.country) - countryOrder.indexOf(b.country))

    addLine(
        getChart({
            id: 'chart1',
            margin: getMargin({ right: 80, top: 16 })
        }),
        data,
        countryColour
    )

    addColumn(
        getChart({
            id: 'chart2',
            margin: getMargin({ top: 30 })
        }),
        data,
        countryColour
    )

    addHeatmap(
        getChart({
            id: 'chart3',
            margin: getMargin({ left: 112, bottom: 64 })
        }),
        data,
        countryColour
    )

    addLinedBubbles(
        getChart({
            id: 'chart4',
            margin: getMargin({ left: 100, bottom: 64, top: 24, right: 140 })
        }),
        data,
        countryColour
    )
})