import { getChart, appendChartContainer } from "../node_modules/visual-components/index.js"
import { addChart as addColumn } from "./charts/column.js"

const getData = () =>
    d3.csv("../_data/gdp-per-capita.csv")
        .then(d => d.map(v => { return { ...v, gdpPerCapita: +v.gdpPerCapita } }))


const columnId = appendChartContainer({ idNum: 1, chartTitle: "Column to Choropleth" })
appendChartContainer({ idNum: 10, chartTitle: "Choropleth" })

getData().then(data => {
    addColumn(
        getChart({ id: columnId }),
        data.filter(d => d.year === "2021")
    )
})