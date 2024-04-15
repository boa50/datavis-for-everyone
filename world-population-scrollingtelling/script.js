import { addAxis } from "../components/axis/script.js"

const getData = () =>
    d3.csv('./data/dataset.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                population: +v.population,
                lifeExpectancy: +v.lifeExpectancy,
                gdpPerCapita: +v.gdpPerCapita
            }
        }))

const colours = {
    text: '#737373',
    africa: '#0ea5e9',
    americas: '#22c55e',
    asia: '#ef4444',
    europe: '#f59e0b'
}

const svgWidth = 1080
const svgHeight = 720
const margin = {
    left: 64,
    right: 16,
    top: 16,
    bottom: 64
}
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom

const chart = d3
    .select(`#chart`)
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', `translate(${[margin.left, margin.top]})`)

getData().then(data => {
    const dataFiletered = data.filter(d => d.year === "2023")

    const x = d3
        .scaleLog()
        .domain(d3.extent(data, d => d.gdpPerCapita).map((d, i) => d * [0.99, 1.01][i]))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.lifeExpectancy).map((d, i) => d * [0.999, 1.001][i]))
        .range([height, 0])

    const radius = d3
        .scaleSqrt()
        .domain(d3.extent(data, d => d.population))
        .range([2, 40])

    const uniqueRegions = [...new Set(data.map(d => d.region))].sort()
    const colour = d3
        .scaleOrdinal()
        .domain(uniqueRegions)
        .range([colours.africa, colours.americas, colours.asia, colours.europe])


    chart
        .selectAll('circle')
        .data(dataFiletered)
        .join('circle')
        .attr('cx', d => x(d.gdpPerCapita))
        .attr('cy', d => y(d.lifeExpectancy))
        .attr('r', d => radius(d.population))
        .style('fill', d => colour(d.region))
        .style('opacity', 0.75)

    addAxis({
        chart: chart,
        height: height,
        width: width,
        margin: margin,
        x: x,
        y: y,
        xLabel: 'GDP per capita',
        yLabel: 'Life expectancy',
        xFormat: d => `$${(d >= 10000) ? d3.format('.3s')(d).replace('.0', '') : d
            }`,
        colour: colours.text,
        xTickValues: [500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000]
    })
})