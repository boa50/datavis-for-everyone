import { colours } from "../constants.js"
import { addAxis } from "../../components/axis/script.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const x = d3
        .scaleLinear()
        .domain([0, d3.max(Object.values(data))])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(Object.keys(data))
        .range([0, height])
        .padding(.1)

    chart
        .selectAll('.myRect')
        .data(Object.entries(data))
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => y(d[0]))
        .attr('width', d => x(d[1]))
        .attr('height', y.bandwidth())
        .attr('fill', colours.default)

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Marketshare (%)',
        hideXdomain: true,
        hideYdomain: true,
        colour: colours.axis
    })
}