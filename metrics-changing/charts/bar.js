import { colours } from "../../../node_modules/visual-components/index.js"

const barClass = '.country-bar'

export const appendBar = (g, x, y, metric, transition) => {
    g
        .append('rect')
        .attr('class', barClass.slice(1))
        .attr('height', y.bandwidth())
        .attr('x', x(0))
        .attr('y', 0)
        .attr('fill', colours.paletteLightBg.blue)
        .transition(transition)
        .attr('width', d => x(d[metric]))
}

export const updateBar = (g, x, metric, transition) => {
    g
        .selectAll(barClass)
        .transition(transition)
        .attr('width', d => x(d[metric]))
}

export const highlightBarColour = chart => {
    const highlightedCountries = ['Brazil', 'Nigeria', 'India']

    chart
        .selectAll(barClass)
        .transition('highlightBarColour')
        .duration(1000)
        .attr('fill', d => highlightedCountries.includes(d.country) ? colours.paletteLightBg.orange : colours.paletteLightBg.blue)
}

export const defaultBarColour = chart => {
    chart
        .selectAll(barClass)
        .transition('defaultBarColour')
        .duration(1000)
        .attr('fill', colours.paletteLightBg.blue)
}