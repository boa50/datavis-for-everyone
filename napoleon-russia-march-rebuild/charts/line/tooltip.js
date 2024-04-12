import { addLineTooltip } from "../../../components/tooltip/script.js"

export const addTooltip = ({ containerId, chart, data, cx, cy, radius = 4, htmlText, colour }) => {
    const { mouseover, mousemove, mouseleave } = addLineTooltip(containerId, htmlText, colour)

    chart
        .append('g')
        .selectAll('.dot')
        .data(data)
        .join('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', radius)
        .attr('stroke', 'transparent')
        .attr('stroke-width', 12)
        .attr('fill', 'transparent')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)
}