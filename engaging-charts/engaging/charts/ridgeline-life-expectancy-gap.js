import { colours } from "../../constants.js"
import { addAxis } from "../../../components/axis/script.js"
import { addLineTooltip as addTooltip } from "../../../components/tooltip/script.js"

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const selectedCountries = ['Colombia', 'Japan', 'South Korea', 'Brazil', 'Argentina', 'Mexico', 'Canada', 'Australia', 'South Africa', 'Russia'].sort()
    const filteredData = data.filter(d => selectedCountries.includes(d.country))

    const x = d3
        .scaleLinear()
        .domain(d3.extent(filteredData, d => d.year))
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(selectedCountries)
        .range([0, height])
        .paddingInner(1)

    const dataPerGroup = d3.group(filteredData, d => d.country)

    const area = data => {
        const y = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.gap))
            .range([height, height * 0.85])

        return d3
            .area()
            .curve(d3.curveBasis)
            .x(d => x(d.year))
            .y0(height)
            .y1(d => y(d.gap))
            (data)
    }

    chart
        .selectAll('.ridge-lane')
        .data(dataPerGroup)
        .join('path')
        .attr('class', 'ridge-lane')
        .attr('transform', d => `translate(0, ${(y(d[0]) - height)})`)
        .datum(d => d[1])
        .attr('fill', colours.ridges)
        .attr('stroke', colours.axis)
        .attr('stroke-width', 1)
        .attr('d', area)
        .attr('custom-tooltip', (d, i) => {
            const ridgeLaneStart = height * i / (selectedCountries.length - 1)
            const y = d3
                .scaleLinear()
                .domain(d3.extent(d, v => v.gap))
                .range([ridgeLaneStart, ridgeLaneStart - (height - (height * 0.85))])

            addTooltip(
                `${chart.attr('id').split('-')[0]}-container`,
                d => `
                <strong>${d.country} - ${d.year}</strong>
                <div style="display: flex; justify-content: space-between">
                    <span>Life expectancy gap:&emsp;</span>
                    <span>${d3.format('.1f')(d.gap)} years</span>
                </div>
                `,
                colours.axis,
                {
                    chart,
                    data: d,
                    cx: d => x(d.year),
                    cy: d => y(d.gap),
                    radius: 4
                }
            )
        })

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Year',
        yLabel: 'Country',
        xFormat: d => d,
        colour: colours.axis
    })
}