import { getChart, getMargin, getChartDimensions, appendChartContainer } from "../../node_modules/visual-components/index.js"
import { addChart as addColumn } from "./charts/column.js"

const getData = () =>
    d3.csv('../data/renewables-generation.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                year: +v.year,
                generation: +v.generation
            }
        }))

const columnId = appendChartContainer({ idNum: 1, chartTitle: 'Column' })
const columnPattern = appendChartContainer({ idNum: 2, chartTitle: 'Column Pattern' })
appendChartContainer({ idNum: 10, chartTitle: 'Stacked Area' })
appendChartContainer({ idNum: 20, chartTitle: 'Stacked Area Pattern' })
appendChartContainer({ idNum: 100, chartTitle: 'Pie' })
appendChartContainer({ idNum: 200, chartTitle: 'Pie Pattern' })
appendChartContainer({ idNum: 3, chartTitle: 'Line' })
appendChartContainer({ idNum: 4, chartTitle: 'Line Shape' })
appendChartContainer({ idNum: 30, chartTitle: 'Area' })
appendChartContainer({ idNum: 40, chartTitle: 'Area Shape' })
appendChartContainer({ idNum: 5, chartTitle: 'Line' })
appendChartContainer({ idNum: 6, chartTitle: 'Line Dashed with dots' })

getData().then(data => {
    addColumn(
        getChart({ id: columnId, margin: getMargin({ left: 72, top: 24 }) }),
        data.filter(d => [2022, 2023].includes(d.year))
    )
})