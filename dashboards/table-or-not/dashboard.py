import sys

sys.path.append("dashboards")

from custom_utils import get_dataset_path
import pandas as pd
import streamlit as st
import altair as alt
import plotly.express as px

st.set_page_config(
    page_title="Table dashboard",
    page_icon="👟",
    layout="wide",
)

df = pd.read_csv(get_dataset_path("world_marathon_majors.csv"), encoding="latin-1")
df["time_plot"] = pd.to_datetime(df["time"], format="%H:%M:%S")

st.dataframe(df)

scatterplot = (
    alt.Chart(df)
    .mark_circle(size=60)
    .encode(
        x=alt.X(
            "year",
            title="Year",
            scale=alt.Scale(domain=[min(df["year"]) - 5, max(df["year"]) + 5]),
        ),
        y=alt.Y(
            "utchoursminutesseconds(time_plot):T",
            title="Completion Time",
        ),
        color=alt.Color("gender", legend=None),
        tooltip=["year", "marathon", "gender", "winner", "country", "time"],
    )
)

st.altair_chart(scatterplot, use_container_width=True)

# Winners by country and Continent (map)
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

fig = px.scatter_geo(
    df_winners,
    locations="iso_alpha",
    hover_name="country",
    color="continent",
    size="winner",
    size_max=50,
    projection="natural earth",
    height=700,
)

st.plotly_chart(fig, use_container_width=True)


# N marathons held (number)
df_n_marathons = df.groupby(by=["year", "marathon"]).count()

st.metric(label="Number of marathons held", value=df_n_marathons.shape[0])
st.metric(
    label="Number of marathons held (with women)",
    value=df_n_marathons[df_n_marathons["gender"] > 1].shape[0],
)

# World records men / women (number)
df_men = df[df["gender"] == "Male"]
df_women = df[df["gender"] == "Female"]
men_wr = df_men[df_men["time"] == min(df_men["time"])]
women_wr = df_women[df_women["time"] == min(df_women["time"])]

st.metric(
    label="Men's world record",
    value=men_wr["time"].iloc[0],
    help=f'{men_wr["winner"].iloc[0]} ({men_wr["country"].iloc[0]}) - {men_wr["marathon"].iloc[0]} {men_wr["year"].iloc[0]}',
)
st.metric(
    label="Women's world record",
    value=women_wr["time"].iloc[0],
    help=f'{women_wr["winner"].iloc[0]} ({women_wr["country"].iloc[0]}) - {women_wr["marathon"].iloc[0]} {women_wr["year"].iloc[0]}',
)

# Top 5 time (bar)
# Modern years fastest marathons by average (bar)
