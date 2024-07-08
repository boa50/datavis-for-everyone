import { palette } from "../../colours.js"

export const checkDefaultPalette = colourPalette => {
    if (colourPalette === undefined || colourPalette === null || !Object.hasOwn(colourPalette, 'chart')) {
        colourPalette = {
            chart: [palette.bluishGreen, palette.blue, palette.orange, palette.reddishPurple],
            axis: palette.axis,
            pattern: '#000000'
        }
    }

    return colourPalette
}