import { addTooltip, addLegend, addCircleLegend } from "../../../node_modules/visual-components/index.js"
import { addAxis } from "../axis.js"
import { colours } from "../../constants.js"
import { scatterplotV1 } from "./v1.js"
import { scatterplotV2 } from "./v2.js"
import { scatterplotV3 } from "./v3.js"

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
const marginDefault = {
    left: 16,
    right: 16,
    top: 32,
    bottom: 16
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

const getXY = (data, width, height) => {
    const x = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.long).map((d, i) => d * [0.99, 1.01][i]))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.lat).map((d, i) => d * [0.999, 1.001][i]))
        .range([height, 0])

    return [x, y]
}

const addLegends = ({
    chart,
    colour = false,
    group = false,
    deaths = false,
    width,
    height,
    margin,
    size,
    deathsRange,
    circlesYfix = 0
}) => {
    if (colour) {
        addLegend({
            chart,
            legends: ['Advancing', 'Retreating'],
            colours: [colours.advancing, colours.retreating],
            xPosition: -margin.left,
            yPosition: -margin.top + 15
        })
    }

    if (group) {
        addLegend({
            chart,
            legends: ['Group 1', 'Group 2', 'Group 3'],
            colours: colours.text,
            shapes: [d3.symbol(d3.symbolCircle), d3.symbol(d3.symbolSquare), d3.symbol(d3.symbolTriangle)],
            xPosition: width - 235,
            yPosition: -margin.top + 15
        })
    }

    if (deaths) {
        addCircleLegend({
            chart,
            sizeScale: size,
            valuesToShow: [d3.quantile(deathsRange, 0.2), d3.quantile(deathsRange, 0.5), d3.quantile(deathsRange, 1)],
            xPosition: width - 110,
            yPosition: height - circlesYfix - 32,
            colour: colours.text,
            title: 'Deaths'
        })
    }
}

getData().then(datasets => {
    const data = datasets[0]
    const geo = datasets[1]
    const cities = datasets[2]

    const colour = d3
        .scaleOrdinal()
        .domain(['Advancing', 'Retreating'])
        .range([colours.advancing, colours.retreating])

    const deathsRange = [0, d3.max(data, d => d.deaths)]

    const size = d3
        .scaleSqrt()
        .domain(deathsRange)
        .range([0, 35])

    const groupSymbol = d3
        .scaleOrdinal()
        .domain(['1', '2', '3'])
        .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle])

    const v1v2Margin = {
        ...marginDefault,
        left: 64, bottom: 64, top: 42
    }


    // V1
    const [chart1, width1, height1] = getSvgChart('scatterplot-v1-chart', v1v2Margin)
    const [x1, y1] = getXY(data, width1, height1)

    scatterplotV1(chart1, data, size, colour, x1, y1,
        addTooltip('scatterplot-v1-container', (d) => `Deaths: ${d.deaths}`))

    addAxis({
        chart: chart1,
        height: height1,
        width: width1,
        margin: v1v2Margin,
        x: x1,
        y: y1,
        xLabel: 'Longitude',
        yLabel: 'Latitude',
        xFormat: d => `${d}°`,
        yFormat: d => `${d}°`,
        colour: colours.text
    })
    addLegends({
        chart: chart1,
        colour: true,
        deaths: true,
        width: width1,
        height: height1,
        margin: v1v2Margin,
        size: size,
        deathsRange: deathsRange
    })


    // V2
    const [chart2, width2, height2] = getSvgChart('scatterplot-v2-chart', v1v2Margin)
    const [x2, y2] = getXY(data, width2, height2)

    scatterplotV2(chart2, data, groupSymbol, size, colour, x2, y2,
        addTooltip('scatterplot-v2-container', (d) =>
            `${d.direction} - Group ${d.group} </br> Deaths: ${d.deaths}`
        ))

    addAxis({
        chart: chart2,
        height: height2,
        width: width2,
        margin: v1v2Margin,
        x: x2,
        y: y2,
        xLabel: 'Longitude',
        yLabel: 'Latitude',
        xFormat: d => `${d}°`,
        yFormat: d => `${d}°`,
        colour: colours.text
    })
    addLegends({
        chart: chart2,
        colour: true,
        deaths: true,
        group: true,
        width: width2,
        height: height2,
        margin: v1v2Margin,
        size: size,
        deathsRange: deathsRange
    })


    // V3
    const [chart3, width3, height3] = getSvgChart('scatterplot-v3-chart', { left: 0, bottom: 32 })

    scatterplotV3(chart3, width3, height3, data, cities, geo, groupSymbol, size, colour,
        addTooltip('scatterplot-v3-container', (d) =>
            `${d.direction} - Group ${d.group} </br> Deaths: ${d.deaths}`
        ))

    addLegends({
        chart: chart3,
        colour: true,
        deaths: true,
        group: true,
        width: width3,
        height: height3,
        margin: { left: 0, bottom: 32, top: 32 },
        size: size,
        deathsRange: deathsRange,
        circlesYfix: 25
    })
})