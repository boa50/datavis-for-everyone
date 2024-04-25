from os import path


# Get file complete path
def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


# Fill forward column values
df["COLUMN NAME"] = df.groupby("GROUP COLUMN NAME")["COLUMN NAME"].transform(
    lambda x: x.replace(to_replace=None, method="ffill")
)

# Export to csv
df.to_csv(get_path("dataset.csv"), index=False)
