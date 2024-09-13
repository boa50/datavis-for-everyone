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
                down: updateChartFunctions().plotInitial
            })
            break
        case 1:
            manageDirection({
                currentDirection,
                up: updateChartFunctions().hideRanking
            })
            break
        case 2:
            manageDirection({
                currentDirection,
                down: updateChartFunctions().showRanking,
                up: updateChartFunctions().defaultBarColour
            })
            break
        case 3:
            manageDirection({
                currentDirection,
                down: updateChartFunctions().highlightBarColour,
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