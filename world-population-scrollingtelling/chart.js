import { colours } from "./constants.js"
import { addAxis } from "../components/axis/script.js"
import { addLegend } from "../components/legend/script.js"
import { addLegend as addCircleLegend } from "../components/circle-legend/script.js"
import { addTooltip } from "../components/tooltip/script.js"

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
const { mouseover, mousemove, mouseleave } = addTooltip(
    'scrolly',
    d => `
    <strong>${d.country}</strong>   
    <div style="display: flex; justify-content: space-between">
        <span>Population:&emsp;&emsp;</span>
        <span>${d3.formatLocale({ thousands: ' ', grouping: [3] }).format(',')(d.population)}</span>
    </div>
    <div style="display: flex; justify-content: space-between">
        <span>Life Expectancy:&emsp;&emsp;</span>
        <span>${d.lifeExpectancy} years</br></span>
    </div>
    <div style="display: flex; justify-content: space-between">
        <span>GDP per Capita:&emsp;&emsp;</span>
        <span>$${d.gdpPerCapita}</span>
    </div>
    `
)

const addUpdateChart = year => {
    const dataFiletered = fullData.filter(d => d.year === year)

    chart
        .selectAll('circle')
        .data(dataFiletered)
        .join('circle')
        .attr('class', 'country-bubbles')
        .style('fill', d => colour(d.region))
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 0.5)
        .style('opacity', 0.75)
        .on('mouseover', function (event, d) {
            d3.selectAll('.country-bubbles').style('opacity', 0.25)
            d3.select(this).style('opacity', 1)
            mouseover(event, d)
        })
        .on('mousemove', mousemove)
        .on('mouseleave', function (event, d) {
            d3.selectAll('.country-bubbles').style('opacity', 0.75)
            mouseleave(event, d)
        })
        .transition('updateChart')
        .duration(100)
        .attr('cx', d => x(d.gdpPerCapita))
        .attr('cy', d => y(d.lifeExpectancy))
        .attr('r', d => radius(d.population))
}

export const initChart = async ({
    svg,
    width,
    height,
    xPosition,
    yPosition,
    year = 1800
}) => {
    chart = svg
        .append('g')
        .attr('transform', `translate(${[xPosition, yPosition]})`)

    return getData().then(data => {
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
            .range([3, 50])

        const uniqueRegions = [...new Set(data.map(d => d.region))].sort()
        const continentColours = [colours.africa, colours.americas, colours.asia, colours.europe]
        colour = d3
            .scaleOrdinal()
            .domain(uniqueRegions)
            .range(continentColours)

        addUpdateChart(year.toString())

        addAxis({
            chart: chart,
            height: height,
            width: width,
            margin: margin,
            x: x,
            y: y,
            xLabel: 'GDP per capita (PPP$2017)',
            yLabel: 'Life expectancy (years, at birth)',
            xFormat: d => `$${(d >= 10000) ? d3.format('.3s')(d).replace('.0', '') : d
                }`,
            colour: colours.text,
            xTickValues: [...Array(9).keys()].map(i => 500 * Math.pow(2, i))
        })
        addLegend({
            id: 'chart-legend',
            legends: uniqueRegions.map(d => d.charAt(0).toUpperCase() + d.substr(1)),
            colours: continentColours,
            xPos: xPosition + 8,
            yPos: yPosition + 16
        })

        const maxPopulation = d3.max(data, d => d.population)
        addCircleLegend({
            id: 'chart',
            sizeScale: radius,
            valuesToShow: [maxPopulation * 0.1, maxPopulation * 0.4, maxPopulation],
            position: [xPosition + width - 125, yPosition + height - 25],
            colour: colours.text,
            title: 'Population',
            textFormat: d => d3.format('.2s')(d).replace('G', 'B')
        })


    })
}


export const getYear = (start, end, progress) => {
    return Math.floor(start + ((end - start) * progress))
}

export const updateChart = (yearStart, yearEnd, progress) => {
    if (fullData === undefined) return

    const currentYear = getYear(yearStart, yearEnd, progress)
    addUpdateChart(currentYear.toString())
}