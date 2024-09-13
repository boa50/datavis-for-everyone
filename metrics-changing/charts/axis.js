import { colours, addAxis, updateXaxis } from "../../../node_modules/visual-components/index.js"
import { getRankingTransition } from "./transition.js"

const xFormat = d3.format('.2s')

export const plotAxis = (chart, x, height, width, xLabel) => {
    addAxis({
        chart,
        height,
        width,
        colour: colours.paletteLightBg.axis,
        x,
        xFormat,
        xLabel,
        hideXdomain: true,
    })
}

export const updateAxis = (chart, x, xLabel) => {
    updateXaxis({
        chart,
        x,
        format: xFormat,
        hideDomain: true,
        label: xLabel
    })
}

export const appendFlag = (g, x, y, flagWidth) => {
    g
        .append('image')
        .attr('class', 'country-flag')
        .attr('width', flagWidth)
        .attr('height', y.bandwidth())
        .attr('x', x(0) - flagWidth - 4)
        .attr('y', 0)
        .attr('preserveAspectRatio', 'none')
        .attr('xlink:href', d => `/_data/img/country-flags/${d.code}.webp`)
}

const countryRankingClass = '.country-ranking'

export const appendRanking = (g, x, y, flagWidth) => {
    g
        .append('text')
        .attr('class', countryRankingClass.slice(1))
        .attr('x', x(0) - flagWidth - 16)
        .attr('y', y.bandwidth() / 2)
        .attr('font-size', '1.2rem')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'end')
        .style('opacity', 0)
        .style('fill', colours.paletteLightBg.axis)
        .text(d => d.homicideNumberRank)
}

export const showRanking = chart => {
    chart
        .selectAll(countryRankingClass)
        .transition(getRankingTransition())
        .style('opacity', 1)
}

export const hideRanking = chart => {
    chart
        .selectAll(countryRankingClass)
        .transition(getRankingTransition())
        .style('opacity', 0)
}

export const appendCountryName = (g, x, y) => {
    g
        .append('text')
        .attr('class', 'country-name')
        .attr('x', x(0) + 8)
        .attr('y', y.bandwidth() / 2)
        .attr('font-size', '1rem')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'start')
        .style('fill', colours.paletteLightBg.contrasting)
        .text(d => d.country)
}