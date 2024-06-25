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
                .attr('class', 'text-base text-gray-700 font-medium')
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


const getChart2 = ({
    id,
    svgWidth,
    svgHeight,
    margin = getMargin({})
}) => {
    if (svgWidth === undefined)
        svgWidth = document.getElementById(`${id}-container`).offsetWidth
    if (svgHeight === undefined) {
        const title = document.getElementById(`${id}-title`)
        svgHeight = document.getElementById(`${id}-container`).offsetHeight - (title ? title.offsetHeight : 0)
    }

    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom

    const chart = d3
        .select(`#${id}`)
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('viewBox', `0 0  ${800 + margin.left + margin.right} ${450 + margin.top + margin.bottom}`)
        .attr('preserveAspectRatio', 'xMinYMid meet')
        .append('g')
        .attr('id', `${id}-main-g`)
        .attr('transform', `translate(${[margin.left, margin.top]})`)

    return { chart, width, height, margin }
}

getData().then(data => {
    const chartProps = getChart2({
        id: barChartId,
        margin: getMargin({ left: 140, top: 24 })
    })

    addBar(
        { chart: chartProps.chart, width: 800, height: 450, margin: chartProps.margin },
        data.filter(d => d.year === '2021')
    )

    addLine(
        getChart({
            id: lineChartId,
            margin: getMargin({ top: 24 })
        }),
        data
    )

    addScatter(
        getChart({
            id: scatterChartId
        }),
        data
    )
})