import { getChart, appendChartContainer, getMargin } from "../node_modules/visual-components/index.js"
import { addChart as addColumn } from "./charts/column.js"
import { addChart as addChoropleth } from "./charts/choropleth.js"
import { addChart as addHeatmap } from "./charts/heatmap.js"

const getData = () =>
    Promise.all([
        d3.json('../_data/world.geojson'),
        d3.csv("../_data/gdp-per-capita.csv")
            .then(d => d.map(v => { return { ...v, gdpPerCapita: +v.gdpPerCapita } })),
        d3.csv('../_data/random-geo.csv')
            .then(d => d.map(v => {
                return {
                    latitude: +v.latitude,
                    longitude: +v.longitude,
                    latitude_grp: Math.floor(+v.latitude / 10) * 10,
                    longitude_grp: Math.floor(+v.longitude / 10) * 10
                }
            }))
    ])


const columnId = appendChartContainer({ idNum: 1, chartTitle: "Column to Choropleth" })
const choroplethId = appendChartContainer({ idNum: 10, chartTitle: "Choropleth" })
const heatmapId = appendChartContainer({ idNum: 2, chartTitle: "Heatmap to Points" })

getData().then(datasets => {
    const geoData = datasets[0]
    const gdpPerCapitaData = datasets[1]
    const randomGeo = datasets[2]

    addColumn(
        getChart({ id: columnId, margin: getMargin({ left: 80, bottom: 32 }) }),
        gdpPerCapitaData.filter(d => d.year === "2021")
    )

    addChoropleth(
        getChart({ id: choroplethId, margin: getMargin({ left: 0, right: 0, top: 8, bottom: 8 }) }),
        gdpPerCapitaData.filter(d => d.year === "2021"),
        geoData
    )

    addHeatmap(
        getChart({ id: heatmapId, margin: getMargin({ left: 64, bottom: 50 }) }),
        randomGeo
    )
})