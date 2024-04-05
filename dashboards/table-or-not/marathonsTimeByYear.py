import pandas as pd
import altair as alt
from colours import colours


# Marathons finishing time by year
def plot(df: pd.DataFrame, chart_height: int):
    return (
        alt.Chart(
            df,
            height=chart_height,
            padding={"left": 8, "top": 2, "right": 16, "bottom": 16},
            title="Marathons finishing time by year",
        )
        .configure_axis(grid=False, domain=True)
        .mark_circle(size=60)
        .encode(
            x=alt.X(
                "year",
                title="Year",
                scale=alt.Scale(domain=[min(df["year"]) - 5, max(df["year"]) + 5]),
                axis=alt.Axis(format=".4", tickCount=7),
            ),
            y=alt.Y(
                "utchoursminutesseconds(time_plot):T",
                title="Finishing time",
            ),
            color=alt.Color(
                "gender",
                legend=None,
                scale=alt.Scale(range=[colours["women"], colours["men"]]),
            ),
            tooltip=["year", "marathon", "gender", "winner", "country", "time"],
        )
    )
