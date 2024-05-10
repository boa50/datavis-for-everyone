import { colours } from "../constants.js"
import { addAxis } from "../../components/axis/script.js"

export const addChart = (chartProps, data, highlighted) => {
    const { chart, width, height } = chartProps

    const x = d3
        .scaleLinear()
        .domain([0, d3.max(Object.values(data)) * 1.1])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(Object.keys(data))
        .range([0, height])
        .padding(.1)

    const colour = label => {
        if (highlighted) {
            if (label === highlighted) return colours.default
            else return `${colours.default}50`
        }

        return colours.default
    }

    chart
        .selectAll('.my-bars')
        .data(Object.entries(data))
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => y(d[0]))
        .attr('width', d => x(d[1]))
        .attr('height', y.bandwidth())
        .attr('fill', d => colour(d[0]))

    chart
        .selectAll('.my-bars')
        .data(Object.entries(data))
        .join('text')
        .attr('x', d => x(d[1]) + 8)
        .attr('y', d => y(d[0]) + y.bandwidth() / 2)
        .attr('class', 'font-medium text-base')
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .attr('fill', colours.axis)
        .text(d => `${d[1]}%`)

    addAxis({
        chart,
        height,
        width,
        y,
        hideYdomain: true,
        colour: colours.axis
    })
}