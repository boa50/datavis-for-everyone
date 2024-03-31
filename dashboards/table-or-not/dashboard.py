import sys

sys.path.append("dashboards")

from custom_utils import get_dataset_path
import pandas as pd
import streamlit as st
import altair as alt

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
