export const flagWidth = window.innerHeight / 18
export const xAxisFontSize = '1rem'
export const explanationTextFontSize = getResponsiveSize({
    xl2: '1.75rem', xl: '1.45rem', lg: '1.45rem', md: '1.45rem', sm: '1.45rem'
})
export const chartTitleFontSize = '1.75rem'
export const rankingFontSize = '1.2rem'
export const countryNameFontSize = '1rem'

export const flagToBarPadding = 4
export const rankingToFlagPadding = 8
export const countryNamePadding = 8

export const getChartWidth = visualisationsWidth => 1080 < visualisationsWidth - 450 ? 1080 : visualisationsWidth - 450
export const getChartHeight = windowHeight => windowHeight - 128
export const chartXposition = 86
export const getChartYposition = windowHeight => (windowHeight - getChartHeight(windowHeight)) / 2 - 16

export const getExplanationTextWidth = visualisationsWidth => visualisationsWidth - getChartWidth(visualisationsWidth) - chartXposition - 100
export const getExplanationTextX = visualisationsWidth => chartXposition + getChartWidth(visualisationsWidth) + 16

export const getChartTitleWidth = visualisationsWidth => getChartWidth(visualisationsWidth) + 48
export const chartTitleHeight = 40
export const chartTitleX = chartXposition - flagWidth - 4
export const getChartTitleYposition = windowHeight => getChartYposition(windowHeight) - 50


function getResponsiveSize(sizes = { xl2: 0, xl: 0, lg: 0, md: 0, sm: 0 }) {
    if (window.matchMedia("(min-width: 1536px)").matches) {
        return sizes.xl2
    } else if (window.matchMedia("(min-width: 1280px)").matches) {
        return sizes.xl
    } else if (window.matchMedia("(min-width: 1024px)").matches) {
        return sizes.lg
    } else if (window.matchMedia("(min-width: 768px)").matches) {
        return sizes.md
    } else {
        return sizes.sm
    }
}
