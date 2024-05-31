import { getChart } from "../node_modules/visual-components/index.js"
import { addChart } from "./pie-chart.js"

addChart(
    getChart({
        id: 'chart1',
        margin: { left: 0, right: 0, top: 0, bottom: 0 }
    }),
    'below'
)

addChart(
    getChart({
        id: 'chart2',
        margin: { left: 0, right: 0, top: 0, bottom: 0 }
    }),
    'above'
)