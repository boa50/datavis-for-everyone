import { updateChart1, updateChart2 } from "./charts/chart.js"
import { addSteps, handleResize, handleStepProgress, handleStepEnter, handleStepExit } from "./scroller/index.js"
import { addVisualComponents } from "./components/components.js"

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('#chart')
const article = scrolly.select('article')
const scroller = scrollama()

const stepsSizes = addSteps(4, article)


// Adjusting the window screen
let { windowHeight, visualisationsWidth } = handleResize(article, scroller, svg)

const { explanationText, chartProps } = addVisualComponents({ svg, visualisationsWidth, windowHeight })

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
        // debug: true,
        progress: true,
        offset: 0.5
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
    .onStepProgress(handleProgress)

window.addEventListener('resize', () => {
    ({ windowHeight, visualisationsWidth } = handleResize(article, scroller, svg))
})