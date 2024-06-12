from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


### Average Surface Temperatures
try:
    df = pd.read_csv(
        get_path("monthly-average-surface-temperatures-by-year.csv"),
        usecols=["Entity", "Year", "2023", "2022", "2021", "2020", "2019"],
    )

    df = df[df["Entity"] == "World"]

    df = df.drop("Entity", axis=1).reset_index(drop=True)

    df = pd.melt(df, id_vars="Year")

    df.columns = ["month", "year", "temperature"]

    print("Average Surface Temperatures")
    print(df.head())

    df.to_csv(get_path("average-surface-temperature.csv"), index=False)
except:
    print("Couldn't process Average Surface Temperatures")


### Renewable Energy Generation
try:
    df = pd.read_csv(get_path("modern-renewable-prod.csv"))

    df = df[(df["Entity"] == "World") & (df["Year"] >= 2000)]

    df = df.drop(["Entity", "Code"], axis=1).reset_index(drop=True)

    df.columns = ["year", "wind", "hydropower", "solar", "other"]

    df = pd.melt(df, id_vars="year")

    df.columns = ["year", "source", "generation"]

    df["source"] = df["source"].str.capitalize()

    print("Renewable Energy Generation")
    print(df.head())

    df.to_csv(get_path("renewables-generation.csv"), index=False)
except:
    print("Couldn't process Renewable Energy Generation")
