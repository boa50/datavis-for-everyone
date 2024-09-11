from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(get_path("homicide-rate-unodc.csv"))

df.columns = ["country", "code", "year", "homicideRate"]

df = df.drop("code", axis=1)

countries_to_exclude = [
    "World",
    "Africa (UN)",
    "Americas (UN)",
    "Asia (UN)",
    "Europe (UN)",
    "Oceania (UN)",
]

df = df[~df["country"].isin(countries_to_exclude)]

df_max_year = df.groupby("country").max()["year"].reset_index()

df = pd.merge(df, df_max_year, how="inner", on=["country", "year"])

print(df.isna().sum())
print(df.head())

df.to_csv(get_path("dataset.csv"), index=False)
