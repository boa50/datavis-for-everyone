import { addAxis } from '../axis.js'
import { colours } from '../../constants.js'

const getData = () =>
    Promise.all([
        d3.csv('./data/troops.csv')
            .then(d => d.filter(v => (v.direction === 'Retreating') & (v.group == 1))),
        d3.csv('./data/temperatures.csv')
    ])

const svgWidth = 1080
const svgHeight = 720
const marginDefault = {
    left: 64,
    right: 16,
    top: 16,
    bottom: 64
}

const getSvgChart = (id, marginCustom = {}) => {
    const margin = {
        ...marginDefault,
        ...marginCustom
    }
    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom

    const chart = d3
        .select(`#${id}`)
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${[margin.left, margin.top]})`)

    return [chart, width, height]
}

getData().then(datasets => {
    const data = datasets[0]
    const temperatures = datasets[1]

    const [chart, width, height] = getSvgChart('line-chart')

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.long).map((d, i) => d * [0.995, 1.005][i]).reverse())
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.survivors).map((d, i) => d * 1.05 * i))
        .range([height, 0])

    chart
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
            .x(function (d) { return x(d.long) })
            .y(function (d) { return y(d.survivors) })
        )

    addAxis(chart, height, width, marginDefault, x, y, 'Longitude', 'Survivors', colours.text, undefined, d3.format('.1s'))

})