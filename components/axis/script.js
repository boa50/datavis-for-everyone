export const adjustColours = (g, colour) => {
    g.select('.domain').attr('stroke', colour)
    g.selectAll('text').attr('fill', colour)
}

export const addAxis = (
    {
        chart,
        height,
        width,
        margin = {},
        x,
        y,
        xLabel = '',
        yLabel = '',
        colour = 'black',
        xFormat = undefined,
        yFormat = undefined,
        xTickValues = undefined
    }
) => {
    chart
        .append('g')
        .attr('class', 'x-axis-group')
        .style('font-size', '0.8rem')
        .attr('transform', `translate(0, ${height})`)
        .call(
            d3
                .axisBottom(x)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(xFormat)
                .tickValues(xTickValues)
        )
        .call(g => g
            .append('text')
            .attr('x', width / 2)
            .attr('y', 45)
            .attr('text-anchor', 'middle')
            .text(xLabel))
        .call(g => adjustColours(g, colour))

    chart
        .append('g')
        .attr('class', 'y-axis-group')
        .style('font-size', '0.8rem')
        .call(
            d3
                .axisLeft(y)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(yFormat)
        )
        .call(g => g
            .append('text')
            .attr('x', -(height / 2))
            .attr('y', -50)
            .attr('transform', 'rotate(270)')
            .attr('text-anchor', 'middle')
            .text(yLabel))
        .call(g => adjustColours(g, colour))
}

export const updateXaxis = ({
    chart,
    x,
    format = undefined,
    tickValues = undefined
}) => {
    const colour = chart
        .select('.x-axis-group')
        .selectAll('text').attr('fill')

    chart
        .select('.x-axis-group')
        .transition()
        .call(
            d3
                .axisBottom(x)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(format)
                .tickValues(tickValues)
        )
        .call(g => adjustColours(g, colour))
}

export const updateYaxis = ({
    chart,
    y,
    format = undefined
}) => {
    const colour = chart
        .select('.y-axis-group')
        .selectAll('text').attr('fill')

    chart
        .select('.y-axis-group')
        .transition()
        .call(
            d3
                .axisLeft(y)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(format)
        )
        .call(g => adjustColours(g, colour))
}