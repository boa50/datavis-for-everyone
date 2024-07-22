import { getChart, appendChartContainer, getMargin } from "../node_modules/visual-components/index.js"
import { addChart as addColumn } from "./charts/column.js"
import { addChart as addChoropleth } from "./charts/choropleth.js"

const getData = () =>
    Promise.all([
        d3.json('../_data/world.geojson'),
        d3.csv("../_data/gdp-per-capita.csv")
            .then(d => d.map(v => { return { ...v, gdpPerCapita: +v.gdpPerCapita } }))
    ])


const columnId = appendChartContainer({ idNum: 1, chartTitle: "Column to Choropleth" })
const choroplethId = appendChartContainer({ idNum: 10, chartTitle: "Choropleth" })

getData().then(datasets => {
    const geoData = datasets[0]
    const gdpPerCapitaData = datasets[1]

    addColumn(
        getChart({ id: columnId, margin: getMargin({ left: 52, bottom: 32 }) }),
        gdpPerCapitaData.filter(d => d.year === "2021")
    )

    addChoropleth(
        getChart({ id: choroplethId, margin: getMargin({ left: 0, right: 0, top: 8, bottom: 8 }) }),
        gdpPerCapitaData.filter(d => d.year === "2021"),
        geoData
    )
})