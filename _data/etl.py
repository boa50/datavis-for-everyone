from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


### gov-spending
df = pd.read_csv(get_path("historical-gov-spending-gdp.csv"))

df = df.drop("Code", axis=1)

df.columns = [["entity", "year", "govSpending"]]

print(df.head())
print(df.isna().sum())

df.to_csv(get_path("gov-spending.csv"), index=False)
