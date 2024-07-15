import { getChart, getMargin, getChartDimensions, appendChartContainer } from "../node_modules/visual-components/index.js"

const getData = () =>
    d3.csv("../_data/gov-spending.csv")
        .then(d => d.map(v => { return { ...v, govSpending: +v.govSpending } }))

appendChartContainer({ idNum: 1, chartTitle: 'Column' })
appendChartContainer({ idNum: 2, chartTitle: 'Column with error line' })
appendChartContainer({ idNum: 3, chartTitle: 'Boxplot' })
appendChartContainer({ idNum: 4, chartTitle: 'Strip plot (Scatter)' })
appendChartContainer({ idNum: 5, chartTitle: 'Jitter plot' })

getData().then(data => {
    console.log(data);
})