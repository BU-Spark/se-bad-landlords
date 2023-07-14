import requests
import re
from sqlalchemy import create_engine, MetaData, Table, Column, Text, Integer, exc


# there are some underscore for some dataset
def remove_underscore_and_spaces(value):
    if isinstance(value, str):
        value = value.strip()
        value = re.sub(' +', ' ', value)
        if value.endswith('_'):
            return value[:-1]
    return value

# Each dataset has 144163 lines. Each takes about 5 minutes to run.
# 2004~2023 will have around 2739097 records.
# Running the whole script can take you 90 minutes.
def json_to_table(api, table_name, year, columns_dict):
    engine = create_engine("postgresql://postgres:postgres@localhost:5432/badlandlords")
    metadata = MetaData()

    response = requests.get(api)
    data = response.json()

    types = {
        'text': Text,
        'int': Integer,
    }

    # drop table
    # this should be commented out when creating a new dataset for anything after 2023
    try:
        table = Table(table_name, metadata, autoload_with=engine)
        table.drop(engine)
    except exc.NoSuchTableError:
        pass
    metadata.clear()

    # create the table
    table = Table(
        table_name, 
        metadata, 
        Column('year', Text),
        *[Column(name, types['text']) for name in columns_dict.keys()]
    )

    metadata.create_all(engine)

    conn = engine.connect()
    trans = conn.begin()
    try:
        # this will only print first 100 recods of each api routes
        for record in data['result']['records']:
            record_custom = {key: remove_underscore_and_spaces(record[value]) for key, value in columns_dict.items()}
            record_custom['year'] = year
            # print(record_custom)
            ins = table.insert().values(**record_custom)
            conn.execute(ins)
        
        # use this to get every dataset. This takes very long to run (60+ min)
        # while True:
        #     for record in data['result']['records']:
        #         record_custom = {key: remove_underscore_and_spaces(record[value]) for key, value in columns_dict.items()}
        #         record_custom['year'] = year
        #         print(record_custom)
        #         ins = table.insert().values(**record_custom)
        #         conn.execute(ins)
        #     # this will look for next page link but break if current page has empty records
        #     if '_links' in data['result'] and 'next' in data['result']['_links'] and data['result']['records']:
        #         response = requests.get('https://data.boston.gov' + data['result']['_links']['next'])
        #         data = response.json()
        #     else:
        #         break

        trans.commit()
    except:
        trans.rollback()
        raise

def main():
    # 2014 dataset api link doesn't work this is the website issue
    api_data = [
        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=d3be93ad-7939-4425-8b3b-73b69a747fa4', 
         'year': '2004', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL_CITY_STATE', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER FY04'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=5bfe4ca0-71c0-4751-bdcf-dad4d58445e0', 
         'year': '2005', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NAME', 'ST_NAME': 'ST_NAME_SFX', 'UNIT_NUM': 'ZIPCODE', 'CITY': 'MAIL_CITY_STATE', 'ZIP_CODE': 'PTYPE', 'OWNER': 'ST_NUM'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=327af2fd-e386-4822-8a7f-aaab6d4d2c62', 
         'year': '2006', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL_CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=b3862082-216b-4a24-9f31-f47782079c3c', 
         'year': '2007', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM_CHAR', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL_CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER FY07'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=81f34da8-ec6d-45f6-8d6c-65c57e71023e', 
         'year': '2008', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=1a374bd0-1ff9-4d1a-8727-ddfc201254fe', 
         'year': '2009', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=738ece37-5ae0-4f04-bf69-eca3ae1940b2', 
         'year': '2010', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=110e8ded-d7cd-40d2-a72c-e4f3c7e9c541', 
         'year': '2011', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=4326ca95-09ec-42e0-8cee-f048e00e6728', 
         'year': '2012', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=425fd527-e26b-49c9-853c-1c4d3d2bdd97', 
         'year': '2013', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=7190b0a4-30c4-44c5-911d-c34f60b22181', 
         'year': '2014', 
         'columns_dict': {'PID': 'Parcel_ID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'Owner_MAIL_CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=bdb17c2b-e9ab-44e4-a070-bf804a0e1a7f', 
         'year': '2015', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'OWNER_MAIL_CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=cecdf003-9348-4ddb-94e1-673b63940bb8', 
         'year': '2016', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},
        
        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=062fc6fa-b5ff-4270-86cf-202225e40858', 
         'year': '2017', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=fd351943-c2c6-4630-992d-3f895360febd', 
         'year': '2018', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL CS', 'ZIP_CODE': 'MAIL_ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=695a8596-5458-442b-a017-7cd72471aade', 
         'year': '2019', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=8de4e3a0-c1d2-47cb-8202-98b9cbe3bd04', 
         'year': '2020', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'MAIL CS', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=c4b7331e-e213-45a5-adda-052e4dd31d41', 
         'year': '2021', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'CITY', 'ZIP_CODE': 'ZIPCODE', 'OWNER': 'OWNER'}},

        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=4b99718b-d064-471b-9b24-517ae5effecc', 
         'year': '2022', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'CITY', 'ZIP_CODE': 'MAIL_ZIPCODE', 'OWNER': 'OWNER'}},
        
        {'api': 'https://data.boston.gov/api/3/action/datastore_search?resource_id=1000d81c-5bb5-49e8-a9ab-44cd042f1db2', 
         'year': '2023', 
         'columns_dict': {'PID': 'PID', 'ST_NUM': 'ST_NUM', 'ST_NAME': 'ST_NAME', 'UNIT_NUM': 'UNIT_NUM', 'CITY': 'CITY', 'ZIP_CODE': 'ZIP_CODE', 'OWNER': 'OWNER'}},
    ]
    table_name = 'property'

    for data in api_data:
        json_to_table(data['api'], table_name, data['year'], data['columns_dict'])

if __name__ == "__main__":
    main()