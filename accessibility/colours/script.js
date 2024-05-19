import { getChart, getMargin } from "../../node_modules/visual-components/index.js"
import { addChart } from "./column-chart.js"

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
    addChart(getChartByNumber(1), data, 'rgb')
    addChart(getChartByNumber(2), data, 'rgb-protanopia')
    addChart(getChartByNumber(3), data, 'rgb-deuteranopia')
    addChart(getChartByNumber(4), data, 'rgb-tritanopia')

    addChart(getChartByNumber(5), data, 'accessible')
    addChart(getChartByNumber(6), data, 'accessible-protanopia')
    addChart(getChartByNumber(7), data, 'accessible-deuteranopia')
    addChart(getChartByNumber(8), data, 'accessible-tritanopia')
})