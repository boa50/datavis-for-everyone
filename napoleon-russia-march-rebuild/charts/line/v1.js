import { adjustColours } from '../axis.js'
import { addTooltip } from './tooltip.js'

export const lineV1 = (chart, width, height, data, temperatures, x, ySurvivors, yTemperature, marginBottom, axisColour) => {
    // Temperatures
    const area = d3
        .area()
        .x(d => x(d.long))
        .y0(yTemperature(0))
        .y1(d => yTemperature(d['temp C']))

    const temperatureColour = '#cbd5e1'

    chart
        .append('path')
        .datum(temperatures)
        .attr('fill', temperatureColour)
        .attr('stroke', temperatureColour)
        .attr('stroke-width', 1)
        .attr('fill-opacity', 0.5)
        .attr('d', d => area(d))

    addTooltip({
        containerId: 'line-v1-container',
        chart: chart,
        data: temperatures,
        cx: d => x(d.long),
        cy: d => yTemperature(d['temp C']),
        colour: temperatureColour,
        htmlText: d => `Temperature: ${d['temp C']}°C`
    })


    // Survivors
    const dataPerGroup = d3.group(data, d => d.group)
    const lineColours = d3
        .scaleOrdinal()
        .range(['#54A24B', '#F58518', '#B279A2'])

    const line = d3
        .line()
        .x(d => x(d.long))
        .y(d => ySurvivors(d.survivors))

    chart
        .selectAll('.drewLine')
        .data(dataPerGroup)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d => lineColours(d[0]))
        .attr('stroke-width', 3)
        .attr('d', d => line(d[1]))

    addTooltip({
        containerId: 'line-v1-container',
        chart: chart,
        data: data,
        cx: d => x(d.long),
        cy: d => ySurvivors(d.survivors),
        colour: d => lineColours(d.group),
        htmlText: d => `Group ${d.group} </br> Survivors: ${d.survivors}`
    })

    chart
        .append('g')
        .style('font-size', '0.8rem')
        .attr('transform', `translate(${width}, 0)`)
        .call(
            d3
                .axisRight(yTemperature)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(d => `${d}°C`)
        )
        .call(g => g
            .append('text')
            .attr('x', ((height - marginBottom) / 2))
            .attr('y', -60)
            .attr('transform', 'rotate(90)')
            .attr('text-anchor', 'middle')
            .text('Temperature'))
        .call(g => adjustColours(g, axisColour))
}