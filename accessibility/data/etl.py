from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(
    get_path("monthly-average-surface-temperatures-by-year.csv"),
    usecols=["Entity", "Year", "2023", "2022", "2021", "2020", "2019"],
)

df = df[df["Entity"] == "World"]

df = df.drop("Entity", axis=1).reset_index(drop=True)

df = pd.melt(df, id_vars="Year")

df.columns = ["month", "year", "temperature"]

print(df.head())

df.to_csv(get_path("average-surface-temperature.csv"), index=False)
