import { getChart, getMargin, addTooltip } from '../../node_modules/visual-components/index.js'
import { variables, weights, setUpControls } from './rankingVariables.js'
import { addChart, updateChart } from './bar.js'

const getData = () =>
    d3.csv('./data/universities-ranking-2025.csv')
        .then(d => d.map(v => {
            variables.forEach(a => { v[a] = +v[a].replace(',', '.') })

            return {
                ...v,
                'Overall': +v['Overall'].replace(',', '.')
            }
        }))

const recalculateOverall = d =>
    variables.reduce((total, v) => total + (d[v] * weights[v]), 0)
    / Object.values(weights).reduce((total, current) => total + current)

const controls = setUpControls()

getData().then(data => {
    const getUpdatedData = () => data.map(d => {
        return {
            ...d,
            'Overall': recalculateOverall(d)
        }
    })
    const chartProps = getChart({
        id: 'chart1',
        margin: getMargin({ left: 376, bottom: 78 })

    })

    addChart(chartProps, getUpdatedData())

    // Setting controls actions
    variables.forEach(v => {
        controls[v].addEventListener('change', event => {
            weights[v] = event.target.value / 100

            updateChart(chartProps, getUpdatedData())
        })
    })
})