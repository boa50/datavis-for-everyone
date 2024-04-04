import pandas as pd
import plotly.express as px

# Winners by country and Continent (map)
def plot(df: pd.DataFrame, chart_height: int, map_lines_colour: str):
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
        title="Winners by country",
        color_discrete_sequence=[px.colors.qualitative.D3[0], px.colors.qualitative.D3[3], px.colors.qualitative.D3[1], px.colors.qualitative.D3[2]],
        hover_data={"iso_alpha": False, "continent": False},
    )
    winners_map.update_layout(
        margin=dict(l=8, r=8, t=20, b=8),
        legend=dict(
            orientation="h", yanchor="top", y=1.05, xanchor="left", x=0.25, title_text=""
        ),
        geo_bgcolor="rgba(0,0,0,0)",
    )
    winners_map.update_geos(
        visible=False,
        showcountries=True, 
        countrycolor=map_lines_colour
    )

    return winners_map