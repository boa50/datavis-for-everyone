import { addHighlightTooltip as addTooltip, addVerticalLegend as addLegend } from "../../../node_modules/visual-components/index.js"
import { colours, palette } from "../../constants.js"

const keys = ['electricityAndHeat', 'transport', 'manufacturingAndConstruction', 'agriculture', 'buildings', 'industry']

const getData = () =>
    d3.csv('../data/greenhouse-emissions.csv')
        .then(d => d.map(v => { return { ...v, total: keys.reduce((tot, key) => tot + +v[key], 0) } }))

export const addChart = chartProps => {
    const { chart, width, height } = chartProps

    const innerRadius = 100
    const outerRadius = Math.min(width, height) / 2
    const padAngle = 0.05

    const centeredChart = chart
        .append('g')
        .attr('transform', `translate(${[width / 3, height / 2]})`)

    getData().then(data => {
        const x = d3
            .scaleBand()
            .domain(data.map(d => d.year))
            .range([0, 2 * Math.PI])

        const y = d3
            .scaleRadial()
            .domain([0, d3.max(data, d => d.total)])
            .range([innerRadius, outerRadius])

        const stackedData = d3
            .stack()
            .keys(keys)
            (data)

        const colour = d3
            .scaleOrdinal()
            .domain(keys)
            .range(palette)

        const arc = d3
            .arc()
            .innerRadius(d => y(d[0]))
            .outerRadius(d => y(d[1]))
            .startAngle(d => x(d.data.year))
            .endAngle(d => x(d.data.year) + x.bandwidth())
            .padAngle(padAngle)
            .padRadius(innerRadius)

        centeredChart
            .selectAll('g')
            .data(stackedData)
            .join('g')
            .attr('fill', d => colour(d.key))
            .selectAll('path')
            .data(d => d)
            .join('path')
            .attr('d', arc)

        centeredChart
            .append('g')
            .selectAll('g')
            .data(data)
            .join('g')
            .attr('text-anchor', 'middle')
            .style('font-size', '0.6rem')
            .attr('transform', d => `rotate(${((x(d.year) + x.bandwidth() / 2) * 180 / Math.PI - 90)}) translate(${innerRadius}, 0)`)
            .call(g => g
                .append('text')
                .attr('fill', colours.axis)
                .attr('transform',
                    d => (x(d.year) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ?
                        'rotate(90)translate(0,11)' :
                        'rotate(-90)translate(0,-4)'
                )
                .text(d => d.year)
            )

        addLegend({
            chart,
            legends: ['Electricity and Heat', 'Transport', 'Manufacturing and Construction', 'Agriculture', 'Buildings', 'Industry'],
            colours: palette,
            xPosition: width / 1.55,
            yPosition: height / 3
        })

        centeredChart
            .append('g')
            .attr('id', 'tooltip')
            .selectAll('g')
            .data(data)
            .join('path')
            .attr('class', 'year-bar')
            .attr('fill', 'white')
            .style('opacity', 0)
            .attr('d', d3
                .arc()
                .innerRadius(innerRadius)
                .outerRadius(d => y(d.total))
                .startAngle(d => x(d.year))
                .endAngle(d => x(d.year) + x.bandwidth())
                .padAngle(padAngle)
                .padRadius(innerRadius))

        const tooltipFormat = d => `${d3
            .formatLocale({ thousands: ' ', grouping: [3] })
            .format(',.0f')
            (Math.round(d / 1e6))
            } million`

        addTooltip({
            chart,
            htmlText: d => `
            <strong>${d.year}</strong> <span>(in tonnes)</span>
            <div style="display: flex; justify-content: space-between">
                <strong>Total:&emsp;</strong>
                <span>${tooltipFormat(d.total)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>Industry:&emsp;</span>
                <span>${tooltipFormat(d.industry)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
            <span>Buildings:&emsp;</span>
                <span>${tooltipFormat(d.buildings)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>Agriculture:&emsp;</span>
                <span>${tooltipFormat(d.agriculture)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>Manufacturing and Construction:&emsp;</span>
                <span>${tooltipFormat(d.manufacturingAndConstruction)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>Transport:&emsp;</span>
                <span>${tooltipFormat(d.transport)}</span>
            </div>
            <div style="display: flex; justify-content: space-between">
                <span>Electricity and Heat:&emsp;</span>
                <span>${tooltipFormat(d.electricityAndHeat)}</span>
            </div>
            `,
            elements: d3.selectAll('.year-bar'),
            initialOpacity: 0,
            highlightedOpacity: 0,
            fadedOpacity: 0.75,
            chartWidth: width / 3,
            chartHeight: height / 2
        })
    })
}