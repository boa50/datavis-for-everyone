import { getYear, initChart, updateChart } from "./chart.js"
import { createNumber, numberChangeValue } from "../components/animation/number.js"
import { colours } from "./constants.js"
import { addStep } from "./html-utils.js"
import { createText } from "../components/animation/text.js"

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('#chart')
const article = scrolly.select('article')
const scroller = scrollama()

const pxToInt = pxStr => +pxStr.replace('px', '')

let visualisationsWidth
let windowHeight
let yearNumber
let explanationText
const defaultInitialYear = 1800
const defaultFinalYear = 2023
let currentYear = defaultInitialYear

const handleResize = () => {
    const steps = article.selectAll('.step')
    windowHeight = window.innerHeight

    const stepHeight = Math.floor(windowHeight)

    // Dynamic step sizes to facilitate the animation speed control
    steps.each(function () {
        const step = d3.select(this)
        step.style('height', `${stepHeight * step.attr('data-step-size')}px`)
        console.log(step);
    })

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
    let startYear
    let endYear

    // Start the animation only after the first step
    switch (currentIndex) {
        case 0:
            startYear = defaultInitialYear
            endYear = defaultInitialYear
            break;
        case 1:
            startYear = 1800
            endYear = 1915
            break;
        case 2:
            startYear = 1916
            endYear = 1917
            break;
        case 3:
            startYear = defaultFinalYear
            endYear = defaultFinalYear
            break;

        default:
            break;
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
    const nSteps = 4
    const stepsSizes = [1, 5, 1, 1]
    for (let i = 0; i < nSteps; i++) {
        let text = i
        if (i === nSteps - 1) {
            text = 'FINAL STEP!!!'
        }

        addStep(article, text, stepsSizes[i])
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
        fontSize: '1.75rem',
        alignVertical: 'center',
        htmlText: `
        In the beginning, everything was running smoothly.
        </br>&nbsp;</br>
        Countries were improving little by little, with some fallbacks in the meantime.
        `
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