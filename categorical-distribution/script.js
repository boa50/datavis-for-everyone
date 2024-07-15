import { getChart, getMargin, getChartDimensions, appendChartContainer } from "../node_modules/visual-components/index.js"
import { addChart as addColumn } from "./charts/column.js"

const getDataGroup = i =>
    i <= 3030 ? 'grp1' :
        i <= 6060 ? 'grp2' : 'grp3'


const getData = () =>
    d3.csv("../_data/gov-spending.csv")
        .then(d => d.sort(() => Math.random() - 0.5).map((v, i) => { return { ...v, govSpending: +v.govSpending, group: getDataGroup(i) } }))

const columnId = appendChartContainer({ idNum: 1, chartTitle: 'Column' })
appendChartContainer({ idNum: 2, chartTitle: 'Column with error line' })
appendChartContainer({ idNum: 3, chartTitle: 'Boxplot' })
appendChartContainer({ idNum: 4, chartTitle: 'Strip plot (Scatter)' })
appendChartContainer({ idNum: 5, chartTitle: 'Jitter plot' })

getData().then(data => {
    addColumn(
        getChart({
            id: columnId,
            chartDimensions: getChartDimensions({ chartId: columnId })
        }),
        data
    )
})