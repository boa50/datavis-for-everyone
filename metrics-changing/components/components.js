import { createText, colours } from "../../../node_modules/visual-components/index.js"
import { addChart } from "../charts/chart.js"

export const addVisualComponents = async ({
    svg,
    visualisationsWidth,
    windowHeight
}) => {
    const chartWidth = 1080 < visualisationsWidth - 450 ? 1080 : visualisationsWidth - 450
    const chartHeight = windowHeight - 86
    const chartXposition = 64
    const chartYposition = (windowHeight - chartHeight) / 2 - 16

    const explanationText = createText({
        svg,
        x: chartXposition + chartWidth + 16,
        width: visualisationsWidth - chartWidth - chartXposition - 100,
        textColour: colours.paletteLightBg.axis,
        fontSize: '1.75rem',
        alignVertical: 'center',
        alignHorizontal: 'center',
        htmlText: ``
    })

    const chartProps = await addChart({
        svg,
        width: chartWidth,
        height: chartHeight,
        xPosition: chartXposition,
        yPosition: chartYposition
    })

    return { explanationText, chartProps }
}