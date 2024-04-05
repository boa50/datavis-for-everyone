import pandas as pd
import plotly.express as px
from colours import colours


# Modern years fastest marathons by average (bar)
def plot(df: pd.DataFrame, chart_height: int, background_colour: str = "white"):
    df_modern_years = df[df["year"] >= 2000][["marathon", "year", "time"]]
    df_modern_years["time"] = pd.to_timedelta(df_modern_years["time"])
    df_modern_years = df_modern_years.groupby(by="marathon").mean().reset_index()
    df_modern_years["time"] = df_modern_years["time"] + pd.to_datetime("1970/01/01")

    race_modern_years = px.bar(
        df_modern_years,
        x="marathon",
        y="time",
        height=chart_height,
        color_discrete_sequence=[px.colors.qualitative.D3[0]],
    )
    race_modern_years.update_layout(
        title=dict(
            text="Fastest marathons", x=0.015, y=0.95, font_color=colours["chart_title"]
        ),
        xaxis=dict(title="Marathon", categoryorder="total ascending"),
        yaxis=dict(
            title="Finishing time (average)",
            tickformat="%H:%M:%S",
            range=[
                pd.to_datetime("1970/01/01 02:10:00"),
                pd.to_datetime("1970/01/01 02:20:00"),
            ],
        ),
        autosize=False,
        margin=dict(l=106, r=16, t=55, b=8),
        paper_bgcolor=background_colour,
        plot_bgcolor=background_colour,
    )

    return race_modern_years
