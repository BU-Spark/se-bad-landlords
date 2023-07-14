import requests
from sqlalchemy import Inspector, create_engine, MetaData, Table, Column, Text, Integer, exc

# Script deletes the current BPV table and replace it with a new one
# Currently storing 14382 rows everytime it runs (2023-07-13)
def json_to_table(api, table_name):
    engine = create_engine("postgresql://postgres:postgres@localhost:5432/badlandlords")
    metadata = MetaData()

    # fetch data from api link
    response = requests.get(api)
    data = response.json()

    headers = data['result']['fields']

    types = {
        'text': Text,
        'int': Integer,
    }

    # drop table
    if Inspector.has_table(table_name):
        table = Table(table_name, metadata, autoload_with=engine)
        table.drop(engine)
    metadata.clear()

    # create the table
    table = Table(
        table_name, 
        metadata, 
        *[Column(header['id'], types[header['type']]) for header in headers]
    )

    metadata.create_all(engine)


    conn = engine.connect()
    trans = conn.begin()
    try:
        while True:
            for record in data['result']['records']:
                # test case to see record data
                # print(record)
                ins = table.insert().values(**record)
                conn.execute(ins)

            # this will look for next page link but break if current page has empty records
            if '_links' in data['result'] and 'next' in data['result']['_links'] and data['result']['records']:
                response = requests.get('https://data.boston.gov' + data['result']['_links']['next'])
                data = response.json()
            else:
                break
        trans.commit()
    except:
        trans.rollback()
        raise

def main():
    api = 'https://data.boston.gov/api/3/action/datastore_search?resource_id=800a2663-1d6a-46e7-9356-bedb70f5332c'
    table_name = 'bpv'
    json_to_table(api, table_name)

if __name__ == "__main__":
    main()
