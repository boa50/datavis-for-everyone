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
appendChartContainer({ idNum: 5, chartTitle: 'Line' })
appendChartContainer({ idNum: 6, chartTitle: 'Line Dashed with dots' })

getData().then(data => {
    addColumn(
        getChart({
            id: columnId,
            chartDimensions: getChartDimensions({ chartId: columnId }),
            margin: getMargin({ left: 72, top: 24 })
        }),
        data.filter(d => [2022, 2023].includes(d.year))
    )

    addColumn(
        getChart({
            id: columnPatternId,
            chartDimensions: getChartDimensions({ chartId: columnPatternId }),
            margin: getMargin({ left: 72, top: 24 })
        }),
        data.filter(d => [2022, 2023].includes(d.year)),
        true
    )

    addStackedArea(
        getChart({
            id: stackedAreaId,
            chartDimensions: getChartDimensions({ chartId: stackedAreaId }),
            margin: getMargin({ left: 72, top: 24 })
        }),
        data.filter(d => [2019, 2020, 2021, 2022, 2023].includes(d.year))
    )

    addStackedArea(
        getChart({
            id: stackedAreaPatternId,
            chartDimensions: getChartDimensions({ chartId: stackedAreaPatternId }),
            margin: getMargin({ left: 72, top: 24 })
        }),
        data.filter(d => [2019, 2020, 2021, 2022, 2023].includes(d.year)),
        true
    )

    addPie(
        getChart({
            id: pieId,
            chartDimensions: getChartDimensions({ chartId: pieId }),
            margin: { left: 0, right: 0, top: 8, bottom: 8 }
        }),
        data.filter(d => d.year === 2023)
    )

    addPie(
        getChart({
            id: piePatternId,
            chartDimensions: getChartDimensions({ chartId: piePatternId }),
            margin: { left: 0, right: 0, top: 8, bottom: 8 }
        }),
        data.filter(d => d.year === 2023),
        true
    )

    addLine(
        getChart({
            id: lineId,
            chartDimensions: getChartDimensions({ chartId: lineId }),
            margin: getMargin({ left: 72, top: 24 })
        }),
        data.filter(d => [2019, 2020, 2021, 2022, 2023].includes(d.year))
    )

    addLine(
        getChart({
            id: lineShapesId,
            chartDimensions: getChartDimensions({ chartId: lineShapesId }),
            margin: getMargin({ left: 72, top: 24 })
        }),
        data.filter(d => [2019, 2020, 2021, 2022, 2023].includes(d.year)),
        true
    )

    addStackedArea(
        getChart({
            id: stackedAreaId2,
            chartDimensions: getChartDimensions({ chartId: stackedAreaId2 }),
            margin: getMargin({ left: 72, top: 24 })
        }),
        data.filter(d => [2019, 2020, 2021, 2022, 2023].includes(d.year))
    )

    addStackedArea(
        getChart({
            id: stackedAreaShapesId,
            chartDimensions: getChartDimensions({ chartId: stackedAreaShapesId }),
            margin: getMargin({ left: 72, top: 24 })
        }),
        data.filter(d => [2019, 2020, 2021, 2022, 2023].includes(d.year)),
        false,
        true
    )
})