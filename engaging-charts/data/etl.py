from os import path
import pandas as pd


# Get file complete path
def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


### Life expectancy data
df = pd.read_csv(
    get_path("life-expectation-at-birth-by-sex.csv"),
    names=["country", "code", "year", "female", "male"],
    skiprows=1,
)

df = df[(df["year"] >= 1960) & (df["code"].notnull()) & (df["country"] != "World")]

df = df[["year", "country", "female", "male"]]

print(df.head())
print(df.isnull().sum())

df.to_csv(get_path("life-expectancy.csv"), index=False)


### Greenhouse gases data
df = pd.read_csv(
    get_path("ghg-emissions-by-sector.csv"),
    names=[
        "country",
        "code",
        "year",
        "agriculture",
        "landUseChange",
        "waste",
        "buildings",
        "industry",
        "manufacturingAndConstruction",
        "transport",
        "electricityAndHeat",
        "energyProduction",
        "otherFuelCombustion",
        "bunkerFuels",
    ],
    skiprows=1,
)

df = df[(df["year"] >= 2000) & (df["country"] == "World")]

df = df[
    [
        "year",
        "agriculture",
        "buildings",
        "industry",
        "manufacturingAndConstruction",
        "transport",
        "electricityAndHeat",
    ]
]

print(df.head())
print(df.isnull().sum())

df.to_csv(get_path("greenhouse-emissions.csv"), index=False)


### Greenhouse gases food data
df = pd.read_csv(
    get_path("ghg-per-kg-poore.csv"),
    names=["food", "code", "year", "emissionsPerKg"],
    skiprows=1,
)

df = df[["food", "emissionsPerKg"]]

df = df[(df["food"] != "Beef (dairy herd)") & (~df["food"].str.startswith("Other"))]

df["food"] = df["food"].str.replace(" \(([^\)]+)\)", "", regex=True)
df["food"] = df["food"].str.replace(" Meat", "")
df["food"] = df["food"].str.replace("Dark Chocolate", "Chocolate")

print(df)
print(df.isnull().sum())

df.to_csv(get_path("greenhouse-emissions-food.csv"), index=False)
