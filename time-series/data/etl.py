from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


df = pd.read_csv(get_path("total-government-expenditure-on-education-gdp.csv"))

df = df[
    df["Entity"].isin(["Brazil", "Finland", "Japan", "Kenya", "Canada", "New Zealand"])
    & (df["Year"] >= 2000)
    & (df["Year"] <= 2020)
].reset_index(drop=True)

df.columns = ["country", "code", "year", "expenditureShare"]

df.drop("code", axis=1, inplace=True)

print(df.head())
print(df.isna().sum())

df.to_csv(get_path("education-investing.csv"), index=False)
