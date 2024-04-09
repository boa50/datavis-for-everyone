export const buildTooltip = (id, htmlText) => {
    const tooltip = d3.select(`#${id}`)
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', 'black')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('color', 'white')
        .style('position', 'fixed')

    const showTooltip = (event, d) => {
        tooltip
            .interrupt('hideTooltip')
            .transition('showTooltip')
            .duration(200)
        tooltip
            .html(htmlText(d))
            .style('left', `${event.x - 30}px`)
            .style('top', `${event.y + 30}px`)
            .style('opacity', 1)
    }
    const moveTooltip = event => {
        tooltip
            .style('left', `${event.x - 30}px`)
            .style('top', `${event.y + 30}px`)
    }
    const hideTooltip = () => {
        tooltip
            .interrupt('showTooltip')
            .transition('hideTooltip')
            .duration(200)
            .style('opacity', 0)
    }

    return { showTooltip, moveTooltip, hideTooltip }
}