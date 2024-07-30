import { addAxis, addHighlightTooltip } from "../../node_modules/visual-components/index.js"
import { palette } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const dataGrouped = d3.flatRollup(data, D => D.length, d => d.latitude_grp, d => d.longitude_grp)

    const x = d3
        .scaleBand()
        .domain(getGroups(data, 'longitude_grp'))
        .range([0, width])
        .padding(0.1)

    const y = d3
        .scaleBand()
        .domain(getGroups(data, 'latitude_grp'))
        .range([height, 0])
        .padding(0.3)

    const colour = d3
        .scaleLog()
        .range([d3.hsl(palette.skyBlue).brighter(1), d3.hsl(palette.blue).darker(2.5)])
        .domain(d3.extent(dataGrouped, d => d[2]))

    chart
        .selectAll('.data-point')
        .data(dataGrouped)
        .join('rect')
        .attr('class', 'data-point')
        .attr('x', d => x(d[1]))
        .attr('y', d => y(d[0]))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('rx', 4)
        .attr('ry', 4)
        .style('fill', d => colour(d[2]))

    const xAxisShow = [-170, -130, -90, -50, 0, 50, 90, 130, 170]
    const yAxisShow = [-50, -30, 0, 30, 60]

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y,
        xLabel: 'Longitude',
        yLabel: 'Latitude',
        xFormat: d => xAxisShow.includes(d) ? formatGrad(d) : null,
        yFormat: d => yAxisShow.includes(d) ? formatGrad(d) : null,
        hideXdomain: true,
        hideYdomain: true
    })

    // Tooltip
    const tooltipElements = chart
        .selectAll('.tooltip-point')
        .data(dataGrouped)
        .join('rect')
        .attr('class', 'tooltip-point')
        .attr('x', d => x(d[1]))
        .attr('y', d => y(d[0]))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('stroke-width', 4)
        .attr('stroke', palette.orange)
        .attr('opacity', 0)
        .style('fill', 'transparent')

    addHighlightTooltip({
        chart,
        htmlText: d => `
        <div style="display: flex; justify-content: space-between">
            <span>Latitude:&emsp;</span>
            <span>${formatGrad(d[0])}</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Longitude:&emsp;</span>
            <span>${formatGrad(d[1])}</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Number of events:&emsp;</span>
            <span>${d[2]}</span>
        </div>
        `,
        elements: tooltipElements,
        highlightedOpacity: 0.75,
        initialOpacity: 0,
        fadedOpacity: 0
    })
}

function getGroups(data, field) {
    return [...new Set(data.map(d => d[field]).sort((a, b) => a - b))]
}

function formatGrad(value) {
    return `${value}°`
}