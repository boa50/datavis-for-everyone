import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const dataGrouped = d3.flatRollup(data, D => D.reduce((t, c) => t + c.govSpending, 0) / D.length, d => d.group)

    const x = d3
        .scaleBand()
        .domain(dataGrouped.map(d => d[0]))
        .range([0, width])
        .padding(.25)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(dataGrouped, d => d[1] * 1.25)])
        .range([height, 0])

    chart
        .selectAll('.data-point')
        .data(dataGrouped)
        .join('rect')
        .attr('class', 'data-point')
        .attr('x', d => x(d[0]))
        .attr('y', d => y(d[1]))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d[1]))
        .attr('fill', palette.blue)

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y
    })
}