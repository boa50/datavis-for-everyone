from os import path
import pandas as pd


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


regions_file = get_path(
    "Data Geographies - v2 - by Gapminder - list-of-countries-etc.csv"
)
population_file = get_path(
    "GM-Population - Dataset - v7 - data-for-countries-etc-by-year.csv"
)
life_expectancy_file = get_path(
    "_GM-Life Expectancy- Dataset - v14 - data-for-countries-etc-by-year.csv"
)
gdp_file = get_path(
    "GM-GDP per capita - Dataset - v28 - data-for-countries-etc-by-year.csv"
)

df_regions = pd.read_csv(regions_file, usecols=["geo", "name", "four_regions"])
df_regions.columns = ["code", "country", "region"]

df_population = pd.read_csv(population_file, usecols=["geo", "time", "Population"])
df_population.columns = ["code", "year", "population"]

df_life_expectancy = pd.read_csv(
    life_expectancy_file, usecols=["geo", "time", "Life expectancy "]
)
df_life_expectancy.columns = ["code", "year", "life_expectancy"]

df_gdp = pd.read_csv(
    gdp_file,
    usecols=["geo", "time", "Income per person"],
)
df_gdp.columns = ["code", "year", "gdp_per_capita"]

df = pd.merge(df_regions, df_population, how="outer", on="code")
df = pd.merge(df, df_life_expectancy, how="outer", on=["code", "year"])
df = pd.merge(df, df_gdp, how="outer", on=["code", "year"])
df.drop("code", axis=1, inplace=True)

assert (
    df_population.shape[0] == df.shape[0]
), f"Actual size ({df.shape[0]}) different from initial size ({df_population.shape[0]})"

print((df.isna() == True).sum())

df.to_csv(get_path("dataset.csv"), index=False)
