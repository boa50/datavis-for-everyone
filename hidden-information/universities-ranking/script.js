import { getChart, getMargin } from '../../node_modules/visual-components/index.js'
import { addChart, updateChart } from './bar.js'

const variables = [
    'Academic Reputation',
    'Employer Reputation',
    'Faculty Student',
    'Citations per Faculty',
    'International Faculty',
    'International Students',
    'International Research Network',
    'Employment Outcomes',
    'Sustainability'
]

const getData = () =>
    d3.csv('./data/universities-ranking-2025.csv')
        .then(d => d.map(v => {
            variables.forEach(a => { v[a] = +v[a].replace(',', '.') })

            return {
                ...v,
                'Overall': +v['Overall'].replace(',', '.')
            }
        }))

const weights = {
    'Academic Reputation': 0.3,
    'Employer Reputation': 0.15,
    'Faculty Student': 0.1,
    'Citations per Faculty': 0.2,
    'International Faculty': 0.05,
    'International Students': 0.05,
    'International Research Network': 0.05,
    'Employment Outcomes': 0.05,
    'Sustainability': 0.05
}

const recalculateOverall = d =>
    variables.reduce((total, v) => total + (d[v] * weights[v]), 0)
    / Object.values(weights).reduce((total, current) => total + current)

// Getting controls objects
const controls = {}
variables.forEach(v => { controls[v] = document.getElementById(toCamelCase(v)) })

// Setting initial values
variables.forEach(v => { controls[v].value = weights[v] * 100 })

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

    variables.forEach(v => {
        controls[v].addEventListener('change', event => {
            weights[v] = event.target.value / 100

            updateChart(chartProps, getUpdatedData())
        })
    })
})


// Function to convert into camel Case; based on: https://www.geeksforgeeks.org/how-to-convert-string-to-camel-case-in-javascript/
function toCamelCase(str) {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}