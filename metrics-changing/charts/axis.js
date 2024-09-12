import { colours, addAxis, updateXaxis } from "../../../node_modules/visual-components/index.js"

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

export const appendRanking = (g, x, y, flagWidth) => {
    g
        .append('text')
        .attr('class', 'country-ranking')
        .attr('x', x(0) - flagWidth - 16)
        .attr('y', y.bandwidth() / 2)
        .attr('font-size', '1.2rem')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'end')
        .text(d => d.homicideNumberRank)
}