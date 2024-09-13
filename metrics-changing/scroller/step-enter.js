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
                down: updateChartFunctions().showRanking
            })
            break
        case 2:
            // Focus on the first 3 countries (zooming or colouring)
            break
        case 3:
            // If it's the case, remove the zoom
            break
        case 4:
            if (currentDirection === 'down') updateChartFunctions().plotHomicideRate()
            break
        default:
            break
    }
}

function manageDirection({ currentDirection, up = () => { }, down = () => { } }) {
    if (currentDirection === 'down') down()
    else up()
}