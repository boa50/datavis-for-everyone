import { getChart } from "../../components/utils.js"
import { addChart } from "./column-chart.js"

const getData = () =>
    d3.csv('../data/average-surface-temperature.csv')
        .then(d => d.map(v => { return { ...v, month: +v.month, temperature: +v.temperature } }))

getData().then(data => {
    addChart(
        getChart(
            'chart1',
            document.getElementById('chart1-container').offsetWidth,
            document.getElementById('chart1-container').offsetHeight - document.getElementById('chart1-title').offsetHeight,
            {
                left: 64,
                right: 16,
                top: 16,
                bottom: 56
            }
        ),
        data,
        'rgb'
    )

    addChart(
        getChart(
            'chart3',
            document.getElementById('chart3-container').offsetWidth,
            document.getElementById('chart3-container').offsetHeight - document.getElementById('chart3-title').offsetHeight,
            {
                left: 64,
                right: 16,
                top: 16,
                bottom: 56
            }
        ),
        data,
        'accessible'
    )
})