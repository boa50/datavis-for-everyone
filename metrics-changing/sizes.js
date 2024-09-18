export const flagWidth = window.innerHeight / 18
export const xAxisFontSize = getResponsiveSize({ xl2: '1.75rem', sm: '0.9rem' })
export const explanationTextFontSize = getResponsiveSize({ xl2: '1.75rem', sm: '1.45rem' })
export const chartTitleFontSize = '1.75rem'
export const rankingFontSize = '1.2rem'
export const countryNameFontSize = '1rem'
export const dataSourceFontSize = '0.8rem'

export const flagToBarPadding = 4
export const rankingToFlagPadding = 8
export const countryNamePadding = 8

export const getChartWidth = visualisationsWidth => visualisationsWidth * getResponsiveSize({ xl2: 0.7, lg: 0.6, sm: 0.5 })
export const getChartHeight = windowHeight => windowHeight - 128
export const chartXposition = getResponsiveSize({ xl2: 116, lg: 86, sm: 116 })
export const getChartYposition = windowHeight => (windowHeight - getChartHeight(windowHeight)) / 2 - 16

export const getExplanationTextWidth = visualisationsWidth => visualisationsWidth - getChartWidth(visualisationsWidth) - chartXposition - 100
export const getExplanationTextX = visualisationsWidth => chartXposition + getChartWidth(visualisationsWidth) + 16

export const getChartTitleWidth = visualisationsWidth => getChartWidth(visualisationsWidth) + 48
export const chartTitleHeight = 40
export const chartTitleX = chartXposition - flagWidth - 4
export const getChartTitleYposition = windowHeight => getChartYposition(windowHeight) - 50

export const dataSourceHeight = 16
export const getDataSourceYposition = windowHeight => windowHeight - 24


function getResponsiveSize(sizes = { xl2: 0, xl: 0, lg: 0, md: 0, sm: 0 }) {
    const sizeKeys = Object.keys(sizes)

    const getAvailableSize = screenSize => {
        switch (screenSize) {
            case 'xl2':
                if (sizeKeys.includes('xl2')) return sizes.xl2
            case 'xl':
                if (sizeKeys.includes('xl')) return sizes.xl
            case 'lg':
                if (sizeKeys.includes('lg')) return sizes.lg
            case 'md':
                if (sizeKeys.includes('md')) return sizes.md
            case 'sm':
                if (sizeKeys.includes('sm')) return sizes.sm
            default:
                break
        }
    }


    if (window.matchMedia("(min-width: 1536px)").matches) {
        return getAvailableSize('xl2')
    } else if (window.matchMedia("(min-width: 1280px)").matches) {
        return getAvailableSize('xl')
    } else if (window.matchMedia("(min-width: 1024px)").matches) {
        return getAvailableSize('lg')
    } else if (window.matchMedia("(min-width: 768px)").matches) {
        return getAvailableSize('md')
    } else {
        return getAvailableSize('sm')
    }
}