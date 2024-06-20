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

const countrySelector = document.getElementById('chart-country')
const sortingSelector = document.getElementById('chart-sorting')

const sortData = (data, sorting) =>
    sorting === 'asc' ?
        data.sort((a, b) => a['Overall'] - b['Overall']) :
        data.sort((a, b) => b['Overall'] - a['Overall'])

getData().then(data => {
    const getUpdatedData = (country, sorting) => {
        let updatedData = data.map(d => {
            return {
                ...d,
                'Overall': recalculateOverall(d)
            }
        })

        if (![undefined, 'All'].includes(country)) {
            updatedData = updatedData.filter(d => d['Location'] === country)
        } else if (!['All', ''].includes(countrySelector.value)) {
            updatedData = updatedData.filter(d => d['Location'] === countrySelector.value)
        }

        if (sorting !== undefined) {
            updatedData = sortData(updatedData, sorting)
        } else {
            updatedData = sortData(updatedData, sortingSelector.value)
        }

        return updatedData
    }

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
    const allCountries = [...new Set(data.map(d => d['Location']))].sort()
    countrySelector.innerHTML = [
        `<option value="All">All</option>`,
        ...allCountries.map(country => `<option value="${country}">${country}</option>`)
    ]

    countrySelector.addEventListener('change', event => {
        updateChart(chartProps, getUpdatedData(event.target.value))
    })

    // Controlling the change of the Sort control
    sortingSelector.addEventListener('change', event => {
        updateChart(chartProps, getUpdatedData(undefined, event.target.value))
    })
})