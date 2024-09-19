import { colours, addAxis, updateXaxis } from "../../node_modules/visual-components/index.js"
import { getRankingTransition } from "./transition.js"
import {
    xAxisFontSize,
    flagWidth,
    flagToBarPadding,
    rankingToFlagPadding,
    rankingFontSize,
    countryNamePadding,
    countryNameFontSize
} from "../sizes.js"

const xFormat = d3.format('.2s')

export const plotAxis = (chart, x, height, width, xLabel) => {
    addAxis({
        chart,
        height,
        width,
        colour: colours.paletteLightBg.axis,
        fontSize: xAxisFontSize,
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

export const appendFlag = (g, x, y) => {
    g
        .append('image')
        .attr('class', 'country-flag')
        .attr('width', flagWidth)
        .attr('height', y.bandwidth())
        .attr('x', x(0) - flagWidth - flagToBarPadding)
        .attr('y', 0)
        .attr('preserveAspectRatio', 'none')
        .attr('xlink:href', d => `../../_data/img/country-flags/${d.code}.webp`)
}

const countryRankingClass = '.country-ranking'

export const appendRanking = (g, x, y) => {
    g
        .append('text')
        .attr('class', countryRankingClass.slice(1))
        .attr('x', x(0) - flagWidth - flagToBarPadding - rankingToFlagPadding)
        .attr('y', y.bandwidth() / 2)
        .attr('font-size', rankingFontSize)
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
        .attr('x', x(0) + countryNamePadding)
        .attr('y', y.bandwidth() / 2)
        .attr('font-size', countryNameFontSize)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'start')
        .style('fill', colours.paletteLightBg.contrasting)
        .style('font-weight', 500)
        .style('stroke', 'black')
        .style('stroke-width', 0.5)
        .text(d => d.country)
}