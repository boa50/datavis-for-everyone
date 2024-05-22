import { changeText, createText, hideText, showText, convertSizeToIntPx } from "../node_modules/visual-components/index.js"
import { defaultColours as colours, palette } from "../colours.js"
import { addChart } from "./chart.js"
import { showHideTextElement, showTextElement, hideTextElement, addAnnotation } from "./utils.js"
import { addStep } from "./html-utils.js"

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('#chart')
const article = scrolly.select('article')
const scroller = scrollama()

let visualisationsWidth
let windowHeight
let explanationText
let title, subtitle, annotationsCluttered, annotationsInsights

const nSteps = 10
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

    const changeExplanationText = (txt, executeShow = true, executeHide = true) => {
        changeText(explanationText, txt)
        showHideTextElement({
            element: explanationText,
            stepSize: stepsSizes[currentIndex],
            progress: currentProgress,
            executeShow,
            executeHide
        })
    }

    // Start the animation only after the first step
    switch (currentIndex) {
        case 0:
            hideText(title)
            hideText(subtitle)
            annotationsCluttered.forEach(element => { hideText(element) })
            annotationsInsights.forEach(element => { hideText(element) })

            showText(explanationText)
            break;
        case 1:
            changeExplanationText('Without any explanation text it is very hard to gain meaningful insights quickly', false)
            break;
        case 2:
            changeExplanationText('Let\'s add the basics: title and subtitle')

            showTextElement({
                element: title,
                stepSize: stepsSizes[currentIndex],
                progress: currentProgress,
            })
            showTextElement({
                element: subtitle,
                stepSize: stepsSizes[currentIndex],
                progress: currentProgress,
            })
            break;
        case 3:
            changeExplanationText('With those now we at least have an idea about what was the intention')
            break;
        case 4:
            changeExplanationText('Let\'s put more annotations to individual data points')

            annotationsCluttered.forEach(element => {
                showTextElement({
                    element,
                    stepSize: stepsSizes[currentIndex],
                    progress: currentProgress,
                })
            })
            break;
        case 5:
            changeExplanationText('Now things are more explicit, but our chart has a lot of information disturbing our analysis')
            break;
        case 6:
            changeExplanationText('So, let\'s remove the excesses <span style="color: transparent;">and add only meaningful texts<span>')

            annotationsCluttered.forEach(element => {
                hideTextElement({
                    element,
                    stepSize: stepsSizes[currentIndex],
                    progress: currentProgress,
                })
            })
            break;
        case 7:
            changeExplanationText('So, let\'s remove the excesses <span style="color: inherit;">and add only meaningful texts<span>')

            annotationsInsights.forEach(element => {
                showTextElement({
                    element,
                    stepSize: stepsSizes[currentIndex],
                    progress: currentProgress,
                })
            })
            break;
        case 8:
            changeExplanationText('Now we have only what is essential to share insights quickly with our audience and we can enhance our understanding about the data', true, false)
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


    title = createText({
        svg: svg,
        x: chartXposition - 60,
        y: chartYposition - 130,
        width: 400,
        height: 40,
        textColour: colours.animationText,
        fontSize: '1.75rem',
        htmlText: `<span class="font-medium">Deaths by Natural Disasters</span>`
    })

    subtitle = createText({
        svg: svg,
        x: chartXposition - 60,
        y: chartYposition - 90,
        width: chartWidth,
        height: 22,
        textColour: d3.hsl(colours.animationText).brighter(0.9),
        fontSize: '1rem',
        htmlText: `<span class="font-medium">The world has become more resilient to natural disasters in recent years, reducing the number of deaths</span>`
    })

    fillAnnotationsCluttered(chartXposition, chartYposition, chartWidth, chartHeight)
    fillAnnotationsInshights(chartXposition, chartYposition, chartWidth, chartHeight)

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

function fillAnnotationsCluttered(chartXposition, chartYposition, chartWidth, chartHeight) {
    annotationsCluttered = [
        // Drought
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 0 + 70,
            y: chartYposition + (chartHeight / 4) * 0 + 50,
            deaths: 1261,
            description: '1900 Bengal famine'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 28 + 40,
            y: chartYposition + (chartHeight / 4) * 0 + 60,
            deaths: 3000,
            description: '1928 Chinese drought'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 42 + 40,
            y: chartYposition + (chartHeight / 4) * 0 + 50,
            deaths: 1503,
            description: '1942 Indian famine'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 43 + 110,
            y: chartYposition + (chartHeight / 4) * 0 - 60,
            deaths: 1900,
            description: '1943 Bangladeshi famine'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 65 + 10,
            y: chartYposition + (chartHeight / 4) * 0 + 30,
            deaths: 1500,
            description: '1965 - 1967 Indian famine'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 83 + 0,
            y: chartYposition + (chartHeight / 4) * 0 + 20,
            deaths: 450,
            description: '1983 - 1985 Ethiopian famine'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 110 + 0,
            y: chartYposition + (chartHeight / 4) * 0 + 10,
            deaths: 20,
            description: '2010 - 2011 Somalian famine'
        }),
        // Flood
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 31 + 40,
            y: chartYposition + (chartHeight / 4) * 1 + 70,
            deaths: 3700,
            description: '1931 China floods'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 39 + 70,
            y: chartYposition + (chartHeight / 4) * 1 + 30,
            deaths: 500,
            description: '1939 China floods'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 59 + 40,
            y: chartYposition + (chartHeight / 4) * 1 + 40,
            deaths: 2000,
            description: '1959 - 1961 China floods and famine'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 99 + 0,
            y: chartYposition + (chartHeight / 4) * 1 + 10,
            deaths: 35,
            description: '1999 Venezuela floods'
        }),
        // Earthquake
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 20 + 50,
            y: chartYposition + (chartHeight / 4) * 2 + 20,
            deaths: 183,
            description: '1920 Gansu, China'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 23 + 80,
            y: chartYposition + (chartHeight / 4) * 2 - 50,
            deaths: 151,
            description: '1923 Tokyo, Japan'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 48 + 20,
            y: chartYposition + (chartHeight / 4) * 2 + 20,
            deaths: 116,
            description: '1948 Ashgabat, Turkmenistan'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 76 + 0,
            y: chartYposition + (chartHeight / 4) * 2 + 20,
            deaths: 277,
            description: '1976 Tangshan, China'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 104 - 20,
            y: chartYposition + (chartHeight / 4) * 2 + 20,
            deaths: 227,
            description: '2004 Boxing Day tsunami'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 110 + 0,
            y: chartYposition + (chartHeight / 4) * 2 - 50,
            deaths: 227,
            description: '2010 Haiti'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 123 - 30,
            y: chartYposition + (chartHeight / 4) * 2 + 10,
            deaths: 62,
            description: '2023 Turkey - Syria'
        }),
        // Weather
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 22 + 40,
            y: chartYposition + (chartHeight / 4) * 3 + 20,
            deaths: 100,
            description: '1922 cyclone, China'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 42 + 20,
            y: chartYposition + (chartHeight / 4) * 3 + 20,
            deaths: 101,
            description: '1942 cyclones, India & Bangladesh'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 70 + 0,
            y: chartYposition + (chartHeight / 4) * 3 + 20,
            deaths: 304,
            description: '1970 cyclone, Bangladesh'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 91 - 10,
            y: chartYposition + (chartHeight / 4) * 3 + 20,
            deaths: 146,
            description: '1991 cyclone, Bangladesh'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 108 - 10,
            y: chartYposition + (chartHeight / 4) * 3 - 50,
            deaths: 141,
            description: '2008 cyclone, Myanmar'
        }),
        //Temperature
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 103 - 20,
            y: chartYposition + (chartHeight / 4) * 4 + 20,
            deaths: 75,
            description: '2003 European heatwave'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 110 - 20,
            y: chartYposition + (chartHeight / 4) * 4 - 50,
            deaths: 57,
            description: '2010 Russian heatwave'
        }),
        addAnnotation({
            svg,
            x: chartXposition + (chartWidth / 124) * 122 - 40,
            y: chartYposition + (chartHeight / 4) * 4 + 10,
            deaths: 62,
            description: '2022 European heatwave'
        }),
    ]
}

