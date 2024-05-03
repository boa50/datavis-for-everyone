chart
    .selectAll('.lollipop-group')
    .data(data)
    .join('g')
    .attr('class', 'lollipop-group')
    .call(g => {
        g
            .append('line')
            .attr('x1', d => x(Math.min(d.FIRST_VALUE, d.LAST_VALUE)))
            .attr('x2', d => x(Math.max(d.FIRST_VALUE, d.LAST_VALUE)))
            .attr('y1', d => y(d.GROUP) + y.bandwidth() / 2)
            .attr('y2', d => y(d.GROUP) + y.bandwidth() / 2)
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)

        g
            .append('circle')
            .attr('cx', d => x(d.FIRST_VALUE))
            .attr('cy', d => y(d.GROUP) + y.bandwidth() / 2)
            .attr('r', 5)
            .style('fill', '#69b3a2')

        g
            .append('circle')
            .attr('cx', d => x(d.LAST_VALUE))
            .attr('cy', d => y(d.GROUP) + y.bandwidth() / 2)
            .attr('r', 5)
            .style('fill', '#4C4082')
    })