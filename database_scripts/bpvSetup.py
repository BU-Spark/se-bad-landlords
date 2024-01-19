# Local initialization time: 44.92134499549866 seconds
# Local update time: 31.074703454971313 seconds
# Railway initialization time: 44 minutes
# Railway update time: 23 minutes
# bpvSetup script updates the existing table
import time
import requests
import hashlib
from sqlalchemy import create_engine, MetaData, Table, Column, Text, Integer, exc, text, PrimaryKeyConstraint
from sqlalchemy.dialects.postgresql import insert

# constants
API_URL = 'https://data.boston.gov/api/3/action/datastore_search?resource_id=800a2663-1d6a-46e7-9356-bedb70f5332c'
BASE_API_URL = 'https://data.boston.gov'
DB = "postgresql://postgres:postgres@localhost:5432/badlandlords"

# encodes row_data to hash values
def compute_hash(row_data):
    return hashlib.md5(str(row_data).encode()).hexdigest()

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
    desired_headers = ['code', 'longitude', 'sam_id', 'status_dttm', 'latitude', 'status', 'description', 'case_no']

    # create the table
    table = Table(
        table_name, 
        metadata,
        *[Column(header, types[next(head['type'] for head in headers if head['id'] == header)]) for header in desired_headers],
        PrimaryKeyConstraint('case_no', 'code', name='pk_case_no_code') # set primary key to case_no and code
    )

    metadata.create_all(engine)


    conn = engine.connect()
    trans = conn.begin()
    try:
        while True:
            for record in data['result']['records']:
                record = {header: val for header, val in record.items() if header in desired_headers}

                # search for the existing row
                query = text(f'SELECT * FROM {table_name} WHERE "case_no" = :case_no AND "code" = :code')
                params = {"case_no": record["case_no"], "code": record["code"]}
                existing_row = conn.execute(query, params).fetchone()

                # encode the values new data and exisitng_row to hash
                new_data_hash = compute_hash(tuple(record.values()))
                existing_row_hash = compute_hash(existing_row)

                if existing_row_hash != new_data_hash:
                    ins = insert(table).values(record).on_conflict_do_update(
                        index_elements=['case_no', 'code'],
                        set_=record
                    )
                    conn.execute(ins)
            trans.commit() # uploads each page data before next page
            trans = conn.begin()

            # this will look for next page link but break if current page has empty records
            # comment this out and the while loop to test first 100 values
            if '_links' in data['result'] and 'next' in data['result']['_links'] and data['result']['records']:
                response = requests.get(BASE_API_URL + data['result']['_links']['next'])
                data = response.json()
            else:
                break
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
