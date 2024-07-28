import { getChart, getMargin, appendChartContainer, getChartDimensions, addAxis } from "../../node_modules/visual-components/index.js"
import { paletteDarkBg as palette } from "../../../colours.js"

const getData = () =>
    d3.csv('../data/life-expectancy.csv')
        .then(d => d.map(v => {
            return {
                ...v,
                female: +v.female,
                male: +v.male,
                average: (+v.female + +v.male) / 2,
                gap: Math.abs(+v.female - +v.male)
            }
        }))

const barChartId = appendChartContainer({
    idNum: 1,
    chartTitle: 'Chart Title',
    theme: 'dark',
    titleClass: 'text-9xl text-neutral-200 font-medium'
})

getData().then(data => {

    const chartDimensions = getChartDimensions({
        chartId: barChartId,
        md: { width: 175 }
    })

    addBar(
        getChart({
            id: barChartId,
            chartDimensions,
            margin: getMargin({ left: 64, top: 4, bottom: 0, right: 0 })
        }),
        data.filter(d => d.year === '2021')
    )
})

function addBar(chartProps, data) {
    const { chart, width, height } = chartProps

    let filteredData = d3.sort(data, (a, b) => d3.descending(a.average, b.average))
    filteredData = [0, 7, 82, 176, 224].map(i => filteredData[i])
    const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    filteredData = filteredData.map(d => { return { ...d, country: 'Group ' + groupLetters.shift() } })


    const x = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, d => d.average * 1.05)])
        .range([0, width])

    const y = d3
        .scaleBand()
        .domain(filteredData.map(d => d.country))
        .range([0, height])
        .padding(.25)

    chart
        .selectAll('.myRect')
        .data(filteredData)
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => y(d.country))
        .attr('width', d => x(d.average))
        .attr('height', y.bandwidth())
        .attr('fill', palette.blue)

    addAxis({
        chart,
        height,
        width,
        y,
        colour: palette.axis,
        hideXdomain: true,
        hideYdomain: true,
    })
}