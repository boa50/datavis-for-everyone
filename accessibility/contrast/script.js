import { getChart, getMargin } from "../../node_modules/visual-components/index.js"
import { addChart } from "./line-chart.js"

const getData = () =>
    d3.csv('../data/average-surface-temperature.csv')
        .then(d => d.map(v => { return { ...v, month: +v.month, temperature: +v.temperature } }))

const getChartByNumber = number => {
    return getChart({
        id: `chart${number}`,
        margin: getMargin({ top: 24 })
    })
}

getData().then(data => {
    addChart(getChartByNumber(1), data)
})