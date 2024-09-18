import { hideTextTransition } from "../../../node_modules/visual-components/index.js"

export const handleStepExit = ({
    response,
    chartTitle,
    updateChartFunctions
}) => {
    const currentIndex = response.index
    const currentDirection = response.direction

    switch (currentIndex) {
        case 0:
            if (currentDirection === 'up') {
                updateChartFunctions().clearChart()
                hideTextTransition(chartTitle, 1000)
            }
            break
        default:
            break
    }
}