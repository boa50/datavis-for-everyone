### Delete the first column and row of the original file before executing this script
from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


def get_month_number(month):
    month_to_num_dict = {
        "jan": "01",
        "fev": "02",
        "mar": "03",
        "abr": "04",
        "mai": "05",
        "jun": "06",
        "jul": "07",
        "ago": "08",
        "set": "09",
        "out": "10",
        "nov": "11",
        "dez": "12",
    }

    return month_to_num_dict[month]


df = pd.read_csv(get_path("unemployment_raw.csv"))

df = df.transpose().reset_index()

df.columns = ["dt_txt", "unemploymentRate"]

df["year"] = df["dt_txt"].str.split(expand=True).iloc[:, 1]

df["month"] = (
    df["dt_txt"]
    .str.split("-", expand=True)
    .iloc[:, 2]
    .str.split(expand=True)
    .iloc[:, 0]
)

df["month_num"] = df["month"].apply(get_month_number)

df["isoDate"] = df["year"] + "-" + df["month_num"] + "-01"

df = df[["isoDate", "unemploymentRate"]]

print("Number of NaN")
print(df.isna().sum())

df.to_csv(get_path("unemployment.csv"), index=False)