function fillAnnotationsInshights(chartXposition, chartYposition, chartWidth, chartHeight) {
    annotationsInsights = [
        createText({
            svg,
            x: chartXposition + (chartWidth / 124) * 60 + 70,
            y: chartYposition + (chartHeight / 4) * 0.5 - 20,
            width: 500,
            height: 40,
            textColour: d3.hsl(colours.axis).brighter(0.5),
            fontSize: '0.9rem',
            htmlText: `
                <span class="font-base leading-tight">
                    Deaths by 
                    <span class="font-bold" style="color: ${palette.orange};">Droughts</span>
                    and 
                    <span class="font-bold" style="color: ${palette.blue};">Floods</span>
                    have been reduced in recent years.
                </span>
                </br>
                <span class="font-base leading-tight">However the frequency of floods increased substantially.</span>
            `
        }),
        createText({
            svg,
            x: chartXposition + (chartWidth / 124) * 30,
            y: chartYposition + (chartHeight / 4) * 2.5 - 20,
            width: 700,
            height: 40,
            textColour: d3.hsl(colours.axis).brighter(0.5),
            fontSize: '0.9rem',
            htmlText: `
                <span class="font-base leading-tight">
                    <span class="font-bold" style="color: ${palette.amber};">Earthquakes</span> 
                    and 
                    <span class="font-bold" style="color: ${palette.reddishPurple};">Weather</span> 
                    changes (such as cyclones) are very unpredictable and continue
                </span>
                </br>
                <span class="font-base leading-tight">to cause many deaths without showing any sights that we are prepared for them.</span>
            `
        }),
        createText({
            svg,
            x: chartXposition + (chartWidth / 124) * 55,
            y: chartYposition + (chartHeight / 4) * 3.5 + 20,
            width: 700,
            height: 40,
            textColour: d3.hsl(colours.axis).brighter(0.5),
            fontSize: '0.9rem',
            htmlText: `
                <span class="font-base leading-tight">
                    We should be more cautionus about 
                    <span class="font-bold" style="color: ${palette.vermillion};">Temperature</span> 
                    changes.
                </span>
                </br>
                <span class="font-base leading-tight">The increasing number of heatwaves has appeared as the most proeminent natural disaster.</span>
            `
        }),
    ]
}

init()