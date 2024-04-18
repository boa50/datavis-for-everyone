import { getYear, initChart, updateChart } from "./chart.js"
import { createNumber, numberChangeValue } from "../components/animation/number.js"
import { colours } from "./constants.js"
import { addStep } from "./html-utils.js"
import { createText } from "../components/animation/text.js"

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('#chart')
const article = scrolly.select('article')
const scroller = scrollama()

const nSteps = 16

const pxToInt = pxStr => +pxStr.replace('px', '')

let visualisationsWidth
let windowHeight
let yearNumber
let explanationText
const initialYear = 1800
const finalYear = 2023
let currentYear = initialYear

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
    const yearStep = 16
    let startYear = initialYear
    let endYear = initialYear

    if (currentIndex > 0) {
        startYear = initialYear + (yearStep * (currentIndex - 1))
        endYear = startYear + yearStep
        endYear = endYear > finalYear ? finalYear : endYear
    }

    if (startYear <= endYear) {
        currentYear = getYear(startYear, endYear, currentProgress)
        updateChart(startYear, endYear, currentProgress)

        numberChangeValue({
            number: yearNumber,
            initial: currentYear,
            end: currentYear,
            transitionDuration: 0,
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

    const chartWidth = 1080 < visualisationsWidth - 450 ? 1080 : visualisationsWidth - 450
    const chartHeight = chartWidth / 1.5
    const chartXposition = 64
    const chartYposition = (windowHeight - chartHeight) / 2

    yearNumber = createNumber({
        svg: svg,
        textColour: colours.yearText,
        fontSize: '15rem',
        alignVertical: 'middle',
        x: chartXposition + (chartWidth / 2),
        y: windowHeight / 2
    })

    explanationText = createText({
        svg: svg,
        x: chartXposition + chartWidth + 16,
        width: visualisationsWidth - chartWidth - chartXposition - 78,
        textColour: colours.text,
        fontSize: '3rem',
        alignVertical: 'center',
        text: 'Some text to test if everything is gonna run smoothly'
    })

    initChart({
        svg: svg,
        width: chartWidth,
        height: chartHeight,
        xPosition: chartXposition,
        yPosition: chartYposition
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