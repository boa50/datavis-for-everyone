import { getChart, getMargin } from "../node_modules/visual-components/index.js"
import { addChart as addBar } from "./charts/bar-expectancy-by-gender.js"
import { addChart as addLine } from "./charts/line-life-expectancy-gap.js"
import { addChart as addScatter } from "./charts/scatter-expectancy-distribution.js"

const getData = () =>
    d3.csv('data/life-expectancy.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                female: +v.female,
                male: +v.male,
                average: (+v.female + +v.male) / 2,
                gap: Math.abs(+v.female - +v.male)
            }
        }))

const addChartContainer = (idNum, chartTitle = '') => {
    const chartId = `chart${idNum}`

    d3
        .select('#charts')
        .append('div')
        .attr('class', 'bg-neutral-50 px-4 py-2 rounded-sm')
        .append('div')
        .attr('id', `${chartId}-container`)
        .attr('class', 'aspect-[4/3] md:aspect-video')
        .call(g =>
            g
                .append('h3')
                .attr('id', `${chartId}-title`)
                .attr('class', 'text-sm md:text-base text-gray-700 font-medium')
                .text(chartTitle)
        )
        .call(g =>
            g
                .append('svg')
                .attr('id', chartId)
        )

    return chartId
}

const barChartId = addChartContainer(1, 'Life expectancy by Country by Gender')
const lineChartId = addChartContainer(2, 'Life expectancy gap by Country per Year')
const scatterChartId = addChartContainer(3, 'Life expectancy distribution')

const getChartDimensions = ({
    sm = { width: 420, scale: 1.45 },
    md = { width: 420, scale: 1.45 },
    lg = { width: 700, scale: 1.9 },
    xl = { width: 622, scale: 1.9 },
    xl2 = { width: 875, scale: 1.9 }
}) => {
    let chartWidth, chartHeight, scale

    if (window.matchMedia("(max-width: 639px)").matches) {
        chartWidth = sm.width
        scale = sm.scale
    } else if (window.matchMedia("(max-width: 767px)").matches) {
        chartWidth = md.width
        scale = md.scale
    } else if (window.matchMedia("(max-width: 1279px)").matches) {
        chartWidth = lg.width
        scale = lg.scale
    } else if (window.matchMedia("(max-width: 1535px)").matches) {
        chartWidth = xl.width
        scale = xl.scale
    } else {
        chartWidth = xl2.width
        scale = xl2.scale
    }

    chartHeight = chartWidth / scale

    return { chartWidth, chartHeight }
}

getData().then(data => {
    const { chartWidth, chartHeight } = getChartDimensions({})

    addBar(
        getChart({
            id: barChartId,
            chartWidth,
            chartHeight,
            margin: getMargin({ left: 140, top: 24 })
        }),
        data.filter(d => d.year === '2021')
    )

    addLine(
        getChart({
            id: lineChartId,
            chartWidth,
            chartHeight,
            margin: getMargin({ top: 24 })
        }),
        data
    )

    addScatter(
        getChart({
            id: scatterChartId,
            chartWidth,
            chartHeight,
        }),
        data
    )
})