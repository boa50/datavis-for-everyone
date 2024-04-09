export const scatterplotV1 = (chart, height, data, size, colour, x, y) => {
    chart
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))

    chart
        .append('g')
        .call(d3.axisLeft(y))

    chart
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', d => x(d.long))
        .attr('cy', d => y(d.lat))
        .attr('r', d => size(d.deaths) / 70)
        .style('fill', d => colour(d.direction))
        .style('opacity', 0.5)
}