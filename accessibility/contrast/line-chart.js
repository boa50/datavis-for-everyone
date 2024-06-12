import { addAxis, addLegend } from "../../node_modules/visual-components/index.js"
import { palette, defaultColours as colours } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.month))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.temperature).map((d, i) => d * [0.95, 1.05][i]))
        .range([height, 0])

    const dataPerGroup = d3.group(data, d => d.year)
    const colour = d3
        .scaleOrdinal()
        .range(Object.values(palette))

    const line = d3
        .line()
        .x(d => x(d.month))
        .y(d => y(d.temperature))

    chart
        .selectAll('.data-line')
        .data(dataPerGroup)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d => colour(d[0]))
        .attr('stroke-width', 3)
        .attr('d', d => line(d[1]))

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        colour: colours.axis,
        xLabel: 'Month',
        yLabel: 'Temperature (°C)',
        xFormat: d => getMonthName(d, 'short'),
        yFormat: d => d,
        yNumTicks: 4,
        hideXdomain: true,
        hideYdomain: true
    })

    addLegend({
        chart,
        legends: [...new Set(data.map(d => d.year))],
        colours: Object.values(palette),
        xPosition: -margin.left
    })
}

function getMonthName(month, type = 'long') {
    return (new Date(1900, month - 1)).toLocaleString('default', { month: type })
}