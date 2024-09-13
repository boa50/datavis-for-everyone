export const handleStepExit = ({
    response,
    updateChartFunctions
}) => {
    const currentIndex = response.index
    const currentDirection = response.direction

    switch (currentIndex) {
        case 0:
            if (currentDirection === 'up') updateChartFunctions().clearChart()
            break
        case 1:
            // Do Something
            break
        case 2:
            // Do Something
            break
        case 3:
            // Do Something
            break
        default:
            break
    }
}