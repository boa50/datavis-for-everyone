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

export const addLineTooltip = (id, htmlText, colour) => {
    const { mouseover, mousemove, mouseleave } = addTooltip(id, htmlText)

    const customMouseOver = function (event, d) {
        d3.select(this).attr('fill', colour)
        mouseover(event, d)
    }
    const customMouseLeave = function (event, d) {
        d3.select(this).attr('fill', 'transparent')
        mouseleave(event, d)
    }

    return { mouseover: customMouseOver, mousemove, mouseleave: customMouseLeave }
}