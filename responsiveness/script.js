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

getData().then(data => {
    addBar(
        getChart({
            id: barChartId,
            margin: getMargin({ left: 140, top: 24 })
        }),
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
        getChart({ id: scatterChartId }),
        data
    )
})