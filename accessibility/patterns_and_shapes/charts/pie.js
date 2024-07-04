import { palette } from "../../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    chart.attr('transform', `translate(${[width / 2, height / 2]})`)

    const energySources = [...new Set(data.map(d => d.source))]
    const colourPalette = [palette.bluishGreen, palette.blue, palette.orange, palette.reddishPurple]

    const pieData = d3
        .pie()
        .value(d => d[1])
        .sort((a, b) => (a, b))
        (data.map(d => [d.source, d.generation]))

    const colour = d3
        .scaleOrdinal()
        .range(colourPalette)
        .domain(energySources)

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(height / 2)

    chart
        .selectAll('.my-slices')
        .data(pieData)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => colour(d.data[0]))
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .style('opacity', 0.9)
}