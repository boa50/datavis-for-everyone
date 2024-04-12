import { addTooltip } from "./tooltip.js"

export const lineV2 = (chart, width, height, data, temperatures, x, ySurvivors, temperatureColours) => {
    // Temperatures
    // Based on: https://stackoverflow.com/questions/70866817/d3-js-area-filled-with-lineargradient-color-interpolation-bledning-in-chrome
    chart
        .append('defs')
        .append('linearGradient')
        .attr('id', 'temperatures-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('x2', width)
        .selectAll('stop')
        .data(temperatures)
        .join('stop')
        .attr('offset', d => x(d.long) / width)
        .attr('stop-color', d => temperatureColours(d['temp C']))
        .attr('stop-opacity', 0.7)

    chart
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'url(#temperatures-gradient)')

    // Survivors
    const line = d3
        .line()
        .x(d => x(d.long))
        .y(d => ySurvivors(d.survivors))

    chart
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#b45309')
        .attr('stroke-width', 5)
        .attr('d', d => line(d))

    addTooltip({
        containerId: 'line-v2-container',
        chart: chart,
        data: data,
        cx: d => x(d.long),
        cy: d => ySurvivors(d.survivors),
        radius: 6,
        colour: '#b45309',
        htmlText: d => `Survivors: ${d.survivors}`
    })
}