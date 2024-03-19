import { getData, updateData, getDataStatistics } from "./data.js"
import { plotHistogram, updateHistogram } from "./charts/histogram.js"

const averageValue = document.getElementById('average-value')
const medianValue = document.getElementById('median-value')
const modeValue = document.getElementById('mode-value')

const nElementsValue = document.getElementById('n-elements-value')
const outlierValue = document.getElementById('outlier-value')
const outlierValueText = document.getElementById('outlier-value-text')


let nElements = 100
let data = getData(nElements, 50, 10)
updateStatistics()

nElementsValue.value = nElements
outlierValue.value = 5000


nElementsValue.addEventListener('change', (event) => {
    nElements = +event.target.value
    data = getData(nElements, 50, 10)

    outlierValue.value = 5000
    outlierValueText.textContent = 'None'

    updateStatistics()
    updateHistogram(data)
})

outlierValue.addEventListener('change', (event) => {
    outlierValueText.textContent = +event.target.value
    updateData(data, +event.target.value, nElements)
    updateStatistics()
    updateHistogram(data)
})


plotHistogram('histogram-chart', data)

function updateStatistics() {
    const { mean, median, mode } = getDataStatistics(data)

    averageValue.textContent = mean.toFixed(2)
    medianValue.textContent = median.toFixed(2)
    modeValue.textContent = mode.toFixed(2)
}