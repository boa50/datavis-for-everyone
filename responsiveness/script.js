import { getChart, getMargin, appendChartContainer } from "../node_modules/visual-components/index.js"
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

const barChartId = appendChartContainer({ idNum: 1, chartTitle: 'Life expectancy by Country by Gender' })
const lineChartId = appendChartContainer({ idNum: 2, chartTitle: 'Life expectancy gap by Country per Year' })
const scatterChartId = appendChartContainer({ idNum: 3, chartTitle: 'Life expectancy distribution' })

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
        getChart({
            id: scatterChartId
        }),
        data
    )
})