export const addAxis = (chart, height, width, margin, x, y, colour) => {
    const xAxis = chart
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(
            d3
                .axisBottom(x)
                .tickSize(0)
                .tickPadding(10)
        )

    xAxis
        .append('text')
        .attr('x', (width + margin.right) / 2)
        .attr('y', 35)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .text('Longitude')

    xAxis
        .select('.domain')
        .attr('stroke', colour)

    xAxis
        .selectAll('text')
        .attr('fill', colour)


    const yAxis = chart
        .append('g')
        .call(
            d3
                .axisLeft(y)
                .tickSize(0)
                .tickPadding(10)
        )

    yAxis
        .append('text')
        .attr('x', -((height - margin.bottom) / 2))
        .attr('y', -50)
        .attr('font-size', 12)
        .attr('transform', 'rotate(270)')
        .attr('text-anchor', 'middle')
        .text('Latitude')

    yAxis
        .select('.domain')
        .attr('stroke', colour)

    yAxis
        .selectAll('text')
        .attr('fill', colour)
}