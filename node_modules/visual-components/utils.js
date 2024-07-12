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

const getSvgWidth = chartId =>
    document.getElementById(`${chartId}-container`).offsetWidth

const getSvgHeight = chartId => {
    const title = document.getElementById(`${chartId}-title`)
    const subtitle = document.getElementById(`${chartId}-subtitle`)

    return document.getElementById(`${chartId}-container`).offsetHeight
        - (title ? title.offsetHeight : 0) - (subtitle ? subtitle.offsetHeight : 0)
}

const getChartScale = chartId => {
    return getSvgWidth(chartId) / getSvgHeight(chartId)
}

export const getChartDimensions = ({
    chartId,
    sm = { width: 420, scale: undefined },
    md = { width: 700, scale: undefined },
    lg = { width: 700, scale: undefined },
    xl = { width: 622, scale: undefined },
    xl2 = { width: 875, scale: undefined }
}) => {
    let width, height, scale

    if (window.matchMedia("(min-width: 1536px)").matches) {
        width = xl2.width
        scale = xl2.scale
    } else if (window.matchMedia("(min-width: 1280px)").matches) {
        width = xl.width
        scale = xl.scale
    } else if (window.matchMedia("(min-width: 1024px)").matches) {
        width = lg.width
        scale = lg.scale
    } else if (window.matchMedia("(min-width: 768px)").matches) {
        width = md.width
        scale = md.scale
    } else {
        width = sm.width
        scale = sm.scale
    }

    if (scale === undefined) {
        scale = chartId !== undefined ? getChartScale(chartId) : (16 / 9)
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
    svgWidth = svgWidth !== undefined ? svgWidth : getSvgWidth(id)
    svgHeight = svgHeight !== undefined ? svgHeight : getSvgHeight(id)

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

export const appendChartContainer = ({
    idNum = 0,
    chartTitle,
    chartSubtitle,
    outerContainerClass,
    innerContainerClass,
    titleClass,
    subtitleClass,
    chartsContainerId = 'charts',
    theme = 'light'
}) => {
    const chartId = `chart${idNum}`

    switch (theme) {
        case 'light':
            outerContainerClass = getValueIfUndefined(outerContainerClass, 'bg-neutral-50 px-4 py-2 rounded')
            innerContainerClass = getValueIfUndefined(innerContainerClass, 'aspect-[4/3] md:aspect-video')
            titleClass = getValueIfUndefined(titleClass, 'text-sm md:text-base text-gray-700 font-medium')
            subtitleClass = getValueIfUndefined(subtitleClass, 'text-xs md:text-sm text-gray-500')
            break
        case 'dark':
            outerContainerClass = getValueIfUndefined(outerContainerClass, 'bg-neutral-900 px-4 py-2 rounded')
            innerContainerClass = getValueIfUndefined(innerContainerClass, 'aspect-[4/3] md:aspect-video')
            titleClass = getValueIfUndefined(titleClass, 'text-sm md:text-base text-neutral-200 font-medium')
            subtitleClass = getValueIfUndefined(subtitleClass, 'text-xs md:text-sm text-neutral-400')
            break
        case 'darkGradient':
            outerContainerClass = getValueIfUndefined(outerContainerClass, 'bg-gradient-to-b from-gray-800 to-gray-950 px-4 py-2 rounded')
            innerContainerClass = getValueIfUndefined(innerContainerClass, 'aspect-[4/3] md:aspect-video')
            titleClass = getValueIfUndefined(titleClass, 'text-sm md:text-base text-neutral-200 font-medium')
            subtitleClass = getValueIfUndefined(subtitleClass, 'text-xs md:text-sm text-neutral-400')
            break
        default:
            outerContainerClass = getValueIfUndefined(outerContainerClass, 'bg-neutral-50 px-4 py-2 rounded')
            innerContainerClass = getValueIfUndefined(innerContainerClass, 'aspect-[4/3] md:aspect-video')
            titleClass = getValueIfUndefined(titleClass, 'text-sm md:text-base text-gray-700 font-medium')
            subtitleClass = getValueIfUndefined(subtitleClass, 'text-xs md:text-sm text-gray-500')
            break
    }

    d3
        .select(`#${chartsContainerId}`)
        .append('div')
        .attr('class', outerContainerClass)
        .append('div')
        .attr('id', `${chartId}-container`)
        .attr('class', innerContainerClass)
        .call(g =>
            chartTitle !== undefined ?
                g
                    .append('h3')
                    .attr('id', `${chartId}-title`)
                    .attr('class', titleClass)
                    .text(chartTitle)
                : g
        )
        .call(g =>
            chartSubtitle !== undefined ?
                g
                    .append('h4')
                    .attr('id', `${chartId}-subtitle`)
                    .attr('class', subtitleClass)
                    .text(chartSubtitle)
                : g
        )
        .call(g =>
            g
                .append('svg')
                .attr('id', chartId)
        )

    return chartId
}

function getValueIfUndefined(variable, value) {
    return variable === undefined ? value : variable
}