const SINGLE_LINE = () => {
    const line = d3
        .line()
        .x(d => xScale(d.X_VALUE))
        .y(d => yScale(d.Y_VALUE))

    chart
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#000000')
        .attr('stroke-width', 1)
        .attr('d', d => line(d))
}


const MULTIPLE_LINES = () => {
    const dataPerGroup = d3.group(data, d => d.group)
    const colour = d3
        .scaleOrdinal()
        .range(['#000000', '#FF0000'])

    const line = d3
        .line()
        .x(d => xScale(d.X_VALUE))
        .y(d => yScale(d.Y_VALUE))

    chart
        .selectAll('.drewLine')
        .data(dataPerGroup)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d => colour(d[0]))
        .attr('stroke-width', 1)
        .attr('d', d => line(d[1]))
}