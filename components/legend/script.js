// Based on: https://www.geeksforgeeks.org/calculate-the-width-of-the-text-in-javascript/
const getTextWidth = txt => {

    const text = document.createElement('span');
    document.body.appendChild(text);

    text.style.font = 'times new roman';
    text.style.fontSize = 16 + 'px';
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = txt;

    const width = Math.ceil(text.clientWidth);
    document.body.removeChild(text);

    return width
}

export const addLegend = (id, legends, colours = 'black', shapes = undefined, xPadding = 0, xPos = 1, yPos = 15) => {
    const legend = d3
        .select(`#${id}`)
        .attr('height', 20)
        .style('width', '100%')
        .append('g')
        .attr('transform', `translate(${[xPos, yPos]})`)

    let xSpace = 0
    legends.forEach((legendText, idx) => {
        if (idx > 0) {
            legend
                .append('text')
                .attr('x', xSpace + xPadding)
                .attr('y', 0)
                .attr('fill', '#a3a3a3')
                .text('|')

            if (shapes !== undefined) {
                xSpace += 15 + xPadding
            } else {
                xSpace += 10 + xPadding
            }
        }

        const colour = Array.isArray(colours) === true ? colours[idx] : colours

        if (shapes !== undefined) {
            if (xSpace == 0) xSpace += 5

            legend
                .append('path')
                .attr('d', shapes[idx])
                .attr('transform', `translate(${xSpace}, -4)`)
                .attr('fill', colour)

            xSpace += 10 + xPadding
        }

        legend
            .append('text')
            .attr('x', xSpace)
            .attr('y', 0)
            .attr('font-weight', 700)
            .attr('font-size', 14)
            .attr('fill', colour)
            .text(legendText)

        xSpace += getTextWidth(legendText)
    })
}