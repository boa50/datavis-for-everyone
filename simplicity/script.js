import { getChart, getMargin, getChartDimensions, appendChartContainer } from "../node_modules/visual-components/index.js"
import { addChart } from "./line.js"

const getData = () =>
    d3.csv('data/gdp-per-capita.csv')
        .then(d => d.map(v => { return { ...v, gdpPerCapita: +v.gdpPerCapita } }))


const allColouredId = appendChartContainer({ idNum: 1, chartTitle: 'Everything coloured' })
const allSingleFocusedId = appendChartContainer({ idNum: 2, chartTitle: 'Focusing only on one line and the others gray' })
appendChartContainer({ idNum: 3, chartTitle: 'A small number of countries selected and the one in focus' })
appendChartContainer({ idNum: 4, chartTitle: 'A country in focus and the others as an aggregation by continent' })
appendChartContainer({ idNum: 5, chartTitle: 'The aggregated countries with gray colour' })
appendChartContainer({ idNum: 6, chartTitle: 'Put the labels on the lines' })
appendChartContainer({ idNum: 7, chartTitle: 'Add a message to specific data points' })


getData().then(data => {
    const dafaultMargin = getMargin({ left: 86 })

    addChart(
        getChart({
            id: allColouredId,
            chartDimensions: getChartDimensions({ chartId: allColouredId }),
            margin: dafaultMargin
        }),
        data.filter(d => d.group === "country")
    )

    addChart(
        getChart({
            id: allSingleFocusedId,
            chartDimensions: getChartDimensions({ chartId: allSingleFocusedId }),
            margin: dafaultMargin
        }),
        data.filter(d => d.group === "country"),
        "Croatia"
    )
})