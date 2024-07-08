import { getChart, getMargin, getChartDimensions, appendChartContainer } from "../../node_modules/visual-components/index.js"
import { addChart as addColumn } from "./charts/column.js"
import { addChart as addStackedArea } from "./charts/stacked-area.js"
import { addChart as addPie } from "./charts/pie.js"
import { addChart as addLine } from "./charts/line.js"

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
const columnPatternId = appendChartContainer({ idNum: 2, chartTitle: 'Column Pattern' })
const stackedAreaId = appendChartContainer({ idNum: 10, chartTitle: 'Stacked Area' })
const stackedAreaPatternId = appendChartContainer({ idNum: 20, chartTitle: 'Stacked Area Pattern' })
const pieId = appendChartContainer({ idNum: 100, chartTitle: 'Pie' })
const piePatternId = appendChartContainer({ idNum: 200, chartTitle: 'Pie Pattern' })
const lineId = appendChartContainer({ idNum: 3, chartTitle: 'Line' })
const lineShapesId = appendChartContainer({ idNum: 4, chartTitle: 'Line Shape' })
const stackedAreaId2 = appendChartContainer({ idNum: 30, chartTitle: 'Area' })
const stackedAreaShapesId = appendChartContainer({ idNum: 40, chartTitle: 'Area Shape' })
const lineId2 = appendChartContainer({ idNum: 5, chartTitle: 'Line' })
const lineDashedId = appendChartContainer({ idNum: 6, chartTitle: 'Line Dashed with dots' })

getData().then(data => {
    includeColumn(columnId, data)
    includeColumn(columnPatternId, data, null, true)

    includeStackedArea(stackedAreaId, data)
    includeStackedArea(stackedAreaPatternId, data, null, true)

    includePie(pieId, data)
    includePie(piePatternId, data, null, true)

    includeLine(lineId, data)
    includeLine(lineShapesId, data, null, true)

    includeStackedArea(stackedAreaId2, data)
    includeStackedArea(stackedAreaShapesId, data, null, false, true)

    includeLine(lineId2, data)
    includeLine(lineDashedId, data, null, false, true)
})


function includeColumn(id, data, palette = null, pattern = false) {
    addColumn(
        getChart({
            id: id,
            chartDimensions: getChartDimensions({ chartId: id }),
            margin: getMargin({ left: 72, top: 24 })
        }),
        data.filter(d => [2022, 2023].includes(d.year)),
        palette,
        pattern
    )
}

function includeStackedArea(id, data, palette = null, pattern = false, shapes = false) {
    addStackedArea(
        getChart({
            id: id,
            chartDimensions: getChartDimensions({ chartId: id }),
            margin: getMargin({ left: 72, top: 24 })
        }),
        data.filter(d => [2019, 2020, 2021, 2022, 2023].includes(d.year)),
        palette,
        pattern,
        shapes
    )
}

function includePie(id, data, palette = null, pattern = false) {
    addPie(
        getChart({
            id: id,
            chartDimensions: getChartDimensions({ chartId: id }),
            margin: { left: 0, right: 0, top: 8, bottom: 8 }
        }),
        data.filter(d => d.year === 2023),
        palette,
        pattern
    )
}

function includeLine(id, data, palette = null, shapes = false, dashed = false) {
    addLine(
        getChart({
            id: id,
            chartDimensions: getChartDimensions({ chartId: id }),
            margin: getMargin({ left: 72, top: 24 })
        }),
        data.filter(d => [2019, 2020, 2021, 2022, 2023].includes(d.year)),
        palette,
        shapes,
        dashed
    )
}