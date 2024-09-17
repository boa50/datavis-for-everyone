import { createText, colours, getTextWidth } from "../../../node_modules/visual-components/index.js"
import { addChart } from "../charts/chart.js"

export const addVisualComponents = async ({
    svg,
    visualisationsWidth,
    windowHeight
}) => {
    const chartWidth = 1080 < visualisationsWidth - 450 ? 1080 : visualisationsWidth - 450
    const chartHeight = windowHeight - 128
    const chartXposition = 128
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

    const titleSize = '1.75rem'

    const chartTitle = createText({
        svg: svg,
        x: chartXposition - 48,
        y: chartYposition - 50,
        width: chartWidth + 48,
        height: 40,
        textColour: colours.paletteLightBg.axis,
        fontSize: titleSize,
        htmlText: ``
    })

    const chartProps = await addChart({
        svg,
        width: chartWidth,
        height: chartHeight,
        xPosition: chartXposition,
        yPosition: chartYposition
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