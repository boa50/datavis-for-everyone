import { updateChartFunctions } from "./charts/chart.js"
import { addSteps, handleResize, handleStepProgress, handleStepEnter, handleStepExit } from "./scroller/index.js"
import { addVisualComponents } from "./components/components.js"

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('#chart')
const article = scrolly.select('article')
const scroller = scrollama()

const stepsSizes = addSteps(5, article)

// Adjusting the window screen
let { windowHeight, visualisationsWidth } = handleResize(article, scroller, svg)

const { explanationText, chartProps } = await addVisualComponents({ svg, visualisationsWidth, windowHeight })


// Initialising the scroller
const handleProgress = response => {
    handleStepProgress({
        response,
        explanationText,
        stepsSizes
    })
}
const handleEnter = response => {
    handleStepEnter({
        response,
        updateChartFunctions: () => updateChartFunctions(chartProps)
    })
}
const handleExit = response => {
    handleStepExit({
        response,
        updateChartFunctions: () => updateChartFunctions(chartProps)
    })
}

scroller
    .setup({
        step: '#scrolly article .step',
        debug: true,
        progress: true,
        offset: 0.5
    })
    .onStepEnter(handleEnter)
    .onStepExit(handleExit)
    .onStepProgress(handleProgress)

window.addEventListener('resize', () => {
    ({ windowHeight, visualisationsWidth } = handleResize(article, scroller, svg))
})