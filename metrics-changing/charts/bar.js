import { colours } from "../../../node_modules/visual-components/index.js"
import { getBarTransition, getBarColourTransition } from "./transition.js"

const barClass = '.country-bar'

export const appendBar = (g, x, y, metric) => {
    g
        .append('rect')
        .attr('class', barClass.slice(1))
        .attr('height', y.bandwidth())
        .attr('x', x(0))
        .attr('y', 0)
        .attr('fill', colours.paletteLightBg.blue)
        .transition(getBarTransition())
        .attr('width', d => x(d[metric]))
}

export const updateBar = (g, x, metric) => {
    g
        .selectAll(barClass)
        .transition(getBarTransition())
        .attr('width', d => x(d[metric]))
}

export const highlightBarColour = chart => {
    const highlightedCountries = ['Brazil', 'Nigeria', 'India']

    chart
        .selectAll(barClass)
        .transition(getBarColourTransition())
        .attr('fill', d => highlightedCountries.includes(d.country) ? colours.paletteLightBg.orange : colours.paletteLightBg.blue)
}

export const defaultBarColour = chart => {
    chart
        .selectAll(barClass)
        .transition(getBarColourTransition())
        .attr('fill', colours.paletteLightBg.blue)
}