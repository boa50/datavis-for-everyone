### Delete the first column and row of the original file before executing this script
from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


def get_dt_from_quarter(quarter):
    year = quarter[-4:]
    month = str(int(quarter[:1]) * 3).rjust(2, "0")

    return year + "-" + month + "-01"


df_total = pd.read_csv(get_path("tabela4093.csv"), skiprows=3, nrows=2)
df_working = pd.read_csv(get_path("tabela4093.csv"), skiprows=11, nrows=2)
df_not_working = pd.read_csv(get_path("tabela4093.csv"), skiprows=19, nrows=2)
df_out_workforce = pd.read_csv(get_path("tabela4093.csv"), skiprows=27, nrows=2)

df_total = df_total.transpose().reset_index().iloc[1:, [0, 2]]
df_working = df_working.transpose().reset_index().iloc[1:, [0, 2]]
df_not_working = df_not_working.transpose().reset_index().iloc[1:, [0, 2]]
df_out_workforce = df_out_workforce.transpose().reset_index().iloc[1:, [0, 2]]

df_total.columns = ["quarter", "total"]
df_working.columns = ["quarter", "working"]
df_not_working.columns = ["quarter", "notWorking"]
df_out_workforce.columns = ["quarter", "outOfWorkforce"]

df = (
    df_total.merge(df_working, on="quarter")
    .merge(df_not_working, on="quarter")
    .merge(df_out_workforce, on="quarter")
)

df["isoDate"] = df["quarter"].apply(get_dt_from_quarter)
df = df.iloc[:, 1:]

assert df_total.shape[0] == df.shape[0]

print("Number of NaN")
print(df.isnull().sum())

df.to_csv(get_path("unemployment.csv"), index=False)
