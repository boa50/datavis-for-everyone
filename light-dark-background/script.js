import { getChart, getMargin, getChartDimensions, appendChartContainer } from "../node_modules/visual-components/index.js"
import { addChart as addBar } from "./charts/bar.js"

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
appendChartContainer({ idNum: 10, chartTitle: 'All Light - Scatter' })
appendChartContainer({ idNum: 100, chartTitle: 'All Light - Line' })
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
    let barData = data
        .filter(d => d.year === '2021')
        .sort((a, b) => b.average - a.average)
    barData = [2, 17, 30, 50, 111, 147, 201].map(i => barData[i])
    const barMargin = getMargin({ left: 108 })

    addBar(
        getChart({
            id: lightBarId,
            chartDimensions: getChartDimensions({ chartId: lightBarId }),
            margin: barMargin
        }),
        barData
    )

})