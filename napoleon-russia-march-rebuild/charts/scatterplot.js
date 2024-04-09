import { buildTooltip } from "../../components/tooltip/script.js"
import { addLegend } from "../../components/legend/script.js"
import { addLegend as addCircleLegend } from "../../components/circle-legend/script.js"
import { colours } from "../constants.js"

const getDeathsByGroup = (data, group) => {
    return data
        .filter(e => e.group === group)
        .map((e, i, arr) => {
            return { ...e, deaths: arr[i - 1] !== undefined ? arr[i - 1].survivors - e.survivors : 0 }
        })
}

const getData = () =>
    Promise.all([
        d3.csv('./data/troops.csv')
            .then(d =>
                getDeathsByGroup(d, '1')
                    .concat(getDeathsByGroup(d, '2'))
                    .concat(getDeathsByGroup(d, '3'))),
        d3.json('./data/world.geojson'),
        d3.csv('./data/cities.csv')
            .then(d =>
                d.map(e => { return { ...e, type: 'city' } })
                    .concat([
                        // Adding countries names
                        { long: 31.6, lat: 56.8, city: 'Russia', type: 'country' },
                        { long: 27.6, lat: 52.9, city: 'Belarus', type: 'country' },
                        { long: 24, lat: 55.5, city: 'Lithuania', type: 'country' },
                        { long: 25.5, lat: 56.8, city: 'Latvia', type: 'country' },
                    ])
            )
    ])

const svgWidth = 1080
const svgHeight = 720

const margin = {
    left: 0,
    right: 0,
    top: 16,
    bottom: 16
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

const { showTooltip, moveTooltip, hideTooltip } = buildTooltip('scatterplot-container', (d) => `Deaths: ${d.deaths}`)

addLegend(
    'scatterplot-legend',
    ['Advancing', 'Retreating'],
    [colours.advancing, colours.retreating]
)

addLegend(
    'scatterplot-legend',
    ['Group 1', 'Group 2', 'Group 3'],
    colours.text,
    [d3.symbol(d3.symbolCircle), d3.symbol(d3.symbolSquare), d3.symbol(d3.symbolTriangle)],
    0,
    width - 235
)

getData().then(datasets => {
    const data = datasets[0]
    const geo = datasets[1]
    const cities = datasets[2]

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.long).map((d, i) => d * [0.99, 1.01][i]))
        .range([0, width])
    // chart
    //     .append('g')
    //     .attr('transform', `translate(0, ${height})`)
    //     .call(d3.axisBottom(x))

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.lat).map((d, i) => d * [0.999, 1.001][i]))
        .range([height, 0])
    // chart
    //     .append('g')
    //     .call(d3.axisLeft(y))

    const colour = d3
        .scaleOrdinal()
        .domain(['Advancing', 'Retreating'])
        .range([colours.advancing, colours.retreating])

    const deathsRange = [0, d3.max(data, d => d.deaths)]

    const size = d3
        .scaleSqrt()
        .domain(deathsRange)
        .range([0, 4000])


    addCircleLegend(
        'scatterplot-chart',
        size.copy().range([0, 35]),
        [d3.quantile(deathsRange, 0.2), d3.quantile(deathsRange, 0.5), d3.quantile(deathsRange, 1)],
        [width - 110, height],
        colours.text
    )

    const groupSymbol = d3
        .scaleOrdinal()
        .domain(['1', '2', '3'])
        .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle])


    // V1
    // chart
    //     .selectAll('circle')
    //     .data(data)
    //     .join('circle')
    //     .attr('cx', d => x(d.long))
    //     .attr('cy', d => y(d.lat))
    //     .attr('r', d => size(d.deaths) / 70)
    //     .style('fill', d => colour(d.direction))
    //     .style('opacity', 0.5)


    // V2
    // chart
    //     .selectAll('.dt-points')
    //     .data(data)
    //     .join('path')
    //     .attr('d', d3.symbol().type(d => groupSymbol(d.group)).size(d => size(d.deaths)))
    //     .style('fill', d => colour(d.direction))
    //     .style('fill-opacity', 0.3)
    //     .style('stroke', d => colour(d.direction))
    //     .attr('stroke-width', 0.5)
    //     .attr('transform', d => `translate(${[x(d.long), y(d.lat)]})`)


    // V3
    const fontSize = d3
        .scaleOrdinal()
        .domain(['city', 'country'])
        .range([11, 25])

    const projection = d3
        .geoMercator()
        .center([31, 55])
        .scale(4080)
        .translate([width / 2, height / 2])
        .clipExtent([[0, 0], [width, height]])

    chart
        .append('g')
        .selectAll('path')
        .data(geo.features)
        .join('path')
        .attr('fill', '#ffffff')
        .attr('d', d3.geoPath()
            .projection(projection)
        )
        .style('stroke', '#9ca3af')

    chart
        .selectAll('.cities')
        .data(cities)
        .join('text')
        .attr('transform', d => `translate(${projection([d.long, d.lat])})`)
        .attr('font-size', d => fontSize(d.type))
        .attr('fill', colours.text)
        .text(d => d.city)

    chart
        .selectAll('.dt-points')
        .data(data)
        .join('path')
        .attr('d', d3.symbol().type(d => groupSymbol(d.group)).size(d => size(d.deaths)))
        .attr('transform', d => `translate(${projection([d.long, d.lat])})`)
        .style('fill', d => colour(d.direction))
        .style('fill-opacity', 0.4)
        .style('stroke', d => colour(d.direction))
        .attr('stroke-width', 0.5)
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)
})