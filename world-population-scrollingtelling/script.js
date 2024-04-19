import { getYear, initChart, updateChart } from "./chart.js"
import { createNumber, numberChangeValue } from "../components/animation/number.js"
import { colours } from "./constants.js"
import { addStep } from "./html-utils.js"
import { changeText, createText, hideText, showText } from "../components/animation/text.js"

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

const nSteps = 16
const stepsSizes = {}
for (let i = 0; i < nSteps; i++)  stepsSizes[i] = 1
stepsSizes[1] = 5
stepsSizes[5] = 5

const handleResize = () => {
    const steps = article.selectAll('.step')
    windowHeight = window.innerHeight

    const stepHeight = Math.floor(windowHeight)

    // Dynamic step sizes to facilitate the animation speed control
    steps.each(function () {
        const step = d3.select(this)
        step.style('height', `${stepHeight * step.attr('data-step-size')}px`)
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

    const showHideExplanationText = (hideStartsAt = 0.5, executeShow = true) => {
        const speed = (1 / 0.5) * stepsSizes[currentIndex]
        if (executeShow && (currentProgress <= hideStartsAt)) showText(explanationText, currentProgress * speed)
        if (currentProgress > hideStartsAt) hideText(explanationText, (currentProgress - hideStartsAt) * speed)
    }

    // Start the animation only after the first step
    switch (currentIndex) {
        case 0:
            startYear = defaultInitialYear
            endYear = defaultInitialYear
            break;
        case 1:
            changeText(explanationText, `
            In the beginning, everything was running smoothly
            </br>&nbsp;</br>
            Countries were improving little by little, with some fallbacks in the meantime
            `)
            showHideExplanationText(0.5, false)
            startYear = 1800
            endYear = 1914
            break;
        case 2:
            changeText(explanationText, 'Until...')
            showHideExplanationText()
            startYear = 1915
            endYear = 1917
            break;
        case 3:
            changeText(explanationText, 'Coming the Great Influenza epidemic, which killed arround 50 million people')
            showHideExplanationText()
            startYear = 1918
            endYear = 1918
            break;
        case 4:
            changeText(explanationText, 'And then we started improving again')
            showHideExplanationText()
            startYear = 1919
            endYear = 1921
            break;
        case 5:
            startYear = 1922
            endYear = 1935
            break;
        case 6:
            startYear = 1936
            endYear = 1938
            break;
        case 7:
            startYear = 1939
            endYear = 1945
            break;
        case 8:
            startYear = 1946
            endYear = 1948
            break;
        case 9:
            startYear = 1949
            endYear = 1990
            break;
        case 10:
            startYear = 1991
            endYear = 1993
            break;
        case 11:
            startYear = 1994
            endYear = 1994
            break;
        case 12:
            startYear = 1995
            endYear = 1997
            break;
        case 13:
            startYear = 1998
            endYear = 2018
            break;
        case 14:
            startYear = 2019
            endYear = 2023
            break;
        case 15:
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