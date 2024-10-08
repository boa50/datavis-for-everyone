import { appendChartContainer, getChart, getMargin, getChartDimensions } from "../../node_modules/visual-components/index.js"
import { addChart } from "./stacked-area.js"

const getData = () =>
    d3.csv('data/dataset.csv')
        .then(d => d.map(v => { return { ...v, literacyRate: +v.literacyRate } }))

const literacyRateId = appendChartContainer({
    idNum: 0,
    chartTitle: 'World Literacy Rate',
    containerAspectRatio: 'aspect-[4/3] md:aspect-video lg:aspect-[5/3.1] 2xl:aspect-[5/3.7]',
    titleSize: 'text-base md:text-lg xl:text-2xl'
})

getData().then(data => {
    addChart(
        getChart({
            id: literacyRateId,
            margin: getMargin({ left: 76, top: 16, bottom: 48 }),
            chartDimensions: getChartDimensions({
                chartId: literacyRateId,
                xl: { width: 750 }
            })
        }),
        data
    )

})