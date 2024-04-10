import { addAxis } from '../axis.js'
import { addLegend } from '../../../components/legend/script.js'
import { colours } from '../../constants.js'

const getData = () =>
    Promise.all([
        d3.csv('./data/troops.csv')
            .then(d => d
                .filter(v => v.direction === 'Retreating')
                .map(v => { return { ...v, long: +v.long, survivors: +v.survivors } })),
        d3.csv('./data/temperatures.csv')
            .then(d =>
                [{ ...d[0], long: 37.8885 }].concat(
                    d.map(v => { return { ...v, long: +v.long, 'temp C': +v['temp C'] } })
                ).concat({ ...d[d.length - 1], long: 23.9795 })
            )
    ])

const svgWidth = 1080
const svgHeight = 720
const marginDefault = {
    left: 64,
    right: 64,
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
    const dataPerGroup = d3.group(data, d => d.group)

    const [chart, width, height] = getSvgChart('line-chart')

    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.long).map((d, i) => d * [0.995, 1.005][i]).reverse())
        .range([0, width])

    const ySurvivors = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.survivors).map((d, i) => d * 1.05 * i))
        .range([height, 0])

    const yTemperature = d3
        .scaleLinear()
        .domain(d3.extent(temperatures, d => d['temp C']).map((d, i) => d * [1.2, 1][i]))
        .range([height, 0])

    const lineColours = d3
        .scaleOrdinal()
        .range(['#54A24B', '#F58518', '#B279A2'])

    // Temperatures
    const area = d3
        .area()
        .x(d => x(d.long))
        .y0(yTemperature(0))
        .y1(d => yTemperature(d['temp C']))

    chart
        .append('path')
        .datum(temperatures)
        .attr('fill', '#cbd5e1')
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 1)
        .attr('fill-opacity', 0.5)
        .attr('d', d => area(d))

    // Survivors
    const line = d3
        .line()
        .x(d => x(d.long))
        .y(d => ySurvivors(d.survivors))

    chart
        .selectAll('.drewLine')
        .data(dataPerGroup)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d => lineColours(d[0]))
        .attr('stroke-width', 1.5)
        .attr('d', d => line(d[1]))

    addLegend(
        'line-legend',
        ['Group1', 'Group2', 'Group3', 'Temperature'],
        ['#54A24B', '#F58518', '#B279A2', '#cbd5e1']
    )

    addAxis(chart, height, width, marginDefault, x, ySurvivors, 'Longitude', 'Survivors', colours.text, d => `${d}°`, d3.format('.1s'))

    const yAxisRight = chart
        .append('g')
        .attr('transform', `translate(${width}, 0)`)
        .call(
            d3
                .axisRight(yTemperature)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(d => `${d} °C`)
        )

    yAxisRight
        .append('text')
        .attr('x', ((height - marginDefault.bottom) / 2))
        .attr('y', -55)
        .attr('font-size', 12)
        .attr('transform', 'rotate(90)')
        .attr('text-anchor', 'middle')
        .text('Temperature')

    yAxisRight
        .select('.domain')
        .attr('stroke', colours.text)

    yAxisRight
        .selectAll('text')
        .attr('fill', colours.text)
})