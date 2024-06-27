// Based on: https://www.geeksforgeeks.org/calculate-the-width-of-the-text-in-javascript/
export const getTextWidth = (txt, fontSize = '1rem', fontWeight = 700) => {
    const text = document.createElement('span')
    document.body.appendChild(text)

    text.style.font = 'ui-sans-serif'
    text.style.fontSize = fontSize
    text.style.fontWeight = fontWeight
    text.style.height = 'auto'
    text.style.width = 'auto'
    text.style.position = 'absolute'
    text.style.whiteSpace = 'no-wrap'
    text.innerHTML = txt;

    const width = Math.ceil(text.clientWidth)
    document.body.removeChild(text)

    return width
}

export const convertSizeToIntPx = size => {
    const baseSize = 16
    const sizeNumber = parseFloat(size)
    const measure = size.replace(sizeNumber.toString(), '')

    switch (measure) {
        case 'px':
            return sizeNumber
        case 'rem':
            return sizeNumber * baseSize
        case 'em':
            return sizeNumber * baseSize
        case 'pt':
            return (sizeNumber / 12) * baseSize
        case '%':
            return (sizeNumber / 100) * baseSize
    }
}

export const getTransformTranslate = transform =>
    transform.substring(transform.indexOf('(') + 1, transform.indexOf(')')).split(/[,]/).map(d => +d)

export const formatCurrency = (value, decimals = false) =>
    d3
        .formatLocale({
            thousands: ' ',
            grouping: [3],
            currency: ['$', '']
        })
        .format(decimals ? '$,.2f' : '$,.0f')
        (value)

export const formatDate = (value, year = true, month = true, day = false) => {
    let options = {
        year: "numeric",
        month: "long",
        day: "numeric"
    }

    if (year && month && !day) {
        options = {
            year: "numeric",
            month: "long"
        }
    }

    return new Intl.DateTimeFormat('en-AU', options).format(value)
}

export const getMargin = ({
    left = 64,
    right = 16,
    top = 8,
    bottom = 56
}) => { return { left, right, top, bottom } }

export const getChartDimensions = ({
    sm = { width: 420, scale: 1.45 },
    md = { width: 420, scale: 1.45 },
    lg = { width: 700, scale: 1.9 },
    xl = { width: 622, scale: 1.9 },
    xl2 = { width: 875, scale: 1.9 }
}) => {
    let width, height, scale

    if (window.matchMedia("(max-width: 639px)").matches) {
        width = sm.width
        scale = sm.scale
    } else if (window.matchMedia("(max-width: 767px)").matches) {
        width = md.width
        scale = md.scale
    } else if (window.matchMedia("(max-width: 1279px)").matches) {
        width = lg.width
        scale = lg.scale
    } else if (window.matchMedia("(max-width: 1535px)").matches) {
        width = xl.width
        scale = xl.scale
    } else {
        width = xl2.width
        scale = xl2.scale
    }

    height = width / scale

    return { width, height }
}

export const getChart = ({
    id,
    svgWidth,
    svgHeight,
    chartDimensions = getChartDimensions({}),
    margin = getMargin({})
}) => {
    if (svgWidth === undefined)
        svgWidth = document.getElementById(`${id}-container`).offsetWidth
    if (svgHeight === undefined) {
        const title = document.getElementById(`${id}-title`)
        svgHeight = document.getElementById(`${id}-container`).offsetHeight - (title ? title.offsetHeight : 0)
    }

    const viewBoxWidth = chartDimensions.width !== undefined ? chartDimensions.width : svgWidth
    const viewBoxHeight = chartDimensions.height !== undefined ? chartDimensions.height : svgHeight

    const width = viewBoxWidth - margin.left - margin.right
    const height = viewBoxHeight - margin.top - margin.bottom

    const chart = d3
        .select(`#${id}`)
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('viewBox', `0 0  ${viewBoxWidth} ${viewBoxHeight}`)
        .attr('preserveAspectRatio', 'xMinYMid meet')
        .append('g')
        .attr('id', `${id}-main-g`)
        .attr('transform', `translate(${[margin.left, margin.top]})`)

    return { chart, width, height, margin }
}