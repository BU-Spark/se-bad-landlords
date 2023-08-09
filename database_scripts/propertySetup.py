# Initialization time for 1 API: 782.8682072162628 seconds
# Update time for 1 API: 616.1077988147736 seconds
# Each dataset has about 144163 lines. Each takes about 10 minutes to run.
# 2004~2023 will have around 2739097 records.
# Running the whole script initially with all the api links can take you over 3 hours.
# if you need the table to be deleted use the commented out code at line 120
import time
import json
import requests
import re
import hashlib
from sqlalchemy import create_engine, MetaData, Table, Column, Text, Integer, exc, PrimaryKeyConstraint, text
from sqlalchemy.dialects.postgresql import insert

BASE_API_URL = 'https://data.boston.gov'
DB = "postgresql://postgres:postgres@localhost:5432/badlandlords"

# there are some underscore for some dataset
def remove_underscore_and_spaces(value):
    if isinstance(value, str):
        value = value.strip()
        value = re.sub(' +', ' ', value)
        if value.endswith('_'):
            return value[:-1]
    return value

# encodes row_data to hash values
def compute_hash(row_data):
    return hashlib.md5(str(row_data).encode()).hexdigest()

def json_to_table(api, table_name, year, columns_dict):
    engine = create_engine(DB)
    metadata = MetaData()

    response = requests.get(api)
    data = response.json()

    types = {
        'text': Text,
        'int': Integer,
    }

    # create the table
    table = Table(
        table_name, 
        metadata, 
        Column('year', Text),
        *[Column(name, types['text']) for name in columns_dict.keys()],
        PrimaryKeyConstraint('PID', 'year', name='pk_pid_year') # set primary key to PID and year
    )

    metadata.create_all(engine)

    conn = engine.connect()
    trans = conn.begin()
    try:        
        while True:
            for record in data['result']['records']:
                record = {key: remove_underscore_and_spaces(record[value]) for key, value in columns_dict.items()}
                record_custom = {'year': year}
                record_custom.update(record)

                # search for the existing row
                query = text(f'SELECT * FROM {table_name} WHERE "PID" = :PID AND "year" = :year')
                params = {"PID": record_custom["PID"], "year": record_custom["year"]}
                existing_row = conn.execute(query, params).fetchone()

                # encode the values new data and exisitng_row to hash
                new_data_hash = compute_hash(tuple(record_custom.values()))
                existing_row_hash = compute_hash(existing_row)

                # if has value is different, then update
                if existing_row_hash != new_data_hash:
                    ins = insert(table).values(record_custom).on_conflict_do_update(
                        index_elements=['PID', 'year'],
                        set_={key: record_custom[key] for key in record_custom.keys() if key != 'year'}
                    )
                    conn.execute(ins)
            trans.commit() # uploads each page data before next page
            trans = conn.begin()
            
            # this will look for next page link but break if current page has empty records
            # comment this out and add a break line above to only get first 100 values from api
            if '_links' in data['result'] and 'next' in data['result']['_links'] and data['result']['records']:
                response = requests.get(BASE_API_URL + data['result']['_links']['next'], timeout=10) # this needs some timeout as it gives error sometimes
                data = response.json()
            else:
                break
    except:
        trans.rollback()
        raise

def main():
    while True:
        print("Select an option:")
        print("1: Initialize (update all years)")
        print("2: Specify year(s) to update")
        choice = input("Enter your choice (1 or 2): ")

        if choice == '1':
            selected_years = {str(year) for year in range(2004, 2024)} # change this range when there is a new api link
            print("You have chosen to initialize and update all years.")
            break
        elif choice == '2':
            selected_years = set(input("Enter the years you want to update (separated by space): ").split())
            print(f"You have chosen to update the following years: {', '.join(selected_years)}.")
            break
        else:
            print("Invalid choice. Exiting.")
            continue

    confirmation = input("Are you sure you want to make these changes? (Y/N): ")
    if confirmation.lower() != 'y':
        print("Changes not confirmed.")
        return

    start_time = time.time()

    table_name = 'property'

    # use this if you want to drop the table and create a fresh one
    # engine = create_engine(DB)
    # metadata = MetaData()
    # try:
    #     table = Table(table_name, metadata, autoload_with=engine)
    #     table.drop(engine)
    # except exc.NoSuchTableError:
    #     pass
    # metadata.clear()

    # 2014 dataset api link doesn't work this is the api link issue
    with open('propertySetup_api.json', 'r') as file:
        api_data = json.load(file) # this contains all api links, years, custom columns data

    for data in api_data:
        yr = data['year']
        if yr in selected_years:
            json_to_table(data['api'], table_name, data['year'], data['columns_dict'])
            print(f'Year {yr} completed!')

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f'Total elapsed time: {elapsed_time} seconds')

if __name__ == "__main__":
    main()
 