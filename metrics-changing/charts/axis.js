import { colours, addAxis, updateXaxis } from "../../../node_modules/visual-components/index.js"

const xFormat = d3.format('.2s')

export const plotAxis = (chart, x, y, height, width, xLabel) => {
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

export const updateAxis = (chart, x, y, xLabel) => {
    updateXaxis({
        chart,
        x,
        format: xFormat,
        hideDomain: true,
        label: xLabel
    })
}