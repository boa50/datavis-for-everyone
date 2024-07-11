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
appendChartContainer({ idNum: 2, chartTitle: 'Strong Dark - Bar' })
appendChartContainer({ idNum: 20, chartTitle: 'Strong Dark - Scatter' })
appendChartContainer({ idNum: 200, chartTitle: 'Strong Dark - Line' })
appendChartContainer({ idNum: 3, chartTitle: 'Soft Dark - Bar' })
appendChartContainer({ idNum: 30, chartTitle: 'Soft Dark - Scatter' })
appendChartContainer({ idNum: 300, chartTitle: 'Soft Dark - Line' })
appendChartContainer({ idNum: 4, chartTitle: 'Gradient Dark - Bar' })
appendChartContainer({ idNum: 40, chartTitle: 'Gradient Dark - Scatter' })
appendChartContainer({ idNum: 400, chartTitle: 'Gradient Dark - Line' })

getData().then(data => {
    const lastYearData = data.filter(d => d.year === '2021')
    const lastYearSortedData = lastYearData.sort((a, b) => b.average - a.average)

    const customChartDimensions = {
        xl2: { width: 650 },
        xl: { width: 500 },
        lg: { width: 500 }
    }

    const barData = [2, 17, 30, 50, 111, 147, 201].map(i => lastYearSortedData[i])
    const barMargin = getMargin({ left: 108 })

    const scatterData = lastYearData
    const scatterMargin = getMargin({ left: 58 })

    const lineSelectedCountries = [7, 16, 50].map(i => lastYearSortedData[i].country)
    const lineData = data.filter(d => d.year >= 2000 && lineSelectedCountries.includes(d.country))

    addBar(
        getChart({
            id: lightBarId,
            chartDimensions: getChartDimensions({ chartId: lightBarId, ...customChartDimensions }),
            margin: barMargin
        }),
        barData
    )

    addScatter(
        getChart({
            id: lightScatterId,
            chartDimensions: getChartDimensions({ chartId: lightScatterId, ...customChartDimensions }),
            margin: scatterMargin
        }),
        scatterData
    )

    addLine(
        getChart({
            id: lightLineId,
            chartDimensions: getChartDimensions({ chartId: lightLineId, ...customChartDimensions })
        }),
        lineData
    )

})