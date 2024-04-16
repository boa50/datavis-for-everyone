import { updateChart } from "./chart.js"

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('#chart')
const article = scrolly.select('article')
const steps = article.selectAll('.step')

const scroller = scrollama()

let svgWidth
let svgHeight
let svgCenterWidth
let svgCenterHeight

const handleResize = () => {
    const windowHeight = window.innerHeight

    const stepHeight = Math.floor(windowHeight)
    steps.style('height', `${stepHeight}px`)

    svgHeight = windowHeight
    const svgMarginTop = (windowHeight - svgHeight) / 2

    svg
        .attr('height', `${svgHeight}px`)
        .style('top', `${svgMarginTop}px`)

    svgWidth = +svg.style('width').replace('px', '')
    svgCenterWidth = svgWidth / 2
    svgCenterHeight = svgHeight / 2

    d3.select('#outro').style('height', `${stepHeight}px`)

    scroller.resize()
}

const handleDirection = (currentDirection, funcDown, funcUp) => {
    currentDirection === 'down' ? funcDown() : funcUp()
}

let lastIndex = 0
let lastProgress = 0

const handleStepProgress = (response) => {
    const currentIndex = response.index
    const currentProgress = response.progress
    const currentDirection = currentIndex > lastIndex ? 'down' : currentProgress > lastProgress ? 'down' : 'up'

    const yearStep = 10
    const startYear = 1800 + (yearStep * currentIndex)
    let endYear = startYear + yearStep
    endYear = endYear > 2023 ? 2023 : endYear

    if (startYear < endYear) {
        updateChart(startYear, endYear, currentProgress)
    }

    lastIndex = response.index
    lastProgress = response.progress
}

const init = () => {
    handleResize()

    scroller
        .setup({
            step: '#scrolly article .step',
            // debug: true,
            progress: true,
            offset: 0.5
        })
        // .onStepEnter(handleStepEnter)
        .onStepProgress(handleStepProgress)

    window.addEventListener('resize', handleResize())
}

init()