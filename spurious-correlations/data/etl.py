from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(
    get_path("gdp-vs-happiness.csv"),
    usecols=[
        "Entity",
        "Year",
        "Cantril ladder score",
        "GDP per capita, PPP (constant 2017 international $)",
        "Continent",
    ],
)

df.columns = ["country", "year", "lifeSatisfaction", "gdpPerCapita", "continent"]

df = df[(df["year"] >= 2010) & (df["year"] <= 2021)]

df = df.sort_values(by=["country", "year"])

df["continent"] = df.groupby("country")["continent"].transform(
    lambda x: x.replace(to_replace=None, method="bfill")
)

df[["continent", "lifeSatisfaction", "gdpPerCapita"]] = df.groupby("country")[
    ["continent", "lifeSatisfaction", "gdpPerCapita"]
].transform(lambda x: x.replace(to_replace=None, method="ffill"))

df = df[~df.isna().any(axis=1)]

df = df.sort_values(by=["year", "continent", "country"]).reset_index(drop=True)

df.to_csv(get_path("gdp-vs-happiness-cleansed.csv"), index=False)
