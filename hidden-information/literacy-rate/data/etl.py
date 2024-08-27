from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(
    get_path("literate-and-illiterate-world-population.csv"),
    usecols=["Entity", "Year", "Share of population aged 15+ literate, 1820-2020"],
)

df = df[(df["Entity"] == "World") & (df["Year"] >= 1900)]

df = df.drop("Entity", axis=1)

df.columns = ["year", "literacyRate"]

print(df)

df.to_csv(get_path("dataset.csv"), index=False)
