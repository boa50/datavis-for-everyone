import { getChart, getMargin } from '../../node_modules/visual-components/index.js'
import { addChart } from './line-chart.js'

const getData = () =>
    d3.csv('../data/renewables-generation.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                year: +v.year,
                generation: +v.generation
            }
        }))

const getChartByNumber = number => {
    return getChart({
        id: `chart${number}`,
        margin: getMargin({ top: 40, left: 72, bottom: 32 })
    })
}

getData().then(data => {
    addChart(getChartByNumber(1), data)
    addChart(getChartByNumber(2), data, 'bad', 'bad')

    addChart(getChartByNumber(3), data, 'bad', 'bad')
    addChart(getChartByNumber(4), data, 'bad', 'bad')

    addChart(getChartByNumber(5), data, 'good', 'bad')
    addChart(getChartByNumber(6), data, 'excellent', 'bad')

    addChart(getChartByNumber(7), data, 'excellent', 'good')
    addChart(getChartByNumber(8), data, 'excellent', 'excellent')

    addChart(getChartByNumber(9), data, 'excellent', 'goodBetween')
    addChart(getChartByNumber(10), data, 'excellent', 'excellentBetween')
})