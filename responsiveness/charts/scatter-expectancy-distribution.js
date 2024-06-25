import { addAxis, addHighlightTooltip as addTooltip } from "../../node_modules/visual-components/index.js"
import { palette, defaultColours } from "../../colours.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const dataFiltered = data.filter(d => d.year === '2021')

    const x = d3
        .scaleLinear()
        .domain(d3.extent(dataFiltered, d => d.male).map((d, i) => d * [0.95, 1.05][i]))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(dataFiltered, d => d.female).map((d, i) => d * [0.95, 1.05][i]))
        .range([height, 0])

    chart
        .selectAll('.data-points')
        .data(dataFiltered)
        .join('circle')
        .attr('class', 'data-points')
        .attr('r', 5)
        .attr('fill', palette.blue)
        .style('opacity', 0.75)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 0.5)
        .transition()
        .attr('cx', d => x(d.male))
        .attr('cy', d => y(d.female))

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Men (years)',
        yLabel: 'Women (years)',
        xNumTicks: 5,
        yNumTicks: 5,
        hideXdomain: true,
        hideYdomain: true,
        colour: defaultColours.axis
    })

    addTooltip({
        chart,
        htmlText: d => `
        <strong>${d.country}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Women:&emsp;</span>
            <span>${d3.format('.1f')(d.female)} years</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Men:&emsp;</span>
            <span>${d3.format('.1f')(d.male)} years</span>
        </div>
        `,
        elements: chart.selectAll('.data-points')
    })
}