from os import path
import pandas as pd


# Get file complete path
def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(
    get_path("life-expectation-at-birth-by-sex.csv"),
    names=["country", "code", "year", "female", "male"],
    skiprows=1,
)

df = df[(df["year"] >= 1960) & (df["code"].notnull())]

df = df[["year", "country", "female", "male"]]

print(df.head())
print(df.isnull().sum())


df.to_csv(get_path("life-expectancy.csv"), index=False)
