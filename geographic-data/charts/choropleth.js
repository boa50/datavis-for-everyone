import { addColourLegend, addHighlightTooltip, formatCurrency, getPalette } from "../../node_modules/visual-components/index.js"

export const addChart = (chartProps, data, geo, theme = 'light') => {
    const { chart, width, height } = chartProps
    const palette = getPalette(theme)

    const projection = d3
        // .geoEquirectangular()
        // .scale(width / 2 / Math.PI)
        .geoNaturalEarth1()
        .scale(width / 1.8 / Math.PI)
        .translate([width / 2, height / 2])
        .clipExtent([[0, 0], [width, height]])

    const colour = getColourScale(d3.max(data, d => d.gdpPerCapita) / 2, 7, 'log', palette)

    const getCountry = code => {
        const dataPoint = data.filter(d => d.code === code)[0]

        return dataPoint !== undefined ? dataPoint.country : code
    }

    const getGdpPerCapita = code => {
        const dataPoint = data.filter(d => d.code === code)[0]

        return dataPoint !== undefined ? dataPoint.gdpPerCapita : 0
    }

    chart
        .append('g')
        .selectAll('.data-point')
        .data(geo.features)
        .join('path')
        .attr('class', 'data-point')
        .attr('d', d3.geoPath()
            .projection(projection)
        )
        .attr('fill', d => {
            const gdp = getGdpPerCapita(d.id)
            if (gdp > 0) return colour(gdp)
            else return d3.hsl(palette.axis).brighter(3)
        })
        .attr('stroke-width', 0.25)
        .style('stroke', theme === 'light' ? palette.axis : palette.contrasting)

    const colourLegendWidth = width / 4
    const colourLegendLength = colour.domain().length

    const colourLegendAxis = d3
        .scaleLinear()
        .domain(colour.domain())
        .range([...Array(colourLegendLength).keys()].map(i => (i + 1) * (colourLegendWidth / colourLegendLength)))

    addColourLegend({
        chart,
        colourScale: colour,
        colourScaleType: 'threshold',
        axis: colourLegendAxis,
        title: 'GDP per capita',
        yPosition: height / 1.25,
        xPosition: 8,
        width: colourLegendWidth,
        textColour: palette.axis,
        axisTickFormat: d3.format('.2s')
    })

    addHighlightTooltip({
        chart,
        htmlText: d => `
        <strong>${getCountry(d.id)}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>GDP per capita:&emsp;</span>
            <span>${formatCurrency(getGdpPerCapita(d.id))}</span>
        </div>
        `,
        elements: chart.selectAll('.data-point'),
        highlightedOpacity: 1,
        fadedOpacity: 0.25,
        initialOpacity: 1
    })
}

function getColourScale(maxValue, nSteps = 5, type = 'linear', palette) {
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

    const colourRange = domain.map(d => d3.interpolateRgb('#FFFFFF', palette.blue)(d / maxTruncated))
    return d3.scaleThreshold()
        .domain(domain)
        .range(colourRange)
}