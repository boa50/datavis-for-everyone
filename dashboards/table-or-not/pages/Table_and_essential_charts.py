import pandas as pd
import streamlit as st
from streamlit_js_eval import streamlit_js_eval
from streamlit_theme import st_theme
import sys

sys.path.append("dashboards")

from custom_utils import get_dataset_path, check_not_none
from colours import colours
import metrics
import marathonsTimeByYear
import winnersByCountry

st.set_page_config(
    page_title="Table and essential charts",
    page_icon="👟",
    layout="wide",
)

df = pd.read_csv(get_dataset_path("world_marathon_majors.csv"), encoding="latin-1")
df["time_plot"] = pd.to_datetime(df["time"], format="%H:%M:%S", utc=True)
df["time_seconds"] = pd.to_timedelta(df["time"]).dt.total_seconds()

page_theme = st_theme()

st.markdown(
    f"""
    <style>
        .appview-container .main .block-container {{
            padding: 3rem 5rem;
        }}
        .chart-wrapper > canvas {{
            border-radius: 5px;
        }}
        .stPlotlyChart > div > div > svg {{
            border-radius: 5px;
        }}
        [data-testid="stMetric"] {{
            border: 1px solid {check_not_none(page_theme, "white", "fadedText20")};
            background-color: {check_not_none(page_theme, "white", "secondaryBackgroundColor")};
            border-radius: 5px;
            padding: 16px;
            margin: 0;
        }}
        .main > div > div > div > div > [data-testid="element-container"] {{
            display: none;
        }}
        .main > div > div > div > div > [data-testid="stVerticalBlockBorderWrapper"]:first-child {{
            display: none;
        }}
        [data-testid="stImage"] > img {{
            margin: 1.5rem 0;
        }}
    </style>
    """,
    unsafe_allow_html=True,
)

st.session_state["viewport_height"] = streamlit_js_eval(
    js_expressions="screen.height", key="ViewportHeight"
)
st.session_state["viewport_width"] = streamlit_js_eval(
    js_expressions="screen.width", key="ViewportWidth"
)
chart_height_default = check_not_none(st.session_state["viewport_height"]) / 2.9


metrics_container = st.container()
metrics.plot(df, metrics_container, check_not_none(st.session_state["viewport_width"]))


charts_container = st.container()
charts_col1, charts_col2 = charts_container.columns([0.6, 0.4], gap="medium")

charts_col1.altair_chart(
    marathonsTimeByYear.plot(
        df,
        chart_height_default,
        check_not_none(page_theme, "white", "secondaryBackgroundColor"),
    ),
    use_container_width=True,
)

charts_col1.plotly_chart(
    winnersByCountry.plot(
        df,
        chart_height_default,
        check_not_none(page_theme, "white", "fadedText60"),
        check_not_none(page_theme, "white", "secondaryBackgroundColor"),
    ),
    use_container_width=True,
)


charts_col2.markdown(
    f"<div style='margin: 0.5rem 0; font-weight: 700; color: {colours['chart_title']}'>Detailed data</div>",
    unsafe_allow_html=True,
)

charts_col2.dataframe(
    df[["year", "marathon", "winner", "country", "gender", "time"]]
    .sort_values(by=["year", "marathon"], ascending=False)
    .style.set_properties(
        **{
            "background-color": check_not_none(
                page_theme, "white", "secondaryBackgroundColor"
            )
        }
    ),
    column_config=dict(
        year="Year",
        marathon="Marathon",
        winner="winner",
        country="Country",
        gender="Gender",
        time="Time",
    ),
    height=int(chart_height_default * 2 - 17 if chart_height_default > 0 else 0),
    hide_index=True,
    use_container_width=True,
)
