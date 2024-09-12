import { colours } from "../../../node_modules/visual-components/index.js"

export const appendBar = (g, x, y, metric, transition) => {
    g
        .append('rect')
        .attr('height', y.bandwidth())
        .attr('x', x(0))
        .attr('y', 0)
        .attr('fill', d => d.country === 'Brazil' ? colours.paletteLightBg.bluishGreen : colours.paletteLightBg.blue)
        .transition(transition)
        .attr('width', d => x(d[metric]))
}

export const updateBar = (g, x, metric, transition) => {
    g
        .selectAll('rect')
        .transition(transition)
        .attr('width', d => x(d[metric]))
}