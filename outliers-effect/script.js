import { getData, updateData, getDataStatistics } from "./data.js"
import { plotHistogram, updateHistogram } from "./charts/histogram.js"

const averageValue = document.getElementById('average-value')
const medianValue = document.getElementById('median-value')
const modeValue = document.getElementById('mode-value')
const outlierValue = document.getElementById('outlier-value')


const nElements = 100
const data = getData(nElements, 50, 10)

outlierValue.addEventListener('change', (event) => {
    updateData(data, +event.target.value, nElements)

    const { mean, median, mode } = getDataStatistics(data)

    averageValue.textContent = mean
    medianValue.textContent = median
    modeValue.textContent = mode

    updateHistogram(data)
})

plotHistogram('histogram-chart', data)