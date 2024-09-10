import { createText, colours } from "../../node_modules/visual-components/index.js"
import { addChart, updateChart1, updateChart2 } from "./chart.js"
import { addStep } from "./html-utils.js"
import { handleResize } from "./resize.js"
import { handleStepProgress } from "./progress.js"

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('#chart')
const article = scrolly.select('article')
const scroller = scrollama()

// Adding steps dynamically
const nSteps = 3
const stepsSizes = {}
const eventSteps = new Set([])
for (let i = 0; i < nSteps; i++) {
    if (eventSteps.has(i)) stepsSizes[i] = 2
    else stepsSizes[i] = 1
}

for (let i = 0; i < nSteps; i++) addStep(article, '', stepsSizes[i])


// Adjusting the window screen
let { windowHeight, visualisationsWidth } = handleResize(article, scroller, svg)


// Creating visual components
const chartWidth = 1080 < visualisationsWidth - 450 ? 1080 : visualisationsWidth - 450
const chartHeight = chartWidth / 1.6
const chartXposition = 64
const chartYposition = (windowHeight - chartHeight) / 2

const explanationText = createText({
    svg,
    x: chartXposition + chartWidth + 16,
    width: visualisationsWidth - chartWidth - chartXposition - 100,
    textColour: colours.paletteLightBg.axis,
    fontSize: '1.75rem',
    alignVertical: 'center',
    alignHorizontal: 'center',
    htmlText: ``
})

const chartProps = addChart({
    svg,
    width: chartWidth,
    height: chartHeight,
    xPosition: chartXposition,
    yPosition: chartYposition
})

// Initialising the scroller
const handleProgress = response => {
    handleStepProgress({
        response,
        explanationText,
        stepsSizes,
        updateChart1: () => updateChart1(chartProps),
        updateChart2: () => updateChart2(chartProps),
    })
}

scroller
    .setup({
        step: '#scrolly article .step',
        progress: true,
        offset: 0.5
    })
    .onStepProgress(handleProgress)

window.addEventListener('resize', () => {
    ({ windowHeight, visualisationsWidth } = handleResize(article, scroller, svg))
})