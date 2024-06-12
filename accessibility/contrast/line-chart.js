import { addAxis, addLegend, addLineTooltip } from "../../node_modules/visual-components/index.js"
import { palette, defaultColours as colours } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    const paletteColours = [palette.bluishGreen, palette.blue, palette.vermillion, palette.reddishPurple]
    const energySources = [...new Set(data.map(d => d.source))]

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.generation) * 1.15])
        .range([height, 0])

    const dataPerGroup = d3.group(data, d => d.source)
    const colour = d3
        .scaleOrdinal()
        .domain(energySources)
        .range(paletteColours)

    const line = d3
        .line()
        .x(d => x(d.year))
        .y(d => y(d.generation))

    chart
        .selectAll('.data-line')
        .data(dataPerGroup)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d => colour(d[0]))
        .attr('stroke-width', 5)
        .attr('d', d => line(d[1]))

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        colour: colours.axis,
        yLabel: 'Generation (TWh)',
        xFormat: d => d,
        yFormat: d => d,
        xNumTicks: 5,
        yTickValues: [0, 1000, 2000, 3000, 4000, 5000],
        xNumTicksForceInitial: true,
        yNumTicksForceInitial: true,
        hideXdomain: true,
        hideYdomain: true
    })

    addLegend({
        chart,
        legends: energySources,
        colours: paletteColours,
        xPosition: -margin.left,
        yPosition: -margin.top + 14
    })

    addLineTooltip({
        chart,
        htmlText: d => `
        <strong>${d.source} - ${d.year}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Generation:&emsp;</span>
            <span>${d.generation} TWh</span>
        </div>
        `,
        colour: d => colour(d.source),
        radius: 6,
        data,
        cx: d => x(d.year),
        cy: d => y(d.generation),
        chartWidth: width,
        chartHeight: height
    })
}