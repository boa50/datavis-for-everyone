import { colours, addAxis, updateXaxis, updateYaxis } from "../../../node_modules/visual-components/index.js"

const xFormat = d3.format('.2s')

export const plotAxis = (chart, x, y, height, width, xLabel) => {
    addAxis({
        chart,
        height,
        width,
        colour: colours.paletteLightBg.axis,
        x,
        // y,
        xFormat,
        xLabel,
        hideXdomain: true,
        // hideYdomain: true
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

    // updateYaxis({
    //     chart,
    //     y,
    //     hideDomain: true
    // })
}