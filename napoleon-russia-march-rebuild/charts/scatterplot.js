import "https://cdn.jsdelivr.net/npm/d3@7"

const getDeathsByGroup = (data, group) => {
    return data
        .filter(e => e.group === group)
        .map((e, i, arr) => {
            return { ...e, deaths: arr[i - 1] !== undefined ? arr[i - 1].survivors - e.survivors : 0 }
        })
}

const getData = () =>
    d3.csv('./data/troops.csv')
        .then(d =>
            getDeathsByGroup(d, '1')
                .concat(getDeathsByGroup(d, '2'))
                .concat(getDeathsByGroup(d, '3')))

const svgWidth = 700
const svgHeight = 500

const margin = {
    left: 64,
    right: 16,
    top: 16,
    bottom: 32
}
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom

const svg = d3
    .select('#scatterplot-chart')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

const chart = svg
    .append('g')
    .attr('transform', `translate(${[margin.left, margin.top]})`)

getData().then(data => {
    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.long).map((d, i) => d * [0.99, 1.01][i]))
        .range([0, width])
    chart
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.lat).map((d, i) => d * [0.999, 1.001][i]))
        .range([height, 0])
    chart
        .append('g')
        .call(d3.axisLeft(y))

    const colour = d3
        .scaleOrdinal()
        .domain(['Advancing', 'Retreating'])
        .range(['#d97706', '#030712'])

    const size = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.deaths)])
        .range([0, 2000])

    const groupSymbol = d3
        .scaleOrdinal()
        .domain(['1', '2', '3'])
        .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle])

    chart
        .selectAll('.dt-points')
        .data(data)
        .join('path')
        .attr('d', d3.symbol().type(d => groupSymbol(d.group)).size(d => size(d.deaths)))
        .style('fill', d => colour(d.direction))
        .style('fill-opacity', 0.3)
        .style('stroke', d => colour(d.direction))
        .attr('stroke-width', 0.5)
        .attr('transform', d => `translate(${[x(d.long), y(d.lat)]})`)

    // chart
    //     .selectAll('circle')
    //     .data(data)
    //     .join('circle')
    //     .attr('cx', d => x(d.long))
    //     .attr('cy', d => y(d.lat))
    //     .attr('r', d => size(d.deaths) / 70)
    //     .style('fill', d => colour(d.direction))
    //     .style('opacity', 0.5)
})