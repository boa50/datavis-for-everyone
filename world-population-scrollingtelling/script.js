import { getYear, initChart, updateChart } from "./chart.js"
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
let currentYear = '1800'

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
        currentYear = getYear(startYear, endYear, currentProgress)
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

    yearNumber = createNumber({
        svg: svg,
        textColour: colours.yearText,
        fontSize: '15rem',
        alignVertical: 'middle',
        x: visualisationsWidth / 2,
        y: windowHeight / 2
    })

    const chartWidth = 1080 < visualisationsWidth - 150 ? 1080 : visualisationsWidth - 150
    const chartHeight = chartWidth / 1.5
    initChart({
        svg: svg,
        width: chartWidth,
        height: chartHeight,
        xPosition: (visualisationsWidth - chartWidth) / 2,
        yPosition: (windowHeight - chartHeight) / 2
    }).then(() => updateChart(currentYear, currentYear, 1))


    svg
        .append('text')
        .attr('transform', `translate(${[visualisationsWidth - 75, windowHeight - 25]})`)
        .attr('class', 'text-sm')
        .attr('fill', '#6b7280')
        .style('text-anchor', 'end')
        .text('Data extracted from: https://www.gapminder.org/data/documentation/gd000/')

}

init()