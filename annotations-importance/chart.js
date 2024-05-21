import { palette, defaultColours as colours } from '../colours.js'
import { addAxis, addHighlightTooltip } from '../node_modules/visual-components/index.js'

const getData = () =>
    d3.csv('./data/disasters-deaths.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                drought: +v.drought,
                flood: +v.flood,
                earthquake: +v.earthquake,
                weather: +v.weather,
                temperature: +v.temperature
            }
        }))

const margin = {
    left: 128,
    bottom: 46
}

export const addChart = ({ svg, width, height, xPosition, yPosition }) => {
    const chart = svg
        .append('g')
        .attr('id', 'disasters-chart')
        .attr('transform', `translate(${[xPosition, yPosition]})`)

    getData().then(data => {
        const groups = Object.keys(data[0]).slice(1)
        const maxRadius = height / groups.length / 2

        const x = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([margin.left, width])


        const colour = d3
            .scaleOrdinal()
            .domain(groups)
            .range([palette.orange, palette.blue, palette.amber, palette.reddishPurple, palette.vermillion])

        const y = d3
            .scaleBand()
            .domain(groups)
            .range([0, height])
            .paddingInner(1)

        const radius = d3
            .scaleSqrt()
            .domain([0, d3.max(data, d => Math.max(...Object.values(d).slice(1)))])
            .range([0, maxRadius])


        chart
            .selectAll('.lane')
            .data(groups)
            .join('g')
            .attr('class', 'lane')
            .attr('transform', group => `translate(0, ${y(group)})`)
            .call(g => g
                .append('text')
                .attr('class', 'lane-label')
                .attr('x', x.range()[0] - maxRadius)
                .attr('y', y.bandwidth())
                .attr('fill', colours.axis)
                .attr('font-weight', 500)
                .attr('text-anchor', 'end')
                .attr('dominant-baseline', 'middle')
                .text(group => group.charAt(0).toUpperCase() + group.slice(1))
            )
            .call(g => g
                .append('line')
                .attr('class', 'lane-line')
                .attr('x1', x.range()[0])
                .attr('x2', x.range()[1])
                .attr('y1', y.bandwidth())
                .attr('y2', y.bandwidth())
                .attr('stroke', colours.axis)
                .attr('stroke-width', 0.5)
                .style('opacity', 0.25)
            )
            .selectAll('.data-point')
            .data(group => data.map(d => { return { year: d.year, group: group, value: d[group] } }))
            .join('circle')
            .attr('class', 'data-point')
            .attr('r', d => radius(d.value))
            .attr('fill', d => colour(d.group))
            .style('opacity', 0.75)
            .attr('stroke', colours.axis)
            .attr('stroke-width', 0.5)
            .attr('cx', d => x(d.year))
            .attr('cy', y.bandwidth())

        addAxis({
            chart,
            height: height + margin.bottom,
            width,
            colour: colours.axis,
            x,
            xFormat: d => d,
            xLabel: 'Year',
            hideXdomain: true
        })

        addHighlightTooltip({
            id: 'scrolly',
            chart,
            htmlText: d => `
            <strong>${d.year} - ${d.group.charAt(0).toUpperCase() + d.group.slice(1)}</strong>
            <div style="display: flex; justify-content: space-between">
                <span>Deaths:&emsp;</span>
                <span>${d3
                    .formatLocale({ thousands: ' ', grouping: [3] })
                    .format(',.0f')
                    (d.value)}</span>
            </div>
            `,
            elements: chart.selectAll('.data-point'),
            chartWidth: width,
            chartHeight: height,
            fadedOpacity: 0.5
        })
    })

}