import { getData, updateData, getDataStatistics } from "./data.js"
import { plotHistogram, updateHistogram } from "./charts/histogram.js"
import { handleInputChange } from "../node_modules/visual-components/index.js"

const averageValue = document.getElementById('average-value')
const medianValue = document.getElementById('median-value')
const modeValue = document.getElementById('mode-value')

const nElementsValue = document.getElementById('n-elements-value')
const outlierValue = document.getElementById('outlier-value')
const outlierValueText = document.getElementById('outlierValueText')

const meanInitial = 50
const stdev = 10
let nElements = 100
let data = getData(nElements, meanInitial, stdev)
updateStatistics()

nElementsValue.value = nElements
outlierValue.value = meanInitial
handleInputChange({ target: outlierValue })

nElementsValue.addEventListener('change', (event) => {
    nElements = +event.target.value
    data = getData(nElements, meanInitial, stdev)

    outlierValue.value = meanInitial
    handleInputChange({ target: outlierValue })
    outlierValueText.textContent = 'None'

    updateStatistics()
    updateHistogram(data)
})

outlierValue.addEventListener('change', (event) => {
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