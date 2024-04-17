import { initChart, updateChart } from "./chart.js"
import { createNumber, numberChangeValue } from "../components/animation/number.js"
import { colours } from "./constants.js"
import { addStep } from "./html-utils.js"

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('#chart')
const article = scrolly.select('article')
const scroller = scrollama()

const nSteps = 13

const pxToInt = pxStr => +pxStr.replace('px', '')

let visualisationsWidth
let windowHeight
let yearNumber

const handleResize = () => {
    const steps = article.selectAll('.step')
    windowHeight = window.innerHeight

    const stepHeight = Math.floor(windowHeight)
    steps.style('height', `${stepHeight}px`)

    svg
        .attr('height', `${windowHeight}px`)
        .style('top', '0px')

    d3.select('#outro').style('height', `${stepHeight}px`)

    visualisationsWidth = window.innerWidth - pxToInt(article.select('.step').style('width'))

    scroller.resize()
}

const handleStepProgress = (response) => {
    const currentIndex = response.index
    const currentProgress = response.progress

    const yearStep = 20
    const startYear = 1800 + (yearStep * currentIndex)
    let endYear = startYear + yearStep
    endYear = endYear > 2023 ? 2023 : endYear

    if (startYear < endYear) {
        updateChart(startYear, endYear, currentProgress)

        numberChangeValue({
            number: yearNumber,
            initial: startYear,
            end: endYear,
            progress: currentProgress,
            numberFormat: d3.format('d')
        })
    }
}

const init = () => {
    for (let i = 0; i < nSteps; i++) {
        let text = i
        if (i === nSteps - 1) {
            text = 'FINAL STEP!!!'
        }

        addStep(article, text)
    }

    handleResize()

    scroller
        .setup({
            step: '#scrolly article .step',
            progress: true,
            offset: 0.5
        })
        .onStepProgress(handleStepProgress)

    window.addEventListener('resize', handleResize())

    const chartWidth = 1080
    const chartHeight = 720
    initChart({
        svg: svg,
        width: chartWidth,
        height: chartHeight,
        xPosition: (visualisationsWidth - chartWidth) / 2,
        yPosition: (windowHeight - chartHeight) / 2
    })

    yearNumber = createNumber({
        svg: svg,
        textColour: colours.text,
        x: ((visualisationsWidth - chartWidth) / 2) + 150,
        y: ((windowHeight - chartHeight) / 2) + 100
    })
}

init()