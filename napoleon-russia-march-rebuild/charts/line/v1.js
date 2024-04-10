export const lineV1 = (chart, width, height, dataPerGroup, temperatures, x, ySurvivors, yTemperature, marginBottom, axisColour) => {
    // Temperatures
    const area = d3
        .area()
        .x(d => x(d.long))
        .y0(yTemperature(0))
        .y1(d => yTemperature(d['temp C']))

    chart
        .append('path')
        .datum(temperatures)
        .attr('fill', '#cbd5e1')
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 1)
        .attr('fill-opacity', 0.5)
        .attr('d', d => area(d))

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
        .attr('stroke-width', 1.5)
        .attr('d', d => line(d[1]))


    const yAxisRight = chart
        .append('g')
        .attr('transform', `translate(${width}, 0)`)
        .call(
            d3
                .axisRight(yTemperature)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(d => `${d} °C`)
        )

    yAxisRight
        .append('text')
        .attr('x', ((height - marginBottom) / 2))
        .attr('y', -55)
        .attr('font-size', 12)
        .attr('transform', 'rotate(90)')
        .attr('text-anchor', 'middle')
        .text('Temperature')

    yAxisRight
        .select('.domain')
        .attr('stroke', axisColour)

    yAxisRight
        .selectAll('text')
        .attr('fill', axisColour)
}