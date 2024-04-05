import pandas as pd
import plotly.express as px
from colours import colours


# Top runners (bar)
def plot(
    df: pd.DataFrame,
    chart_height: int,
    gender: str,
    top_size: int = 5,
    background_colour: str = "white",
    margin_left_add: int = 0,
):
    df_top_runners = df.sort_values(by="time")[:top_size]
    top_runners = px.bar(
        df_top_runners,
        x="time_seconds",
        y="winner",
        color="time_seconds",
        color_continuous_scale=[colours[gender], colours[f"{gender}_light"]],
        hover_data={
            "time_seconds": False,
            "year": True,
            "marathon": True,
            "time": True,
        },
        height=chart_height,
    )
    top_runners.update_layout(
        title=dict(
            text=f"Fastest {gender}", x=0.015, font_color=colours["chart_title"]
        ),
        xaxis=dict(
            title="Seconds to finish",
            range=[
                min(df_top_runners["time_seconds"]) * 0.999,
                max(df_top_runners["time_seconds"]) * 1.001,
            ],
        ),
        yaxis=dict(
            title="Runner",
            categoryorder="total descending",
        ),
        margin=dict(l=145 + margin_left_add, r=36, t=55, b=8),
        coloraxis_showscale=False,
        paper_bgcolor=background_colour,
        plot_bgcolor=background_colour,
    )

    return top_runners
