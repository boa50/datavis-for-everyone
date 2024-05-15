import { getChart } from "../../components/utils.js"
import { addChart } from "./column.js"

const getData = () =>
    d3.csv('../data/average-surface-temperature.csv')
        .then(d => d.map(v => { return { ...v, month: +v.month, temperature: +v.temperature } }))

getData().then(data => {
    addChart(
        getChart(
            'chart1',
            document.getElementById('chart1-container').offsetWidth,
            document.getElementById('chart1-container').offsetHeight
        ),
        data
    )
})