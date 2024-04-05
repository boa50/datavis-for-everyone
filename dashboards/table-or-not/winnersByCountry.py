import pandas as pd
import plotly.express as px
from colours import colours


# Winners by country and Continent (map)
def plot(
    df: pd.DataFrame,
    chart_height: int,
    map_lines_colour: str,
    background_colour: str = "white",
):
    df_winners = df[df["year"] >= 2000]
    df_countries = px.data.gapminder().query("year==2007")

    df_winners = (
        df[df["year"] >= 2000]
        .groupby(["country"])
        .count()
        .reset_index()[["country", "winner"]]
    )
    df_winners = pd.merge(df_winners, df_countries, how="left", on="country")[
        ["country", "continent", "winner", "iso_alpha"]
    ]

    winners_map = px.scatter_geo(
        df_winners,
        locations="iso_alpha",
        hover_name="country",
        color="continent",
        size="winner",
        size_max=50,
        projection="natural earth",
        height=chart_height,
        color_discrete_sequence=[
            px.colors.qualitative.D3[0],
            px.colors.qualitative.D3[3],
            px.colors.qualitative.D3[1],
            px.colors.qualitative.D3[2],
        ],
        hover_data={"iso_alpha": False, "continent": False},
    )
    winners_map.update_layout(
        title=dict(
            text="Winners by country", x=0.015, font_color=colours["chart_title"]
        ),
        margin=dict(l=8, r=8, t=55, b=16),
        legend=dict(
            orientation="h",
            xanchor="left",
            x=0.25,
            yanchor="top",
            y=1.07,
            title_text="",
        ),
        paper_bgcolor=background_colour,
        plot_bgcolor=background_colour,
    )
    winners_map.update_geos(
        visible=False,
        showcountries=True,
        countrycolor=map_lines_colour,
        bgcolor="rgba(0,0,0,0)",
    )

    return winners_map
