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

        const y = d3
            .scaleRadial()
            .range([innerRadius, outerRadius])
            .domain([0, d3.max(data, d => d.electricityAndHeat)])

        const arc = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(d => y(d.electricityAndHeat))
            .startAngle(d => x(d.year))
            .endAngle(d => x(d.year) + x.bandwidth())
            .padAngle(padAngle)
            .padRadius(innerRadius)

        centeredChart
            .append('g')
            .selectAll('path')
            .data(data)
            .join('path')
            .attr('fill', '#69b3a2')
            .attr('d', arc)
    })
}