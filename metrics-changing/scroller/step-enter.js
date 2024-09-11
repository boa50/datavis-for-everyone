export const handleStepEnter = ({
    response,
    updateChartFunctions
}) => {
    const currentIndex = response.index
    const currentDirection = response.direction

    switch (currentIndex) {
        case 0:
            updateChartFunctions().plotHomicideNumber()
            break
        case 1:
            // Add positions for each flag
            break
        case 2:
            // Focus on the first 3 countries (zooming or colouring)
            break
        case 3:
            // If it's the case, remove the zoom
            break
        case 4:
            updateChartFunctions().plotHomicideRate()
            break
        default:
            break
    }
}