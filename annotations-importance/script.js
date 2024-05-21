import { changeText, createText, hideText, showText, convertSizeToIntPx } from "../node_modules/visual-components/index.js"
import { addChart } from "./chart.js"
import { defaultColours as colours } from "../colours.js"
import { addStep } from "./html-utils.js"

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('#chart')
const article = scrolly.select('article')
const scroller = scrollama()

let visualisationsWidth
let windowHeight
let explanationText

const nSteps = 3
const stepsSizes = {}
const eventSteps = new Set([])
for (let i = 0; i < nSteps; i++) {
    if (eventSteps.has(i)) stepsSizes[i] = 2
    else stepsSizes[i] = 1
}

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

    visualisationsWidth = window.innerWidth - convertSizeToIntPx(article.select('.step').style('width'))

    scroller.resize()
}

const handleStepProgress = (response) => {
    const currentIndex = response.index
    const currentProgress = response.progress

    const showHideExplanationText = ({ hideStartsAt = 0.5, executeShow = true, executeHide = true } = {}) => {
        const speed = (1 / 0.5) * stepsSizes[currentIndex]
        if (executeShow && (currentProgress <= hideStartsAt)) showText(explanationText, currentProgress * speed)
        if (executeHide && (currentProgress > hideStartsAt)) hideText(explanationText, (currentProgress - hideStartsAt) * speed)
    }

    // Start the animation only after the first step
    switch (currentIndex) {
        case 0:
            showText(explanationText)
            break;
        case 1:
            changeText(explanationText, `
                Some text
            `)
            showHideExplanationText({ executeShow: false })
            break;
        case 2:
            changeText(explanationText, 'Another text')
            showHideExplanationText()
            break;

        default:
            break;
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

    explanationText = createText({
        svg: svg,
        x: chartXposition + chartWidth + 16,
        width: visualisationsWidth - chartWidth - chartXposition - 100,
        textColour: colours.animationText,
        fontSize: '1.75rem',
        alignVertical: 'center',
        alignHorizontal: 'center',
        htmlText: ``
    })


    // createText({
    //     svg: svg,
    //     x: chartXposition - 60,
    //     y: chartYposition - 50,
    //     width: 200,
    //     height: 50,
    //     textColour: colours.animationText,
    //     fontSize: '1.75rem',
    //     htmlText: `<span class="font-medium">World Health</span>`
    // })

    addChart({
        svg: svg,
        width: chartWidth,
        height: chartHeight,
        xPosition: chartXposition,
        yPosition: chartYposition
    })

    svg
        .append('text')
        .attr('transform', `translate(${[visualisationsWidth - 75, windowHeight - 25]})`)
        .attr('class', 'text-sm')
        .attr('fill', '#6b7280')
        .style('text-anchor', 'end')
        .text('Source: EM-DAT, CRED / UCLouvain (2024) – with major processing by Our World in Data')
}

init()