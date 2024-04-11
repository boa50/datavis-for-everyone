export const adjustColours = (g, colour) => {
    g.select('.domain').attr('stroke', colour)
    g.selectAll('text').attr('fill', colour)
}

export const addAxis = (
    {
        chart,
        height,
        width,
        margin,
        x,
        y,
        xLabel = '',
        yLabel = '',
        colour = 'black',
        xFormat = undefined,
        yFormat = undefined }
) => {
    chart
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(
            d3
                .axisBottom(x)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(xFormat)
        )
        .call(g => g
            .append('text')
            .attr('x', (width + margin.right) / 2)
            .attr('y', 35)
            .attr('font-size', 12)
            .attr('text-anchor', 'middle')
            .text(xLabel))
        .call(g => adjustColours(g, colour))

    chart
        .append('g')
        .call(
            d3
                .axisLeft(y)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(yFormat)
        )
        .call(g => g
            .append('text')
            .attr('x', -((height - margin.bottom) / 2))
            .attr('y', -50)
            .attr('font-size', 12)
            .attr('transform', 'rotate(270)')
            .attr('text-anchor', 'middle')
            .text(yLabel))
        .call(g => adjustColours(g, colour))
}