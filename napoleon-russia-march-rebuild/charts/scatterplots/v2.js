export const scatterplotV2 = (chart, data, groupSymbol, size, colour, x, y, tooltips) => {
    const { mouseover, mousemove, mouseleave } = tooltips

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
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)
}