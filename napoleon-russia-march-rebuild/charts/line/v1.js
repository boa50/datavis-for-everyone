import { adjustColours } from '../axis.js'
import { buildTooltip } from '../../../components/tooltip/script.js'

export const lineV1 = (chart, width, height, dataPerGroup, temperatures, x, ySurvivors, yTemperature, marginBottom, axisColour) => {
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

    const { mouseover, mousemove, mouseleave } = buildTooltip('line-v1-container', (d) => `Temperature: ${d['temp C']}°C`)
    const customMouseOver = function (event, d) {
        d3.select(this).attr('fill', temperatureColour)
        mouseover(event, d)
    }
    const customMouseLeave = function (event, d) {
        d3.select(this).attr('fill', 'transparent')
        mouseleave(event, d)
    }

    chart
        .append('g')
        .selectAll('.dot')
        .data(temperatures)
        .join('circle')
        .attr('cx', d => x(d.long))
        .attr('cy', d => yTemperature(d['temp C']))
        .attr('r', 4)
        .attr('stroke', 'transparent')
        .attr('stroke-width', 12)
        .attr('fill', 'transparent')
        .on('mouseover', customMouseOver)
        .on('mousemove', mousemove)
        .on('mouseleave', customMouseLeave)


    // Survivors
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

    chart
        .append('g')
        .selectAll('.dot')
        .data(dataPerGroup)
        .join('circle')
        .attr('class', 'crazydot')
        .attr('cx', d => { console.log(d); return x(d.long) })
        .attr('cy', d => ySurvivors(d.survivors))
        .attr('r', 4)
        .attr('stroke', 'transparent')
        .attr('stroke-width', 12)
        .attr('fill', 'transparent')
        .on('mouseover', customMouseOver)
        .on('mousemove', mousemove)
        .on('mouseleave', customMouseLeave)

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