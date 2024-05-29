from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(get_path("poverty-explorer.csv"))

df = df[(df["Country"] == "World") & (df["Year"] == 2022)]

df = df[["Share below $2.15 a day", "Number below $2.15 a day"]].reset_index(drop=True)

df.columns = ["shareBelow", "numberBelow"]

print(df.head())

df.to_csv(get_path("dataset.csv"), index=False)
