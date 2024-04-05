import pandas as pd


def plot(df: pd.DataFrame, container: any, screen_width: int):
    n_cols = int(screen_width / 270)

    if n_cols == 7:
        logo, _, _, metrics_col1, metrics_col2, metrics_col3, metrics_col4 = (
            container.columns(7)
        )
    else:
        logo, metrics_col1, metrics_col2, metrics_col3, metrics_col4 = (
            container.columns(5)
        )

    logo.image("dashboards/table-or-not/img/logo.svg", width=int(screen_width / 11))

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
