import { createText, colours, getTextWidth } from "../../node_modules/visual-components/index.js"
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
    chartTitleHeight,
    dataSourceFontSize,
    dataSourceHeight,
    getDataSourceYposition
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

    const dataSourceText = 'Source: United Nations Office on Drugs and Crime (2023) – with minor processing by Our World in Data'

    createText({
        svg,
        width: getTextWidth(dataSourceText, dataSourceFontSize),
        height: dataSourceHeight,
        x: chartTitleX,
        y: getDataSourceYposition(windowHeight),
        textColour: colours.paletteLightBg.axis,
        fontSize: dataSourceFontSize,
        htmlText: dataSourceText
    })

    return { chartProps, explanationText, chartTitle }
}