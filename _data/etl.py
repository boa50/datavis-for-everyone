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
