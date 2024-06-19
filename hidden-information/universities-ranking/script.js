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

    // Filling the select box with all countries names
    const countrySelector = document.getElementById('chart-country')
    const allCountries = [...new Set(data.map(d => d['Location']))].sort()
    countrySelector.innerHTML = [
        `<option value="All">All</option>`,
        ...allCountries.map(country => `<option value="${country}">${country}</option>`)
    ]

    countrySelector.addEventListener('change', event => {
        const country = event.target.value

        if (event.target.value !== 'All') {
            updateChart(chartProps, getUpdatedData().filter(d => d['Location'] === country))
        } else {
            updateChart(chartProps, getUpdatedData())
        }
    })
})