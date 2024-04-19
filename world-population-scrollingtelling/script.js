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

const nSteps = 11
const stepsSizes = {}
const eventSteps = new Set([2, 3, 5, 7, 9])
for (let i = 0; i < nSteps; i++) {
    if (eventSteps.has(i)) stepsSizes[i] = 2
    else stepsSizes[i] = 1
}
stepsSizes[1] = 4

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

    const showHideExplanationText = ({ hideStartsAt = 0.5, executeShow = true, executeHide = true } = {}) => {
        const speed = (1 / 0.5) * stepsSizes[currentIndex]
        if (executeShow && (currentProgress <= hideStartsAt)) showText(explanationText, currentProgress * speed)
        if (executeHide && (currentProgress > hideStartsAt)) hideText(explanationText, (currentProgress - hideStartsAt) * speed)
    }

    // Start the animation only after the first step
    switch (currentIndex) {
        case 0:
            showText(explanationText)
            startYear = defaultInitialYear
            endYear = defaultInitialYear
            break;
        case 1:
            changeText(explanationText, `
                In the beginning, everything was running smoothly
                </br>&nbsp;</br>
                Countries were improving little by little, with some fallbacks in the meantime
            `)
            showHideExplanationText({ executeShow: false })
            startYear = 1800
            endYear = 1906
            break;
        case 2:
            changeText(explanationText, 'Until...')
            showHideExplanationText()
            startYear = 1907
            endYear = 1914
            break;
        case 3:
            changeText(explanationText, `
                The Great Influenza Epidemic (1918), killing around 50 million people and 
                reducing the world's life expectancy in a way never seen before
            `)
            showHideExplanationText()
            startYear = 1915
            endYear = 1921
            break;
        case 4:
            changeText(explanationText, 'After that, we continued to move forward')
            showHideExplanationText()
            startYear = 1922
            endYear = 1935
            break;
        case 5:
            changeText(explanationText, `
                And again, people started killing each other during the Second World War (1939 - 1945), 
                killing around 85 million people.
            `)
            showHideExplanationText()
            startYear = 1936
            endYear = 1948
            break;
        case 6:
            startYear = 1949
            endYear = 1990
            break;
        case 7:
            changeText(explanationText, `
                In 1994, Rwanda suffered a terrible genocide, 
                making its life expectancy reach a miserable 9.5 years
            `)
            showHideExplanationText()
            startYear = 1991
            endYear = 1997
            break;
        case 8:
            startYear = 1995
            endYear = 2018
            break;
        case 9:
            changeText(explanationText, `
                Compared to other catastrophes in our world, 
                COVID-19 haven't brought our life expectancy down 
                besides killing around 7 million people
            `)
            showHideExplanationText({ executeHide: false })
            startYear = 2019
            endYear = 2023
            break;
        case 10:
            showText(explanationText)
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
    for (let i = 0; i < nSteps; i++) addStep(article, '', stepsSizes[i])

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
        alignHorizontal: 'center',
        htmlText: `
            In the beginning, everything was running smoothly.
            </br>&nbsp;</br>
            Countries were improving little by little, with some fallbacks in the meantime.
        `
    })


    createText({
        svg: svg,
        x: chartXposition - 60,
        y: chartYposition - 50,
        width: 200,
        height: 50,
        textColour: colours.text,
        fontSize: '1.75rem',
        htmlText: `<span class="font-medium">World Health</span>`
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