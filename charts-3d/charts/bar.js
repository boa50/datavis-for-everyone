import { colours } from "../constants.js"
import { addAxis } from "../../components/axis/script.js"
import { addHighlightTooltip as addTooltip } from "../../components/tooltip/script.js"

export const addChart = (chartProps, data, highlighted) => {
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

    const colour = label => {
        if (highlighted) {
            if (label === highlighted) return colours.default
            else return `${colours.default}50`
        }

        return colours.default
    }

    const bars = chart
        .selectAll('.my-bars')
        .data(Object.entries(data))
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => y(d[0]))
        .attr('width', d => x(d[1]))
        .attr('height', y.bandwidth())
        .attr('fill', d => colour(d[0]))

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

    addTooltip(
        `${chart.attr('id').split('-')[0]}-container`,
        d => `
        <strong>${d[0]}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Marketshare:&emsp;</span>
            <span>${d[1]}%</span>
        </div>
        `,
        bars,
        { initial: 4, highlighted: 1, faded: 1 },
        { width, height }
    )
}