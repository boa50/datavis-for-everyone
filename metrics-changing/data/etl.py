from os import path
import pandas as pd
import numpy as np


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(get_path("homicide-rate-unodc.csv"))

df.columns = ["country", "code", "year", "homicideRate"]

# df = df.drop("code", axis=1)

countries_to_exclude = [
    "World",
    "Africa (UN)",
    "Americas (UN)",
    "Asia (UN)",
    "Europe (UN)",
    "Oceania (UN)",
    "Melanesia (UN)",
    "Micronesia (UN)",
    "Polynesia (UN)",
]

df = df[~df["country"].isin(countries_to_exclude)]

df_max_year = df.groupby("country").max()["year"].reset_index()

df = pd.merge(df, df_max_year, how="inner", on=["country", "year"])

df_population = pd.read_csv(get_path("population-and-demography.csv"))

df_population.columns = ["country", "code", "year", "population"]

df = pd.merge(df, df_population, how="left", on=["code", "year"])

df["homicideNumber"] = np.ceil(df["population"] / 1e5 * df["homicideRate"]).astype(int)
df["homicideRate"] = np.round(df["homicideRate"], 2)

df = df.drop(["code", "year", "country_y", "population"], axis=1)

df = df.rename(columns={"country_x": "country"})

print(df.shape)
print(df.isna().sum())
print(df.head())

df.to_csv(get_path("dataset.csv"), index=False)
