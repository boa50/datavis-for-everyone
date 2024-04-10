export const addAxis = (chart, height, width, margin, x, y, xLabel, yLabel, colour, xFormat = undefined, yFormat = undefined) => {
    const xAxis = chart
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(
            d3
                .axisBottom(x)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(xFormat)
        )

    xAxis
        .append('text')
        .attr('x', (width + margin.right) / 2)
        .attr('y', 35)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .text(xLabel)

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
                .tickFormat(yFormat)
        )

    yAxis
        .append('text')
        .attr('x', -((height - margin.bottom) / 2))
        .attr('y', -50)
        .attr('font-size', 12)
        .attr('transform', 'rotate(270)')
        .attr('text-anchor', 'middle')
        .text(yLabel)

    yAxis
        .select('.domain')
        .attr('stroke', colour)

    yAxis
        .selectAll('text')
        .attr('fill', colour)
}