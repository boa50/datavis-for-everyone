from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(
    get_path("number-of-deaths-from-natural-disasters.csv"),
    usecols=[
        "Entity",
        "Year",
        "Total deaths - Drought",
        "Total deaths - Flood",
        "Total deaths - Earthquake",
        "Total deaths - Extreme weather",
        "Total deaths - Extreme temperature",
    ],
)

df = df[df["Entity"] == "World"]
df = df.drop("Entity", axis=1)
df = df.sort_values(by="Year")
df = df.reset_index(drop=True)
df = df.fillna(0)
df = df.astype("int64")

df.columns = [
    "year",
    "drought",
    "flood",
    "earthquake",
    "weather",
    "temperature",
]

print(df)

df.to_csv(get_path("disasters-deaths.csv"), index=False)
