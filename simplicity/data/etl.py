from os import path
import pandas as pd
import numpy as np


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(get_path("gdp-per-capita-worldbank.csv"))

df = df.drop("Code", axis=1)

df.columns = ["entity", "year", "gdpPerCapita"]

df = df[(df["year"] >= 2000) & (df["entity"] != "World")]

aggregated_entities = [
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

df["group"] = np.where(df["entity"].isin(aggregated_entities), "aggregated", "country")

print(df.isna().sum())
print(df.head())

df.to_csv(get_path("gdp-per-capita.csv"), index=False)
