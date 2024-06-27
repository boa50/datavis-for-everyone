import { getChart } from "../node_modules/visual-components/index.js"
import { addChart } from "./pie-chart.js"

const margin = { left: 0, right: 0, top: 0, bottom: 128 }

addChart(getChart({
    id: 'chart1', margin,
    chartDimensions: {}
}), 'below')
addChart(getChart({
    id: 'chart2', margin,
    chartDimensions: {}
}), 'above')