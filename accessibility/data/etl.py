from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(
    get_path("monthly-average-surface-temperatures-by-year.csv"),
    usecols=["Entity", "Year", "2023", "2022", "2021", "2020", "2019"],
)

df.columns = ["country", "month", "2023", "2022", "2021", "2020", "2019"]

df = df[df["country"] == "World"]

df = df.drop("country", axis=1).reset_index(drop=True)

print(df)

df.to_csv(get_path("average-surface-temperature.csv"), index=False)
