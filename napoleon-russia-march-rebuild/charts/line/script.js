import { addAxis } from '../axis.js'
import { addLegend } from '../../../components/legend/script.js'
import { addLegend as addColourLegend } from '../../../components/colour-legend/script.js'
import { colours } from '../../constants.js'
import { lineV1 } from './v1.js'
import { lineV2 } from './v2.js'

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

    const [chart1, width, height] = getSvgChart('line-v1-chart')

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


    // V1
    lineV1(chart1, width, height, dataPerGroup, temperatures, x, ySurvivors, yTemperature, marginDefault.bottom, colours.text)

    addLegend(
        'line-v1-legend',
        ['Group1', 'Group2', 'Group3', 'Temperature'],
        ['#54A24B', '#F58518', '#B279A2', '#cbd5e1']
    )
    addAxis({
        chart: chart1,
        height: height,
        width: width,
        margin: marginDefault,
        x: x,
        y: ySurvivors,
        xLabel: 'Longitude',
        yLabel: 'Survivors',
        xFormat: d => `${d}°`,
        yFormat: d3.format('.1s'),
        colour: colours.text
    })

    // V2
    const [chart2, width2, height2] = getSvgChart('line-v2-chart')
    const temperatureColours = d3
        .scaleSequential()
        .domain(d3.extent(temperatures, d => d['temp C']))
        .range(['#17709c', '#d6dae6'])
    const temperatureColourOpacity = 0.7

    lineV2(chart2, width2, height2, data.filter(d => d.group === '1'), temperatures, x, ySurvivors, temperatureColours)

    addLegend('line-v2-legend', ['Survivors'], ['#b45309'])

    const colourLegendWidth = 200
    const colourAxis = d3
        .scaleLinear()
        .domain(d3.extent(temperatures, d => d['temp C']))
        .range([0, colourLegendWidth])
    addColourLegend(
        {
            id: 'line-v2-legend',
            title: 'Temperature',
            colourScale: temperatureColours,
            colourOpacity: temperatureColourOpacity,
            xPos: width + marginDefault.left - colourLegendWidth - 8,
            yPos: 0,
            width: colourLegendWidth,
            axis: colourAxis,
            textColour: colours.text,
            axisTickFormat: d => `${d}°C`
        }
    )

    addAxis({
        chart: chart2,
        height: height,
        width: width,
        margin: marginDefault,
        x: x,
        y: ySurvivors,
        xLabel: 'Longitude',
        yLabel: 'Survivors',
        xFormat: d => `${d}°`,
        yFormat: d3.format('.1s'),
        colour: colours.text
    })
})