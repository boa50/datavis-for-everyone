export const scatterplotV1 = (chart, data, radius, colour, x, y, tooltips) => {
    const { mouseover, mousemove, mouseleave } = tooltips

    chart
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', d => x(d.long))
        .attr('cy', d => y(d.lat))
        .attr('r', d => radius(d.deaths))
        .style('fill', d => colour(d.direction))
        .style('opacity', 0.5)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)
}