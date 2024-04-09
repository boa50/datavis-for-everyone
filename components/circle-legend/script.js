export const addLegend = (id, sizeScale, valuesToShow, position, colour) => {
    const svg = d3.select(`#${id}`)
        .append('g')

    const xLabel = position[0] + 50

    const getYpadding = i => {
        let min = 0
        let max = 1

        if (valuesToShow.length === 3) {
            max = 2
        }

        switch (i) {
            case min:
                return 10
            case max:
                return -10
            default:
                return 0
        }
    }

    // Circles
    svg
        .selectAll('legend')
        .data(valuesToShow)
        .join('circle')
        .attr('cx', position[0])
        .attr('cy', d => position[1] - sizeScale(d))
        .attr('r', d => sizeScale(d))
        .style('fill', 'none')
        .attr('stroke', colour)

    // Segments
    svg
        .selectAll('legend')
        .data(valuesToShow)
        .join('line')
        .attr('x1', (d, i) => position[0] - (getYpadding(i) / 8) + sizeScale(d))
        .attr('x2', xLabel)
        .attr('y1', (d, i) => position[1] + getYpadding(i) - sizeScale(d))
        .attr('y2', (d, i) => position[1] + getYpadding(i) - sizeScale(d))
        .attr('stroke', colour)
        .style('stroke-dasharray', ('2,2'))

    // Labels
    svg
        .selectAll('legend')
        .data(valuesToShow)
        .join('text')
        .attr('x', xLabel)
        .attr('y', (d, i) => position[1] + getYpadding(i) - sizeScale(d))
        .text(d => d)
        .attr('font-size', 10.5)
        .attr('fill', colour)
}
