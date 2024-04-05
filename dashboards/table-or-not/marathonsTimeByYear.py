import pandas as pd
import altair as alt
from colours import colours


# Marathons finishing time by year
def plot(df: pd.DataFrame, chart_height: int, background_colour: str = "white"):
    return (
        alt.Chart(
            df,
            height=chart_height,
            padding={"left": 16, "top": 16, "right": 16, "bottom": 16},
            title="Marathons finishing time by year",
        )
        .configure(background=background_colour)
        .configure_title(
            offset=10, fontSize=16, fontWeight=700, color=colours["chart_title"]
        )
        .configure_axis(grid=False, domain=True)
        .mark_circle(size=60)
        .encode(
            x=alt.X(
                "year",
                title="Year",
                scale=alt.Scale(domain=[min(df["year"]) - 5, max(df["year"]) + 5]),
                axis=alt.Axis(
                    format=".4", tickCount=7, titlePadding=10, labelPadding=10
                ),
            ),
            y=alt.Y(
                "utchoursminutesseconds(time_plot):T",
                title="Finishing time",
                axis=alt.Axis(titlePadding=15, labelPadding=10),
            ),
            color=alt.Color(
                "gender",
                legend=None,
                scale=alt.Scale(range=[colours["women"], colours["men"]]),
            ),
            tooltip=["year", "marathon", "gender", "winner", "country", "time"],
        )
    )
