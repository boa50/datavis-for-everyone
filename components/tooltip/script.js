export const addTooltip = (id, htmlText) => {
    const tooltip = d3.select(`#${id}`)
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', 'black')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('color', 'white')
        .style('position', 'fixed')

    const mouseover = (event, d) => {
        tooltip
            .interrupt('mouseleave')
            .transition('mouseover')
            .duration(200)
        tooltip
            .html(htmlText(d))
            .style('left', `${event.x - 30}px`)
            .style('top', `${event.y + 30}px`)
            .style('opacity', 1)
    }
    const mousemove = event => {
        tooltip
            .style('left', `${event.x - 30}px`)
            .style('top', `${event.y + 30}px`)
    }
    const mouseleave = () => {
        tooltip
            .interrupt('mouseover')
            .style('left', '-1000px')
            .style('top', '-1000px')
            .transition('mouseleave')
            .duration(200)
            .style('opacity', 0)
    }

    return { mouseover, mousemove, mouseleave }
}

export const addLineTooltip = (id, htmlText, colour, elements = {
    chart: undefined,
    data,
    cx,
    cy,
    radius: 4
}) => {
    const { mouseover, mousemove, mouseleave } = addTooltip(id, htmlText)

    const customMouseOver = function (event, d) {
        d3.select(this).attr('fill', colour)
        mouseover(event, d)
    }
    const customMouseLeave = function (event, d) {
        d3.select(this).attr('fill', 'transparent')
        mouseleave(event, d)
    }

    if (elements.chart !== undefined) {
        elements.chart
            .append('g')
            .selectAll('.dot')
            .data(elements.data)
            .join('circle')
            .attr('cx', elements.cx)
            .attr('cy', elements.cy)
            .attr('r', elements.radius)
            .attr('stroke', 'transparent')
            .attr('stroke-width', 12)
            .attr('fill', 'transparent')
            .on('mouseover', customMouseOver)
            .on('mousemove', mousemove)
            .on('mouseleave', customMouseLeave)
    }

    return { mouseover: customMouseOver, mousemove, mouseleave: customMouseLeave }
}

export const addHighlightTooltip = (
    id, htmlText, elements,
    opacity = {
        initial: 0.75, highlighted: 1, faded: 0.25
    }
) => {
    const { mouseover, mousemove, mouseleave } = addTooltip(id, htmlText)

    const customMouseOver = function (event, d) {
        elements.style('opacity', opacity.faded)
        d3.select(this).style('opacity', opacity.highlighted)
        mouseover(event, d)
    }
    const customMouseLeave = function (event, d) {
        elements.style('opacity', opacity.initial)
        mouseleave(event, d)
    }

    elements
        .on('mouseover', customMouseOver)
        .on('mousemove', mousemove)
        .on('mouseleave', customMouseLeave)
}