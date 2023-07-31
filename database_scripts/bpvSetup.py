# Total elapsed time: 36.67883014678955 seconds
# bpvSetup script updates the existing table
# if you need the table to be deleted use the commented at line 33
import time
import requests
from sqlalchemy import create_engine, MetaData, Table, Column, Text, Integer, exc
from sqlalchemy.dialects.postgresql import insert

# constants
API_URL = 'https://data.boston.gov/api/3/action/datastore_search?resource_id=800a2663-1d6a-46e7-9356-bedb70f5332c'
BASE_API_URL = 'https://data.boston.gov'
DB = "postgresql://postgres:postgres@localhost:5432/badlandlords"

def json_to_table(api, table_name):
    engine = create_engine(DB)
    metadata = MetaData()

    # fetch data from api link
    response = requests.get(api)
    data = response.json()

    headers = data['result']['fields']

    types = {
        'text': Text,
        'int': Integer,
    }

    # specify the headers you will like to pull
    desired_headers = ['case_no', "status_dttm", "status", "code", "description", "sam_id", "latitude", "longitude"]

    # use this if you want to drop the table and create a fresh one
    # try:
    #     table = Table(table_name, metadata, autoload_with=engine)
    #     table.drop(engine)
    # except exc.NoSuchTableError:
    #     pass
    # metadata.clear()

    # create the table
    table = Table(
        table_name, 
        metadata,
        *[Column(header['id'], types[header['type']], primary_key=(header['id'] == 'case_no')) for header in headers if header['id'] in desired_headers]
    )

    metadata.create_all(engine)


    conn = engine.connect()
    trans = conn.begin()
    try:
        while True:
            for record in data['result']['records']:
                # test case to see record data
                # print(record)
                record = {header: val for header, val in record.items() if header in desired_headers}
                ins = insert(table).values(record).on_conflict_do_update(
                    index_elements=['case_no'],
                    set_=record
                )
                conn.execute(ins)
            # this will look for next page link but break if current page has empty records
            # comment this out and the while loop to test first 100 values
            if '_links' in data['result'] and 'next' in data['result']['_links'] and data['result']['records']:
                response = requests.get(BASE_API_URL + data['result']['_links']['next'])
                data = response.json()
            else:
                break
        trans.commit()
    except:
        trans.rollback()
        raise

def main():
    start_time = time.time()

    table_name = 'bpv'
    json_to_table(API_URL, table_name)

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f'Total elapsed time: {elapsed_time} seconds')

if __name__ == "__main__":
    main()
