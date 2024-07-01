import { getChart, getMargin, appendChartContainer, getChartDimensions } from "../node_modules/visual-components/index.js"
import { addChart as addBar } from "./charts/bar-expectancy-by-gender.js"
import { addChart as addLine } from "./charts/line-life-expectancy-gap.js"
import { addChart as addScatter } from "./charts/scatter-expectancy-distribution.js"
import { addChart as addHexbin } from "./charts/hexbin-expectancy-distribution.js"
import { addChart as addRidgeline } from "./charts/ridgeline-life-expectancy-gap.js"

const getData = () =>
    d3.csv('data/life-expectancy.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                female: +v.female,
                male: +v.male,
                average: (+v.female + +v.male) / 2,
                gap: Math.abs(+v.female - +v.male)
            }
        }))

const line1OuterContainerClass = 'bg-neutral-50 px-4 py-2 rounded-sm lg:col-span-2'
const line1InnerContainerClass = 'aspect-[4/3] md:aspect-video lg:aspect-[4/3] xl:aspect-[40/29]'
const line2OuterContainerClass = 'bg-neutral-50 px-4 py-2 rounded-sm lg:col-span-3'
const line2InnerContainerClass = 'aspect-[4/3] md:aspect-video lg:aspect-[16/9] xl:aspect-[16/8] 2xl:aspect-[16/8.5]'

const barChartId = appendChartContainer({
    idNum: 1,
    chartTitle: 'Life expectancy by Country by Gender',
    outerContainerClass: line1OuterContainerClass,
    innerContainerClass: line1InnerContainerClass
})
const hexbinChartId = appendChartContainer({
    idNum: 4,
    chartTitle: 'Life expectancy distribution',
    outerContainerClass: line1OuterContainerClass,
    innerContainerClass: line1InnerContainerClass
})
const lineChartId = appendChartContainer({
    idNum: 2,
    chartTitle: 'Life expectancy gap by Country per Year',
    outerContainerClass: line1OuterContainerClass,
    innerContainerClass: line1InnerContainerClass
})
const scatterChartId = appendChartContainer({
    idNum: 3,
    chartTitle: 'Life expectancy distribution',
    outerContainerClass: line2OuterContainerClass,
    innerContainerClass: line2InnerContainerClass
})
const ridgeChartId = appendChartContainer({
    idNum: 5,
    chartTitle: 'Life expectancy gap by Country per Year',
    outerContainerClass: line2OuterContainerClass,
    innerContainerClass: line2InnerContainerClass
})

getData().then(data => {
    fillCards(data)

    const line1Dimensions = getChartDimensions({
        lg: { width: 490, scale: 1.45 },
        xl: { width: 490, scale: 1.45 },
        xl2: { width: 590, scale: 1.45 }
    })
    const line2Dimensions = getChartDimensions({
        xl: { width: 780, scale: 2.2 },
        xl2: { width: 885, scale: 2.1 }
    })

    addBar(
        getChart({
            id: barChartId,
            chartDimensions: line1Dimensions,
            margin: getMargin({ left: 140, top: 24 })
        }),
        data.filter(d => d.year === '2021')
    )

    addLine(
        getChart({
            id: lineChartId,
            chartDimensions: line1Dimensions,
            margin: getMargin({ top: 24 })
        }),
        data
    )

    addScatter(
        getChart({
            id: scatterChartId,
            chartDimensions: line2Dimensions
        }),
        data
    )

    addHexbin(
        getChart({
            id: hexbinChartId,
            chartDimensions: line1Dimensions,
        }),
        data
    )

    addRidgeline(
        getChart({
            id: ridgeChartId,
            chartDimensions: line2Dimensions,
            margin: getMargin({ left: 120, top: 52 })
        }),
        data
    )
})

function fillCards(data) {
    const lastYearData = data.filter(d => d.year === '2021')
    const averageExpectancy2021 = lastYearData.reduce((total, current) => total + current.average, 0) / lastYearData.length
    const highestExpectancy2021 = d3.max(lastYearData, d => d.average)
    const highestExpectancyCountry2021 = lastYearData.filter(d => d.average === highestExpectancy2021)[0].country
    const lowestExpectancy2021 = d3.min(lastYearData, d => d.average)
    const lowestExpectancyCountry2021 = lastYearData.filter(d => d.average === lowestExpectancy2021)[0].country
    const highestExpectancyGap2021 = d3.max(lastYearData, d => d.gap)
    const highestExpectancyGapCountry2021 = lastYearData.filter(d => d.gap === highestExpectancyGap2021)[0].country
    const lowestExpectancyGap2021 = d3.min(lastYearData, d => d.gap)
    const lowestExpectancyGapCountry2021 = lastYearData.filter(d => d.gap === lowestExpectancyGap2021)[0].country

    document.getElementById('card1-content').innerHTML = (averageExpectancy2021).toFixed(2) + ' years'
    document.getElementById('card2-content').innerHTML = (highestExpectancy2021).toFixed(2) + ' years'
    document.getElementById('card3-content').innerHTML = (lowestExpectancy2021).toFixed(2) + ' years'
    document.getElementById('card4-content').innerHTML = (highestExpectancyGap2021).toFixed(2) + ' years'
    document.getElementById('card5-content').innerHTML = (lowestExpectancyGap2021).toFixed(2) + ' years'

    document.getElementById('card2-title').innerHTML += ` - ${highestExpectancyCountry2021}`
    document.getElementById('card3-title').innerHTML += ` - ${lowestExpectancyCountry2021}`
    document.getElementById('card4-title').innerHTML += ` - ${highestExpectancyGapCountry2021.replace('United States ', 'US ')}`
    document.getElementById('card5-title').innerHTML += ` - ${lowestExpectancyGapCountry2021}`
}