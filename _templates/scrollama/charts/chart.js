import { colours } from "../../../node_modules/visual-components/index.js"
import { createChartContainer } from "../utils.js"

const data = [
    { group: 'a', value: 1 },
    { group: 'b', value: 2 },
    { group: 'c', value: 3 },
]

const data2 = [
    { group: 'a', value: 1 },
    { group: 'b', value: 5 },
    { group: 'c', value: 3 },
]

export const addChart = ({ svg, width, height, xPosition, yPosition }) => {
    const chart = createChartContainer('test-id', svg, xPosition, yPosition)

    const x = d3
        .scaleBand()
        .domain(data.map(d => d.group))
        .range([0, width])
        .padding(.1)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data2, d => d.value)])
        .range([height, 0])

    const chartProps = { chart, x, y, height }

    updateChart(chartProps, data)

    return chartProps
}

function updateChart(chartProps, data) {
    const { chart, x, y, height } = chartProps

    // Check for on course transitions
    const chartNodes = chart.selectAll('.data-point').nodes()
    if (chartNodes.length > 0 &&
        d3.active(chartNodes[0], 'plotChart')) return

    chart
        .selectAll('.data-point')
        .data(data)
        .join('rect')
        .attr('class', 'data-point')
        .attr('x', d => x(d.group))
        .attr('width', x.bandwidth())
        .attr('fill', colours.paletteLightBg.blue)
        .transition('plotChart')
        .attr('y', d => y(d.value))
        .attr('height', d => height - y(d.value))

}

export function updateChart1(chartProps) {
    updateChart(chartProps, data)
}

export function updateChart2(chartProps) {
    updateChart(chartProps, data2)
}