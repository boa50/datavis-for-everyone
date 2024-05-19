import { addVerticalLegend as addLegend } from '../../node_modules/visual-components/index.js'
import { piePalette } from '../constants.js'

export const addChart = ({
    chartProps,
    data,
    radius = 230
}) => {
    const { chart, width, height } = chartProps

    chart.attr('transform', `translate(${[width / 1.5, height / 2]})`)

    const pieData = d3
        .pie()
        .value(d => d[1])
        .sort((a, b) => (a, b))
        (Object.entries(data))

    const colour = d3
        .scaleOrdinal()
        .range(piePalette)

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    chart
        .selectAll('.my-slices')
        .data(pieData)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => colour(d.data[0]))
        .attr('stroke', 'white')
        .style('stroke-width', '1px')
        .style('opacity', 0.9)

    chart
        .selectAll('.my-slices')
        .data(pieData)
        .join('text')
        .attr('class', 'font-bold text-lg')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('transform', d => `translate(${arc.centroid(d).map((d, i) => d * [1.4, 1.25][i])})`)
        .text(d => `${d.data[1]}%`)

    addLegend({
        chart,
        legends: Object.keys(data),
        colours: piePalette,
        xPosition: -width / 1.7,
        yPosition: -height / 5
    })
}