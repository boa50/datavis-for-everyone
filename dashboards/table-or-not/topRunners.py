import pandas as pd
import plotly.express as px
from colours import colours

# Top runners (bar)
def plot(df: pd.DataFrame, chart_height: int, gender: str, top_size: int = 5):
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
        title=f"Fastest {gender}",
    )
    top_runners.update_xaxes(
        range=[
            min(df_top_runners["time_seconds"]) * 0.999,
            max(df_top_runners["time_seconds"]) * 1.001,
        ]
    )
    top_runners.update_layout(
        yaxis={"categoryorder": "total descending"},
        yaxis_title="Runner",
        xaxis_title="Seconds to finish",
        margin=dict(l=8, r=8, t=20, b=8),
        coloraxis_showscale=False
    )

    return top_runners