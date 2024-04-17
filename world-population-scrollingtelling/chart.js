import { addAxis } from "../components/axis/script.js"
import { colours } from "./constants.js"

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

const margin = {
    left: 16,
    right: 16,
    top: 16,
    bottom: 16
}

let chart
let fullData
let x
let y
let radius
let colour

const addUpdateChart = year => {
    const dataFiletered = fullData.filter(d => d.year === year)

    chart
        .selectAll('circle')
        .data(dataFiletered)
        .join('circle')
        .style('fill', d => colour(d.region))
        .style('opacity', 0.75)
        .transition('updateChart')
        .duration(100)
        .attr('cx', d => x(d.gdpPerCapita))
        .attr('cy', d => y(d.lifeExpectancy))
        .attr('r', d => radius(d.population))
}

export const initChart = ({
    svg,
    width,
    height,
    xPosition,
    yPosition
}) => {
    chart = svg
        .append('g')
        .attr('transform', `translate(${[xPosition, yPosition]})`)

    getData().then(data => {
        fullData = data

        x = d3
            .scaleLog()
            .domain(d3.extent(data, d => d.gdpPerCapita).map((d, i) => d * [0.99, 1.01][i]))
            .range([0, width])

        y = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.lifeExpectancy).map((d, i) => d * [0.999, 1.001][i]))
            .range([height, 0])

        radius = d3
            .scaleSqrt()
            .domain(d3.extent(data, d => d.population))
            .range([2, 40])

        const uniqueRegions = [...new Set(data.map(d => d.region))].sort()
        colour = d3
            .scaleOrdinal()
            .domain(uniqueRegions)
            .range([colours.africa, colours.americas, colours.asia, colours.europe])

        addUpdateChart("1800")

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
}


const getYear = (start, end, progress) => {
    return Math.floor(start + ((end - start) * progress))
}

export const updateChart = (yearStart, yearEnd, progress) => {
    if (fullData === undefined) return

    const currentYear = getYear(yearStart, yearEnd, progress)
    addUpdateChart(currentYear.toString())
}