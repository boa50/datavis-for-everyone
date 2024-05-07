import { colours } from "../../constants.js"

const getData = () =>
    d3.csv('../data/greenhouse-emissions.csv')

export const addChart = chartProps => {
    const { chart, width, height } = chartProps

    const innerRadius = 100
    const outerRadius = Math.min(width, height) / 2
    const padAngle = 0.05

    const centeredChart = chart
        .append('g')
        .attr('transform', `translate(${[width / 2, height / 2]})`)

    getData().then(data => {
        const x = d3
            .scaleBand()
            .range([0, 2 * Math.PI])
            .domain(data.map(d => d.year))

        const keys = ['electricityAndHeat', 'transport', 'manufacturingAndConstruction', 'agriculture', 'buildings', 'industry']

        const y = d3
            .scaleRadial()
            .range([innerRadius, outerRadius])
            .domain([0, d3.max(data, d => keys.reduce((total, key) => total + +d[key], 0))])

        const stackedData = d3
            .stack()
            .keys(keys)
            (data)

        const colour = d3
            .scaleOrdinal()
            .range(d3.schemeTableau10)
            .domain(keys)

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
    })
}