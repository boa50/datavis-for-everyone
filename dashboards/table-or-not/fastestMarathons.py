import pandas as pd
import plotly.express as px


# Modern years fastest marathons by average (bar)
def plot(df: pd.DataFrame, chart_height: int):
    df_modern_years = df[df["year"] >= 2000][["marathon", "year", "time"]]
    df_modern_years["time"] = pd.to_timedelta(df_modern_years["time"])
    df_modern_years = df_modern_years.groupby(by="marathon").mean().reset_index()
    df_modern_years["time"] = df_modern_years["time"] + pd.to_datetime("1970/01/01")

    race_modern_years = px.bar(
        df_modern_years,
        x="marathon",
        y="time",
        height=chart_height,
        title="Fastest marathons",
        color_discrete_sequence=[px.colors.qualitative.D3[0]],
    )
    race_modern_years.update_layout(
        xaxis={"categoryorder": "total ascending"},
        yaxis_title="Finishing time (average)",
        xaxis_title="Marathon",
        yaxis_tickformat="%H:%M:%S",
        yaxis_range=[
            pd.to_datetime("1970/01/01 02:10:00"),
            pd.to_datetime("1970/01/01 02:20:00"),
        ],
        margin=dict(l=8, r=8, t=35, b=8),
        title_y=1,
    )

    return race_modern_years
