import { colours } from '../../constants.js'
import { addAxis } from '../../../components/axis/script.js'
import { addHighlightTooltip as addTooltip } from '../../../components/tooltip/script.js'
import { addLegend } from '../../../components/colour-legend/script.js'

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    const dataFiltered = data.filter(d => d.year === '2021')

    const x = d3
        .scaleLinear()
        .domain(d3.extent(dataFiltered, d => d.male).map((d, i) => d * [0.95, 1.05][i]))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(dataFiltered, d => d.female).map((d, i) => d * [0.95, 1.05][i]))
        .range([height, 0])

    const dataHexbin = dataFiltered.map(d => [x(d.male), y(d.female)])

    const hexbin = d3
        .hexbin()
        .radius(19)
        .extent([[0, 0], [width, height]])

    const colour = d3
        .scaleLinear()
        .domain([0, d3.max(hexbin(dataHexbin), d => d.length)])
        .range(['transparent', colours.default])

    chart
        .append('clipPath')
        .attr('id', 'hexbin-clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height)

    chart
        .append('g')
        .attr('clip-path', 'url(#hexbin-clip)')
        .selectAll('path')
        .data(hexbin(dataHexbin))
        .join('path')
        .attr('class', 'hexbin-point')
        .attr('d', hexbin.hexagon())
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
        .attr('fill', d => colour(d.length))
        .attr('stroke', colours.axis)
        .attr('stroke-width', '0.1')

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Men',
        yLabel: 'Women',
        colour: colours.axis
    })

    chart
        .append('g')
        .attr('id', 'colour-legend')

    const colourLegendWidth = 128

    const colourLegendAxis = d3
        .scaleLinear()
        .domain(d3.extent(hexbin(dataHexbin), d => d.length))
        .range([0, colourLegendWidth])

    addLegend({
        id: 'colour-legend',
        title: 'Number of Countries',
        colourScale: colour,
        axis: colourLegendAxis,
        width: colourLegendWidth,
        xPos: width - margin.right - colourLegendWidth,
        yPos: height - margin.bottom,
        textColour: colours.axis
    })

    addTooltip(
        `${chart.attr('id').split('-')[0]}-container`,
        d => `
        <div style="display: flex; justify-content: space-between">
            <span>Countries:&emsp;</span>
            <span>${d.length}</span>
        </div>
        `,
        chart.selectAll('.hexbin-point'),
        { initial: 1, highlighted: 1, faded: 0.25 }
    )
}