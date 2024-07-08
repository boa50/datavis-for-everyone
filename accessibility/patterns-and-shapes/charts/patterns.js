const addPattern = (svg, id, width, height, path, scale, colour) => {
    svg
        .append('defs')
        .append('pattern')
        .attr('id', id)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('patternTransform', `scale(${scale} ${scale})`)
        .attr('width', width)
        .attr('height', height)
        .append('path')
        .attr('d', path)
        .attr('stroke', colour)
        .attr('stroke-width', 1)
        .attr('fill', 'none')
}

export const addWavesPattern = (svg, scale = 1, colour = '#000000') => {
    let id = 'wavesPattern' + (svg.attr('id') !== undefined ? svg.attr('id') : Math.random())
    if (scale !== undefined) id += scale

    addPattern(
        svg, id, 70, 8,
        'M-.02 22c8.373 0 11.938-4.695 16.32-9.662C20.785 7.258 25.728 2 35 2c9.272 0 14.215 5.258 18.7 10.338C58.082 17.305 61.647 22 70.02 22M-.02 14.002C8.353 14 11.918 9.306 16.3 4.339 20.785-.742 25.728-6 35-6 44.272-6 49.215-.742 53.7 4.339c4.382 4.967 7.947 9.661 16.32 9.664M70 6.004c-8.373-.001-11.918-4.698-16.3-9.665C49.215-8.742 44.272-14 35-14c-9.272 0-14.215 5.258-18.7 10.339C11.918 1.306 8.353 6-.02 6.002',
        scale, colour
    )

    return id
}

export const addCrossPattern = (svg, scale = 1, colour = '#000000') => {
    let id = 'crossPattern' + (svg.attr('id') !== undefined ? svg.attr('id') : Math.random())
    if (scale !== undefined) id += scale

    addPattern(
        svg, id, 20, 20,
        'M3.25 10h13.5M10 3.25v13.5',
        scale, colour
    )

    return id
}

export const addTrianglePattern = (svg, scale = 1, colour = '#000000') => {
    let id = 'trianglePattern' + (svg.attr('id') !== undefined ? svg.attr('id') : Math.random())
    if (scale !== undefined) id += scale

    addPattern(
        svg, id, 47.35, 47.8,
        'm23.67 15 8.66-15 15.02 8.66-8.67 15.01Zm0-30 8.66 15 15.02-8.66-8.67-15.01zM0-8.33v17m47.35-17v17M15.01 0h17.32m-8.66 32.8 8.66 15 15.02-8.66-8.67-15.01zM0 39.47v17m47.35-17v17M15.01 47.8h17.32m-56-32.8L-15 0 0 8.65l-8.66 15.01Zm47.35 0L15 0 0 8.65l8.67 15.01Zm0-30L15 0 0-8.66l8.67-15.01Zm47.33 30L62.35 0 47.33 8.65 56 23.67ZM23.67 62.8l8.66-15 15.02 8.66-8.67 15.01zm47.34-30-8.66 15-15.02-8.66L56 24.13Zm-47.33 30L15 47.8 0 56.45l8.67 15.01Zm-47.35-30 8.67 15 15-8.65-8.66-15.01zm47.35 0L15 47.8 0 39.15l8.67-15.01Z',
        scale, colour
    )

    return id
}

export const addScalesPattern = (svg, scale = 1, colour = '#000000') => {
    let id = 'scalesPattern' + (svg.attr('id') !== undefined ? svg.attr('id') : Math.random())
    if (scale !== undefined) id += scale

    addPattern(
        svg, id, 20, 20,
        'M-10-10A10 10 0 00-20 0a10 10 0 0010 10A10 10 0 010 0a10 10 0 00-10-10zM10-10A10 10 0 000 0a10 10 0 0110 10A10 10 0 0120 0a10 10 0 00-10-10zM30-10A10 10 0 0020 0a10 10 0 0110 10A10 10 0 0140 0a10 10 0 00-10-10zM-10 10a10 10 0 00-10 10 10 10 0 0010 10A10 10 0 010 20a10 10 0 00-10-10zM10 10A10 10 0 000 20a10 10 0 0110 10 10 10 0 0110-10 10 10 0 00-10-10zM30 10a10 10 0 00-10 10 10 10 0 0110 10 10 10 0 0110-10 10 10 0 00-10-10z',
        scale, colour
    )

    return id
}

export const getPatternIds = (chart, colour) => {
    const wavesPatternId = addWavesPattern(chart, 1, colour)
    const crossPatternId = addCrossPattern(chart, 1, colour)
    const trianglePatternId = addTrianglePattern(chart, 1, colour)
    const scalesPatternId = addScalesPattern(chart, 1, colour)

    const wavesPatternIdLegend = addWavesPattern(chart, 0.7, colour)
    const crossPatternIdLegend = addCrossPattern(chart, 0.7, colour)
    const trianglePatternIdLegend = addTrianglePattern(chart, 0.7, colour)
    const scalesPatternIdLegend = addScalesPattern(chart, 0.7, colour)

    const patternIds = [wavesPatternId, trianglePatternId, scalesPatternId, crossPatternId]
    const patternIdsLegend = [wavesPatternIdLegend, trianglePatternIdLegend, scalesPatternIdLegend, crossPatternIdLegend]

    return [patternIds, patternIdsLegend]
}
