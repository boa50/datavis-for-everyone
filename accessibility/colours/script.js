import { getChart } from "../../components/utils.js"
import { addChart } from "./column-chart.js"

const getData = () =>
    d3.csv('../data/average-surface-temperature.csv')
        .then(d => d.map(v => { return { ...v, month: +v.month, temperature: +v.temperature } }))

const getChartByNumber = number => {
    return getChart(
        `chart${number}`,
        document.getElementById(`chart${number}-container`).offsetWidth,
        document.getElementById(`chart${number}-container`).offsetHeight - document.getElementById(`chart${number}-title`).offsetHeight,
        {
            left: 64,
            right: 16,
            top: 24,
            bottom: 56
        }
    )
}

getData().then(data => {
    addChart(
        getChartByNumber(1),
        data,
        'rgb'
    )

    addChart(
        getChartByNumber(3),
        data,
        'accessible'
    )
})