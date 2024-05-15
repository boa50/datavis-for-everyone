import { palette, defaultColours as colours } from "../../colours.js"
import { addAxis } from "../../components/axis/script.js"
import { addHighlightTooltip as addTooltip } from "../../components/tooltip/script.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const filteredData = data.filter(d => d.year >= 2021)

    const years = [...new Set(filteredData.map(d => d.year))].reverse()

    const x = d3
        .scaleBand()
        .domain([...new Set(filteredData.map(d => d.month))])
        .range([0, width])
        .padding(.15)

    const xSubgroup = d3
        .scaleBand()
        .domain(years)
        .range([0, x.bandwidth()])
        .padding(.1)

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, d => d.temperature)])
        .range([height, 0])

    const colour = d3
        .scaleOrdinal()
        .range(Object.values(palette).splice(3).map(d => d3.hsl(d).darker(0.2)))
        .domain(years)

    chart
        .selectAll('g')
        .data(filteredData)
        .join('rect')
        .attr('class', 'data-point')
        .attr('transform', d => `translate(${x(d.month)}, 0)`)
        .attr('x', d => xSubgroup(d.year))
        .attr('y', d => y(d.temperature))
        .attr('width', xSubgroup.bandwidth())
        .attr('height', d => height - y(d.temperature))
        .attr('fill', d => colour(d.year))

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Month',
        yLabel: 'Temperature (°C)',
        xFormat: d => getMonthName(d, 'short'),
        hideXdomain: true,
        hideYdomain: true,
        colour: colours.axis
    })

    addTooltip(
        `${chart.attr('id').split('-')[0]}-container`,
        d => `
        <strong>${getMonthName(d.month)} ${d.year}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Average temperature:&emsp;</span>
            <span>${d3.format('.2f')(d.temperature)} °C</span>
        </div>
        `,
        d3.selectAll('.data-point'),
        { initial: 1, highlighted: 1, faded: 0.5 },
        { width, height }
    )
}

function getMonthName(month, type = 'long') {
    return (new Date(1900, month - 1)).toLocaleString('default', { month: type })
}