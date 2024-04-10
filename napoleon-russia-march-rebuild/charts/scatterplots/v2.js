export const scatterplotV2 = (chart, height, data, groupSymbol, size, colour, x, y, tooltips) => {
    const { showTooltip, moveTooltip, hideTooltip } = tooltips

    chart
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))

    chart
        .append('g')
        .call(d3.axisLeft(y))

    chart
        .selectAll('.dt-points')
        .data(data)
        .join('path')
        .attr('d', d3.symbol().type(d => groupSymbol(d.group)).size(d => Math.pow(size(d.deaths), 2) * Math.PI))
        .style('fill', d => colour(d.direction))
        .style('fill-opacity', 0.3)
        .style('stroke', d => colour(d.direction))
        .attr('stroke-width', 0.5)
        .attr('transform', d => `translate(${[x(d.long), y(d.lat)]})`)
        .on('mouseover', showTooltip)
        .on('mousemove', moveTooltip)
        .on('mouseleave', hideTooltip)
}