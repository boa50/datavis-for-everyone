import { createText, colours } from "../../../node_modules/visual-components/index.js"
import { addChart } from "../charts/chart.js"
import {
    explanationTextFontSize,
    chartTitleFontSize,
    getChartWidth,
    chartXposition,
    getChartHeight,
    getChartYposition,
    getExplanationTextX,
    getExplanationTextWidth,
    chartTitleX,
    getChartTitleYposition,
    getChartTitleWidth,
    chartTitleHeight
} from "../sizes.js"

export const addVisualComponents = async ({
    svg,
    visualisationsWidth,
    windowHeight
}) => {
    const explanationText = createText({
        svg,
        x: getExplanationTextX(visualisationsWidth),
        width: getExplanationTextWidth(visualisationsWidth),
        textColour: colours.paletteLightBg.axis,
        fontSize: explanationTextFontSize,
        alignVertical: 'center',
        alignHorizontal: 'center',
        htmlText: ``
    })

    const chartTitle = createText({
        svg: svg,
        x: chartTitleX,
        y: getChartTitleYposition(windowHeight),
        width: getChartTitleWidth(visualisationsWidth),
        height: chartTitleHeight,
        textColour: colours.paletteLightBg.axis,
        fontSize: chartTitleFontSize,
        htmlText: ``
    })

    const chartProps = await addChart({
        svg,
        width: getChartWidth(visualisationsWidth),
        height: getChartHeight(windowHeight),
        xPosition: chartXposition,
        yPosition: getChartYposition(windowHeight)
    })

    svg
        .append('text')
        .attr('transform', `translate(${[visualisationsWidth - 75, windowHeight - 25]})`)
        .attr('class', 'text-sm')
        .attr('fill', '#6b7280')
        .style('text-anchor', 'end')
        .text('Source: United Nations Office on Drugs and Crime (2023) – with minor processing by Our World in Data')

    return { chartProps, explanationText, chartTitle }
}