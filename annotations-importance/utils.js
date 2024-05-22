import { hideText, showText, createText } from "../node_modules/visual-components/index.js"
import { defaultColours as colours } from "../colours.js"

const getSpeed = stepSize => (1 / 0.5) * stepSize

export const showHideTextElement = ({
    element,
    hideStartsAt = 0.5,
    executeShow = true,
    executeHide = true,
    stepSize = 1,
    progress = 1
}) => {
    const speed = getSpeed(stepSize)
    if (executeShow && (progress <= hideStartsAt)) showText(element, progress * speed)
    if (executeHide && (progress > hideStartsAt)) hideText(element, (progress - hideStartsAt) * speed)
}

export const showTextElement = ({
    element,
    startsAt = 0.5,
    stepSize = 1,
    progress = 1
}) => {
    const speed = getSpeed(stepSize)
    if (progress >= startsAt) showText(element, (progress - startsAt) * speed)
}

export const hideTextElement = ({
    element,
    endsAt = 0.5,
    stepSize = 1,
    progress = 1
}) => {
    const speed = getSpeed(stepSize)
    if (progress <= endsAt) hideText(element, progress * speed)
}

export const addAnnotation = ({
    svg,
    x,
    y,
    deaths,
    description
}) =>
    createText({
        svg,
        x,
        y,
        width: 200,
        height: 34,
        textColour: d3.hsl(colours.axis).brighter(0.9),
        fontSize: '0.7rem',
        htmlText: `
            <span class="font-base leading-tight">${d3.formatLocale({ thousands: ' ', grouping: [3] }).format(',.0f')(deaths)}k deaths</span>
            </br><span class="font-base leading-tight">${description}</span>
        `
    })