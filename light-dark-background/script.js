import { getChart, getMargin, getChartDimensions, appendChartContainer } from "../node_modules/visual-components/index.js"
import { addChart as addBar } from "./charts/bar.js"
import { addChart as addScatter } from "./charts/scatter.js"
import { addChart as addLine } from "./charts/line.js"

const getData = () =>
    d3.csv('../_data/life-expectancy.csv')
        .then(d =>
            d
                .map(v => {
                    return {
                        ...v, male: +v.male, female: +v.female, average: (+v.male + +v.female) / 2
                    }
                })
        )

const lightBarId = appendChartContainer({ idNum: 1, chartTitle: 'All Light - Bar' })
const lightScatterId = appendChartContainer({ idNum: 10, chartTitle: 'All Light - Scatter' })
const lightLineId = appendChartContainer({ idNum: 100, chartTitle: 'All Light - Line' })

const strongDarkOuterContainerClass = 'bg-black px-4 py-2 rounded'
const strongDarkTitleClass = 'text-sm md:text-base text-white font-medium'
const strongDarkBarId = appendChartContainer({ idNum: 2, chartTitle: 'Strong Dark - Bar', outerContainerClass: strongDarkOuterContainerClass, titleClass: strongDarkTitleClass })
const strongDarkScatterId = appendChartContainer({ idNum: 20, chartTitle: 'Strong Dark - Scatter', outerContainerClass: strongDarkOuterContainerClass, titleClass: strongDarkTitleClass })
const strongDarkLineId = appendChartContainer({ idNum: 200, chartTitle: 'Strong Dark - Line', outerContainerClass: strongDarkOuterContainerClass, titleClass: strongDarkTitleClass })

const softDarkOuterContainerClass = 'bg-neutral-900 px-4 py-2 rounded'
const softDarkTitleClass = 'text-sm md:text-base text-neutral-200 font-medium'
const softDarkBarId = appendChartContainer({ idNum: 3, chartTitle: 'Soft Dark - Bar', outerContainerClass: softDarkOuterContainerClass, titleClass: softDarkTitleClass })
const softDarkScatterId = appendChartContainer({ idNum: 30, chartTitle: 'Soft Dark - Scatter', outerContainerClass: softDarkOuterContainerClass, titleClass: softDarkTitleClass })
const softDarkLineId = appendChartContainer({ idNum: 300, chartTitle: 'Soft Dark - Line', outerContainerClass: softDarkOuterContainerClass, titleClass: softDarkTitleClass })

const gradientColourkey = 'gray'
const gradientDarkOuterContainerClass = `bg-gradient-to-b from-${gradientColourkey}-800 to-${gradientColourkey}-950 px-4 py-2 rounded`
const gradientDarkTitleClass = 'text-sm md:text-base text-neutral-200 font-medium'
const gradientDarkBarId = appendChartContainer({ idNum: 4, chartTitle: 'Gradient Dark - Bar', outerContainerClass: gradientDarkOuterContainerClass, titleClass: gradientDarkTitleClass })
const gradientDarkScatterId = appendChartContainer({ idNum: 40, chartTitle: 'Gradient Dark - Scatter', outerContainerClass: gradientDarkOuterContainerClass, titleClass: gradientDarkTitleClass })
const gradientDarkLineId = appendChartContainer({ idNum: 400, chartTitle: 'Gradient Dark - Line', outerContainerClass: gradientDarkOuterContainerClass, titleClass: gradientDarkTitleClass })

let anonymiser = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const resetAnonymiser = () => { anonymiser = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] }
const anonymiseCountry = () => 'Country ' + anonymiser.shift()

getData().then(data => {

    const lastYearData = data.filter(d => d.year === '2021')
    const lastYearSortedData = lastYearData.sort((a, b) => b.average - a.average)

    const customChartDimensions = {
        xl2: { width: 650 },
        xl: { width: 500 },
        lg: { width: 500 }
    }
    const getCustomChartDimensions = id => getChartDimensions({ chartId: id, ...customChartDimensions })

    const barData = [2, 17, 30, 50, 111, 147, 201]
        .map(i => lastYearSortedData[i])
        .map(d => { return { ...d, country: anonymiseCountry() } })
    const barMargin = getMargin({ left: 102 })

    const scatterData = lastYearData
    const scatterMargin = getMargin({ left: 58 })

    const lineSelectedCountries = [7, 16, 50].map(i => lastYearSortedData[i].country)
    resetAnonymiser()
    const lineCountryAnonymise = {}
    lineSelectedCountries.forEach(country => { lineCountryAnonymise[country] = anonymiseCountry() })
    const lineData = data
        .filter(d => d.year >= 2000 && lineSelectedCountries.includes(d.country))
        .map(d => { return { ...d, country: lineCountryAnonymise[d.country] } })


    const includeBar = (id, theme = 'light') => {
        addBar(
            getChart({
                id,
                chartDimensions: getCustomChartDimensions(id),
                margin: barMargin
            }),
            barData,
            theme
        )
    }

    const includeScatter = (id, theme = 'light') => {
        addScatter(
            getChart({
                id,
                chartDimensions: getCustomChartDimensions(id),
                margin: scatterMargin
            }),
            scatterData,
            theme
        )
    }

    const includeLine = (id, theme = 'light') => {
        addLine(
            getChart({
                id,
                chartDimensions: getCustomChartDimensions(id)
            }),
            lineData,
            theme
        )
    }

    includeBar(lightBarId)
    includeScatter(lightScatterId)
    includeLine(lightLineId)

    includeBar(strongDarkBarId, 'strongDark')
    includeScatter(strongDarkScatterId, 'strongDark')
    includeLine(strongDarkLineId, 'strongDark')

    includeBar(softDarkBarId, 'softDark')
    includeScatter(softDarkScatterId, 'softDark')
    includeLine(softDarkLineId, 'softDark')

    includeBar(gradientDarkBarId, 'softDark')
    includeScatter(gradientDarkScatterId, 'softDark')
    includeLine(gradientDarkLineId, 'softDark')
})