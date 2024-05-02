const x = d3
    .scaleLinear()
    .domain([0, MAX_VALUE])
    .range([0, width])

const y = d3
    .scaleBand()
    .domain(data.map(d => d.GROUP_FIELD))
    .range([0, height])
    .padding(.1)

chart
    .selectAll('myRect')
    .data(data)
    .join('rect')
    .attr('x', x(0))
    .attr('y', d => y(d.GROUP_FIELD))
    .attr('width', d => x(d.VALUE))
    .attr('height', y.bandwidth())
    .attr('fill', '#69b3a2')