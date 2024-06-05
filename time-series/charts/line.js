import { addAxis } from "../../node_modules/visual-components/index.js"
import { palette, defaultColours as colours } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.expenditureShare).map((d, i) => d * [0.9, 1.1][i]))
        .range([height, 0])

    const dataPerGroup = d3.group(data, d => d.country)
    const colour = d3
        .scaleOrdinal()
        .range(Object.values(palette))

    const line = d3
        .line()
        .x(d => x(d.year))
        .y(d => y(d.expenditureShare))

    chart
        .selectAll('.drewLine')
        .data(dataPerGroup)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d => colour(d[0]))
        .attr('stroke-width', 3)
        .attr('d', d => line(d[1]))

    const getLabelDominantBaseline = d =>
        ['Brazil', 'Canada'].includes(d.country) ? 'auto' :
            ['New Zealand', 'Kenya'].includes(d.country) ? 'hanging' :
                'middle'

    chart
        .selectAll('.data-legend')
        .data(data.filter(d => d.year == 2020))
        .join('text')
        .attr('x', x(2020) + 4)
        .attr('y', d => y(d.expenditureShare))
        .attr('font-size', '0.8rem')
        .attr('dominant-baseline', getLabelDominantBaseline)
        .attr('fill', d => colour(d.country))
        .text(d => d.country)

    addAxis({
        chart,
        height,
        width,
        colour: colours.axis,
        x,
        y,
        xFormat: d => d,
        yFormat: d => `${d}%`,
        xNumTicks: 5,
        yTickValues: [3, 4, 5, 6, 7, 8],
        xNumTicksForceInitial: true,
        hideXdomain: true,
        hideYdomain: true,
        yLabel: 'Expenditure (share of GDP)'
    })
}