import { addAxis, addLegend, addLineTooltip } from '../../node_modules/visual-components/index.js'
import { palette, defaultColours as colours } from '../../colours.js'

export const addChart = (chartProps, data, axesContrast = 'normal', coloursContrast = 'normal') => {
    const { chart, width, height, margin } = chartProps

    const standardColours = [palette.bluishGreen, palette.blue, palette.vermillion, palette.reddishPurple]

    let axesColour = colours.axis
    let lineColours = standardColours

    switch (axesContrast) {
        case 'bad':
            axesColour = '#a3a3a3'
            break;
        case 'good':
            axesColour = '#737373'
            break;
        case 'excellent':
            axesColour = '#525252'
            break;
        case 'goodDark':
            axesColour = '#a3a3a3'
            break;
    }

    switch (coloursContrast) {
        case 'bad':
            lineColours = standardColours.map(c => d3.hsl(c).brighter(1))
            break;
        case 'good':
            lineColours = standardColours.map(c => d3.hsl(c).darker(0.6))
            break;
        case 'excellent':
            lineColours = standardColours.map(c => d3.hsl(c).darker(1.35))
            break;
        case 'goodBetween':
            lineColours = standardColours.map(c => d3.hsl(c).darker(0.6))
            break;
        case 'excellentBetween':
            lineColours = ['#00523c', '#005c90', '#f46c00', '#010001']
            break;
        case 'goodDark':
            lineColours = ['#00926a', '#0086d2', '#d25d00', '#f1dbe7']
            break;
    }

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
        .range(lineColours)

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
        colour: axesColour,
        yLabel: 'Generation (TWh)',
        xLabel: 'Year',
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
        colours: lineColours,
        xPosition: -margin.left,
        yPosition: -margin.top + 14
    })

    addLineTooltip({
        chart,
        htmlText: d => `
        <strong>${d.source} - ${d.year}</strong>
        <div style='display: flex; justify-content: space-between'>
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