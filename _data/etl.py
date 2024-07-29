from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


def print_df_info(df):
    print()
    print("### NAN TOTAL ###")
    print(df.isna().sum())
    print("### HEAD ###")
    print(df.head())
    print("### SHAPE ###")
    print(df.shape)


### gov-spending
try:
    df = pd.read_csv(get_path("historical-gov-spending-gdp.csv"))

    df = df.drop("Code", axis=1)

    df.columns = ["entity", "year", "govSpending"]

    print_df_info(df)

    df.to_csv(get_path("gov-spending.csv"), index=False)
except:
    print("gov-spending source file not found")

### gdp-per-capita
try:
    df = pd.read_csv(get_path("gdp-per-capita-worldbank.csv"))

    df.columns = ["country", "code", "year", "gdpPerCapita"]

    aggregated_entities = [
        "World",
        "Europe and Central Asia (WB)",
        "European Union (27)",
        "High-income countries",
        "Latin America and Caribbean (WB)",
        "Low-income countries",
        "Lower-middle-income countries",
        "Middle East and North Africa (WB)",
        "Middle-income countries",
        "North America (WB)",
        "South Asia (WB)",
        "Sub-Saharan Africa (WB)",
        "Upper-middle-income countries",
    ]

    df = df[
        (df["year"] >= 2010)
        & (df["year"] <= 2021)
        & (~df["country"].isin(aggregated_entities))
        & (~df["code"].isna())
    ].reset_index(drop=True)

    print_df_info(df)

    df.to_csv(get_path("gdp-per-capita.csv"), index=False)
except:
    print("gdp-per-capita source file not found")


### random-geo
try:
    df = pd.read_csv(
        get_path("Covid-19 Twitter Dataset (Aug-Sep 2020).csv"),
        usecols=["place"],
        # nrows=1000,
    )

    df = df.dropna()
    df = df["place"].str.split(",", n=1, expand=True)
    df.columns = ["state_or_city", "country"]
    df["country"] = df["country"].fillna(df["state_or_city"])

    df_cities = pd.read_csv(
        get_path("cities.csv"),
        usecols=["name", "country_name", "latitude", "longitude"],
    )

    df_cities.columns = ["city", "country", "latitude", "longitude"]

    df_states = pd.read_csv(
        get_path("states.csv"),
        usecols=["name", "country_name", "latitude", "longitude"],
    )

    df_states.columns = ["state", "country", "latitude", "longitude"]

    df = df.merge(df_cities, how="left", left_on="state_or_city", right_on="city")
    df = df.merge(df_states, how="left", left_on="state_or_city", right_on="state")
    df["latitude_x"] = df["latitude_x"].fillna(df["latitude_y"])
    df["longitude_x"] = df["longitude_x"].fillna(df["longitude_y"])
    df = df[["latitude_x", "longitude_x"]]
    df.columns = ["latitude", "longitude"]
    df = df.dropna()

    print_df_info(df)

    df.to_csv(get_path("random-geo.csv"), index=False)
except:
    print("random-geo source files not found")
