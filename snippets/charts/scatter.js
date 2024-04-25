const colour = d3
    .scaleOrdinal()
    .domain(['GROUP1', 'GROUP2'])
    .range(['COLOUR1', 'COLOUR2'])

chart
    .selectAll('.data-points')
    .data(data)
    .join('circle')
    .attr('class', 'data-points')
    .attr('r', 3)
    .attr('fill', d => colour(d.COLOUR_GROUP))
    .style('opacity', 0.75)
    .attr('stroke', '#6b7280')
    .attr('stroke-width', 0.5)
    .transition()
    .attr('cx', d => x(d.X_VALUE))
    .attr('cy', d => y(d.Y_VALUE))