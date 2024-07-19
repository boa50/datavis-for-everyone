import { getChart, appendChartContainer } from "../node_modules/visual-components/index.js"

const getData = () =>
    d3.csv("../_data/gdp-per-capita.csv")

appendChartContainer({ idNum: 1, chartTitle: "Bar to Choropleth" })
appendChartContainer({ idNum: 10, chartTitle: "Choropleth" })

getData().then(data => {
    console.log(data);
})