import pandas as pd
import streamlit as st
from streamlit_js_eval import streamlit_js_eval
from streamlit_theme import st_theme
import sys
sys.path.append("dashboards")

from custom_utils import get_dataset_path
import metrics
import marathonsTimeByYear
import fastestMarathons
import winnersByCountry
import topRunners

st.set_page_config(
    page_title="Table dashboard",
    page_icon="👟",
    layout="wide",
)

df = pd.read_csv(get_dataset_path("world_marathon_majors.csv"), encoding="latin-1")
df["time_plot"] = pd.to_datetime(df["time"], format="%H:%M:%S", utc=True)
df["time_seconds"] = pd.to_timedelta(df["time"]).dt.total_seconds()

st.markdown(
    """
    <style>
        .appview-container .main .block-container {
            padding-top: 0rem;
        }
        # [data-testid="stVerticalBlock"] {
        #     gap: 0rem;
        # }
    </style>
    """,
    unsafe_allow_html=True,
)

st.session_state["viewport_height"] = streamlit_js_eval(
    js_expressions="screen.height", key="ViewportHeight"
)
chart_height_default = st.session_state['viewport_height'] / 2.8


metrics_container = st.container()
metrics.plot(df, metrics_container)


charts_container = st.container()
charts_row1 = charts_container.container()
charts_row1_col1, charts_row1_col2 = charts_row1.columns([0.6, 0.4], gap="medium")

charts_row1_col1.altair_chart(
    marathonsTimeByYear.plot(df, chart_height_default), 
    use_container_width=True
)
charts_row1_col2.plotly_chart(
    fastestMarathons.plot(df, chart_height_default), 
    use_container_width=True
)


charts_row2 = charts_container.container()
charts_row2_col1, charts_row2_col2, charts_row2_col3 = charts_row1.columns(
    [0.4, 0.3, 0.3], gap="medium"
)

charts_row2_col1.plotly_chart(
    winnersByCountry.plot(df, chart_height_default, st_theme()["fadedText60"]), 
    use_container_width=True
)

df_men = df[df["gender"] == "Male"].groupby(by="winner").min().reset_index().sort_values(by="time")
df_women = df[df["gender"] == "Female"].groupby(by="winner").min().reset_index().sort_values(by="time")

charts_row2_col2.plotly_chart(
    topRunners.plot(df_men, chart_height_default, "men"), 
    use_container_width=True
)
charts_row2_col3.plotly_chart(
    topRunners.plot(df_women, chart_height_default, "women"), 
    use_container_width=True
)

# st.dataframe(df)