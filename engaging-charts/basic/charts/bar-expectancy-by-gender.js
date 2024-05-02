export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const filteredData = d3.sort(data, (a, b) => d3.descending(a.average, b.average)).slice(0, 10)
    const maxLifeExpectancy = Math.max(d3.max(filteredData, d => d.female), d3.max(data, d => d.male))

    const x = d3
        .scaleLinear()
        .domain([0, maxLifeExpectancy * 1.05])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(filteredData.map(d => d.country))
        .range([0, height])
        .padding(.1)

    chart
        .selectAll('myRect')
        .data(filteredData)
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => y(d.country))
        .attr('width', d => x(d.female))
        .attr('height', y.bandwidth())
        .attr('fill', '#69b3a2')
}