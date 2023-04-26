import json
import pandas as pd

# Load the geojson data
with open(r'Bad-Landlords\data\updated_data.csv.geojson', 'r') as json_file:
    data = json.load(json_file)


# Create lists to store owner1 names, violations, and additional fields
owner1_names = []
violations = []
codes = []
case_nos = []
loc_ids = []

# Extract data from the geojson features
for feature in data['features']:
    owner1_name = feature['properties']['OWNER1']
    violation = feature['properties']['description']
    code = feature['properties']['code']
    case_no = feature['properties']['case_no']
    loc_id = feature['properties']['LOC_ID']

    owner1_names.append(owner1_name)
    violations.append(violation)
    codes.append(code)
    case_nos.append(case_no)
    loc_ids.append(loc_id)

# Create a DataFrame from the lists
df = pd.DataFrame({'owner1_name': owner1_names, 'violation': violations,
                   'code': codes,
                   'case_no': case_no, 'loc_id': loc_ids})

# Group the DataFrame by owner1 names and concatenate the violations, codes, status_nos, case_nos, and loc_ids for each owner1 name
df_grouped = df.groupby('owner1_name').agg(
    {'violation': '; '.join, 'code': ', '.join,
     'case_no': ', '.join, 'loc_id': ', '.join}).reset_index()

# Print the resulting DataFrame
print(df_grouped)

df_grouped_json = df_grouped.to_json(orient='records')

with open('df_grouped_json.json', 'w') as json_file:
    json_file.write(df_grouped_json)
