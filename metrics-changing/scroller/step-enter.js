export const handleStepEnter = ({
    response,
    updateChartFunctions
}) => {
    const currentIndex = response.index
    const currentDirection = response.direction

    switch (currentIndex) {
        case 0:
            manageDirection({
                currentDirection,
                down: updateChartFunctions().plotInitial,
                up: updateChartFunctions().hideRanking
            })
            break
        case 1:
            // Add positions for each flag
            manageDirection({
                currentDirection,
                down: updateChartFunctions().showRanking,
                up: updateChartFunctions().defaultBarColour
            })
            break
        case 2:
            // Focus on the first 3 countries (zooming or colouring)
            manageDirection({
                currentDirection,
                down: updateChartFunctions().highlightBarColour
            })
            break
        case 3:
            manageDirection({
                currentDirection,
                up: () => {
                    updateChartFunctions().plotHomicideNumber()
                    updateChartFunctions().showRanking()
                    updateChartFunctions().highlightBarColour()
                }
            })
            break
        case 4:
            manageDirection({
                currentDirection,
                down: () => {
                    updateChartFunctions().plotHomicideRate()
                    updateChartFunctions().showRanking()
                }
            })
            break
        default:
            break
    }
}

function manageDirection({ currentDirection, up = () => { }, down = () => { } }) {
    if (currentDirection === 'down') down()
    else up()
}