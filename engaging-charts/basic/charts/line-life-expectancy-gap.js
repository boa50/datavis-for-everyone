import { colours, palette } from "../../constants.js"
import { addAxis } from "../../../components/axis/script.js"
import { addLegendV2 as addLegend } from "../../../components/legend/script.js"
import { addLineTooltip as addTooltip } from "../../../components/tooltip/script.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    const selectedCountries = ['South Korea', 'Colombia', 'Japan']
    const filteredData = data.filter(d => selectedCountries.includes(d.country))

    const x = d3
        .scaleLinear()
        .domain(d3.extent(filteredData, d => d.year))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(filteredData, d => d.gap).map((d, i) => d * [0.95, 1.05][i]))
        .range([height, 0])

    const dataPerGroup = d3.group(filteredData, d => d.country)
    const colour = d3
        .scaleOrdinal()
        .domain(selectedCountries)
        .range(palette)

    const line = d3
        .line()
        .x(d => x(d.year))
        .y(d => y(d.gap))

    chart
        .selectAll('.drewLine')
        .data(dataPerGroup)
        .join('path')
        .attr('class', 'drewLine')
        .attr('fill', 'none')
        .attr('stroke', d => colour(d[0]))
        .attr('stroke-width', 3)
        .attr('d', d => line(d[1]))

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Life expectancy gap (years)',
        xFormat: d => d,
        colour: colours.axis
    })

    addLegend({
        chart,
        legends: selectedCountries,
        colours: palette,
        xPos: -margin.left,
        yPos: -margin.top
    })

    addTooltip(
        `${chart.attr('id').split('-')[0]}-container`,
        d => `
        <strong>${d.country}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Life expectancy gap:&emsp;</span>
            <span>${d3.format('.1f')(d.gap)} years</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Women life expectancy:&emsp;</span>
            <span>${d3.format('.1f')(d.female)} years</span>
        </div>
        <div style="display: flex; justify-content: space-between">
            <span>Men life expectancy:&emsp;</span>
            <span>${d3.format('.1f')(d.male)} years</span>
        </div>
        `,
        d => colour(d.country),
        {
            chart,
            data: filteredData,
            cx: d => x(d.year),
            cy: d => y(d.gap),
            radius: 4
        }
    )
}