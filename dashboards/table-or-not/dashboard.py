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
df["time_plot"] = pd.to_datetime(df["time"], format="%H:%M:%S", utc=True)
df["time_seconds"] = pd.to_timedelta(df["time"]).dt.total_seconds()

chart_height_default = 270

st.markdown(
    """
    <style>
        .appview-container .main .block-container {
            padding-top: 2.6rem;
        }
        # [data-testid="stVerticalBlock"] {
        #     gap: 0rem;
        # }
    </style>
    """,
    unsafe_allow_html=True,
)


metrics_container = st.container()
metrics_col1, metrics_col2, metrics_col3, metrics_col4 = metrics_container.columns(4)

# N marathons held (number)
df_n_marathons = df.groupby(by=["year", "marathon"]).count()

metrics_col1.metric(label="Marathons held", value=df_n_marathons.shape[0])
metrics_col2.metric(
    label="Marathons held (both genders)",
    value=df_n_marathons[df_n_marathons["gender"] > 1].shape[0],
)

# World records men / women (number)
df_men = df[df["gender"] == "Male"]
df_women = df[df["gender"] == "Female"]
men_wr = df_men[df_men["time"] == min(df_men["time"])]
women_wr = df_women[df_women["time"] == min(df_women["time"])]

metrics_col3.metric(
    label="Men's world record",
    value=men_wr["time"].iloc[0],
    help=f'{men_wr["winner"].iloc[0]} ({men_wr["country"].iloc[0]}) - {men_wr["marathon"].iloc[0]} {men_wr["year"].iloc[0]}',
)
metrics_col4.metric(
    label="Women's world record",
    value=women_wr["time"].iloc[0],
    help=f'{women_wr["winner"].iloc[0]} ({women_wr["country"].iloc[0]}) - {women_wr["marathon"].iloc[0]} {women_wr["year"].iloc[0]}',
)


charts_container = st.container()
charts_row1 = charts_container.container()
charts_row1_col1, charts_row1_col2 = charts_row1.columns([0.6, 0.4], gap="medium")

# Marathons finishing time by year
scatterplot = (
    alt.Chart(
        df,
        height=chart_height_default,
        padding={"left": 8, "top": 2, "right": 16, "bottom": 16},
        title="Marathons finishing time by year",
    )
    .mark_circle(size=60)
    .encode(
        x=alt.X(
            "year",
            title="Year",
            scale=alt.Scale(domain=[min(df["year"]) - 5, max(df["year"]) + 5]),
        ),
        y=alt.Y(
            "utchoursminutesseconds(time_plot):T",
            title="Finishing time",
        ),
        color=alt.Color("gender", legend=None),
        tooltip=["year", "marathon", "gender", "winner", "country", "time"],
    )
)

charts_row1_col1.altair_chart(scatterplot, use_container_width=True)


# Modern years fastest marathons by average (bar)
df_modern_years = df[df["year"] >= 2000][["marathon", "year", "time"]]
df_modern_years["time"] = pd.to_timedelta(df_modern_years["time"])
df_modern_years = df_modern_years.groupby(by="marathon").mean().reset_index()
df_modern_years["time"] = df_modern_years["time"] + pd.to_datetime("1970/01/01")

race_modern_years = px.bar(
    df_modern_years,
    x="marathon",
    y="time",
    height=chart_height_default,
    title="Fastest marathons",
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
)

race_modern_years.update_layout(margin=dict(l=8, r=8, t=20, b=8))

charts_row1_col2.plotly_chart(race_modern_years, use_container_width=True)


charts_row2 = charts_container.container()
charts_row2_col1, charts_row2_col2, charts_row2_col3 = charts_row1.columns(
    [0.4, 0.3, 0.3], gap="medium"
)

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

winners_map = px.scatter_geo(
    df_winners,
    locations="iso_alpha",
    hover_name="country",
    color="continent",
    size="winner",
    size_max=50,
    projection="natural earth",
    height=chart_height_default,
    title="Winners by country",
    color_discrete_sequence=px.colors.qualitative.G10,
    hover_data={"iso_alpha": False, "continent": False},
)
winners_map.update_layout(
    margin=dict(l=8, r=8, t=20, b=8),
    legend=dict(
        orientation="h", yanchor="top", y=1.02, xanchor="left", x=0.15, title_text=""
    ),
)

charts_row2_col1.plotly_chart(winners_map, use_container_width=True)

# Top 5 time (bar)
df_top_five_men = df_men.sort_values(by="time")[:5]
top_five_men = px.bar(
    df_top_five_men,
    x="time_seconds",
    y="winner",
    hover_data={
        "time_seconds": False,
        "year": True,
        "marathon": True,
        "time": True,
    },
    height=chart_height_default,
    title="Fastest men",
)
top_five_men.update_xaxes(
    range=[
        min(df_top_five_men["time_seconds"]) * 0.999,
        max(df_top_five_men["time_seconds"]) * 1.001,
    ]
)
top_five_men.update_layout(
    yaxis={"categoryorder": "total descending"},
    yaxis_title="Runner",
    xaxis_title="Seconds to finish",
    margin=dict(l=8, r=8, t=20, b=8),
)

charts_row2_col2.plotly_chart(top_five_men, use_container_width=True)

df_top_five_women = (
    df_women.groupby(by="winner").min().reset_index().sort_values(by="time")[:5]
)
top_five_women = px.bar(
    df_top_five_women,
    x="time_seconds",
    y="winner",
    hover_data={
        "time_seconds": False,
        "year": True,
        "marathon": True,
        "time": True,
    },
    height=chart_height_default,
    title="Fastest women",
)
top_five_women.update_xaxes(
    range=[
        min(df_top_five_women["time_seconds"]) * 0.995,
        max(df_top_five_women["time_seconds"]) * 1.001,
    ]
)
top_five_women.update_layout(
    yaxis={"categoryorder": "total descending"},
    yaxis_title="Runner",
    xaxis_title="Seconds to finish",
    margin=dict(l=8, r=8, t=20, b=8),
)

charts_row2_col3.plotly_chart(top_five_women, use_container_width=True)


st.dataframe(df)
