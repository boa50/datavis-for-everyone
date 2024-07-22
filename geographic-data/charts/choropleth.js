import { palette } from "../../colours.js"

export const addChart = (chartProps, data, geo) => {
    const { chart, width, height } = chartProps

    const projection = d3
        // .geoEquirectangular()
        // .scale(width / 2 / Math.PI)
        .geoNaturalEarth1()
        .scale(width / 1.8 / Math.PI)
        .translate([width / 2, height / 2])
        .clipExtent([[0, 0], [width, height]])

    const colour = getColourScale(d3.max(data, d => d.gdpPerCapita) / 2, 7, 'log')

    const getGdpPerCapita = code => {
        const dataPoint = data.filter(d => d.code === code)[0]

        return dataPoint !== undefined ? dataPoint.gdpPerCapita : 0
    }

    chart
        .append('g')
        .selectAll('path')
        .data(geo.features)
        .join('path')
        .attr('d', d3.geoPath()
            .projection(projection)
        )
        .attr('fill', d => colour(getGdpPerCapita(d.id)))
        .attr('stroke-width', 0.25)
        .style('stroke', '#262626')
}

function getColourScale(maxValue, nSteps = 5, type = 'linear') {
    const significantNumbers = Math.pow(10, Math.trunc(maxValue).toString().length - 2)
    const maxTruncated = Math.trunc(maxValue / significantNumbers) * significantNumbers
    let domain

    switch (type) {
        case 'linear':
            domain = [...Array(nSteps).keys()].map(i => (i + 1) * maxTruncated / nSteps)
            break
        case 'log':
            const minLog = Math.log(maxTruncated / nSteps)
            const maxLog = Math.log(maxTruncated)

            const logRange = maxLog - minLog
            const logStep = logRange / nSteps

            domain = [...Array(nSteps).keys()].map(i => Math.exp(minLog + (i + 1) * logStep))
            break

        default:
            domain = [...Array(nSteps).keys()].map(i => (i + 1) * maxTruncated / nSteps)
            break
    }

    // console.log(maxValue, maxTruncated, domain);

    const colourRange = domain.map(d => d3.interpolateRgb('#FFFFFF', palette.blue)(d / maxTruncated))
    return d3.scaleThreshold()
        .domain(domain)
        .range(colourRange)
}