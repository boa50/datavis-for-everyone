import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const x = d3
        .scaleBand()
        .domain(data.map(d => d.group))
        .range([0, width])
        .padding(.25)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.max * 1.05)])
        .range([height, 0])

    chart
        .selectAll('.variance-line')
        .data(data)
        .join('line')
        .attr('class', 'variance-line')
        .attr('x1', d => x(d.group) + (x.bandwidth() / 2))
        .attr('x2', d => x(d.group) + (x.bandwidth() / 2))
        .attr('y1', d => y(d.min))
        .attr('y2', d => y(d.max))
        .attr('stroke-width', 3)
        .attr('stroke', palette.axis)

    const addDivisor = field => {
        const divisorWidth = 26
        chart
            .selectAll('.divisor-line')
            .data(data)
            .join('line')
            .attr('x1', d => x(d.group) + (x.bandwidth() / 2) - (divisorWidth / 2))
            .attr('x2', d => x(d.group) + (x.bandwidth() / 2) + (divisorWidth / 2))
            .attr('y1', d => y(d[field]))
            .attr('y2', d => y(d[field]))
            .attr('stroke-width', 2)
            .attr('stroke', palette.axis)
    }

    addDivisor('min')
    addDivisor('max')

    chart
        .selectAll('.data-box')
        .data(data)
        .join('rect')
        .attr('class', 'data-box')
        .attr('x', d => x(d.group))
        .attr('y', d => y(d.q3))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.iqr))
        .attr('fill', palette.blue)

    chart
        .selectAll('.median-line')
        .data(data)
        .join('line')
        .attr('x1', d => x(d.group))
        .attr('x2', d => x(d.group) + x.bandwidth())
        .attr('y1', d => y(d.median))
        .attr('y2', d => y(d.median))
        .attr('stroke-width', 2)
        .attr('stroke', palette.contrasting)

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y,
        yNumTicks: 4,
        yNumTicksForceInitial: true
    })
}