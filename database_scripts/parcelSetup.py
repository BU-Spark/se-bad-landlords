# Total executed time: 82.87679433822632 seconds
# parcelSetup script updates the existing table
# if you need the table to be deleted use the commented at line 44
import time
import requests
import csv
from bs4 import BeautifulSoup
from sqlalchemy import create_engine, MetaData, Table, Column, Text, exc
from sqlalchemy.dialects.postgresql import insert

DATASET_URL = 'https://data.boston.gov/dataset/parcels-2023'
DB = "postgresql://postgres:postgres@localhost:5432/badlandlords"
CSV_FILENAME = 'parcel.csv'

# download_csv downloads the csv file locally in same directory
# we use bs4 to get the download link for the csv file from DATASET_URL
def download_csv():
    response = requests.get(DATASET_URL)
    soup = BeautifulSoup(response.text, 'html.parser')
    resource_list = soup.find('ul', class_='resource-list')
    # this is the second download button for csv file
    csv_url = resource_list.find_all('li', class_='resource-item')[1].find('div', class_='btn-group').find_all('a')[1]['href']

    # download the csv file in chunks because it can be large
    # it used wb to overwrite old parcel.csv
    with requests.get(csv_url, stream=True) as r:
        r.raise_for_status()
        with open(CSV_FILENAME, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192): 
                f.write(chunk)

def csv_to_table(csv_file, table_name):
    engine = create_engine(DB)
    metadata = MetaData()

    # specify the headers you will like to pull
    desired_headers = ['MAP_PAR_ID', "Shape_STArea__", "Shape_STLength__", "Shape_Length", "Shape_Area"]

    with open(csv_file, newline='') as f:
        reader = csv.reader(f)
        headers = next(reader)

        # use this if you want to drop the table and create a fresh one
        # try:
        #     table = Table(table_name, metadata, autoload_with=engine)
        #     table.drop(engine)
        # except exc.NoSuchTableError:
        #     pass
        # metadata.clear()

        table = Table(
            table_name,
            metadata,
            *[Column(header, Text, primary_key=(header == 'MAP_PAR_ID')) for header in headers if header in desired_headers]
        )

        metadata.create_all(engine)

        conn = engine.connect()
        trans = conn.begin()

        try:
            for row in reader:
                data = {header: val for header, val in zip(headers, row) if header in desired_headers} # this part cherry picks values with header name
                ins = insert(table).values(data).on_conflict_do_update(
                    index_elements=['MAP_PAR_ID'],
                    set_=data
                )
                conn.execute(ins)
            # you can use below for testing first 100 rows
            # for i, row in enumerate(reader):
            #     if i >= 100:
            #         break
            #     data = {header: val for header, val in zip(headers, row) if header in desired_headers} # this part cherry picks values with header name
            #     ins = insert(table).values(data).on_conflict_do_update(
            #         index_elements=['MAP_PAR_ID'],
            #         set_=data
            #     )
            #     conn.execute(ins)
            trans.commit()
        except:
            trans.rollback()
            raise

def main():
    start_time = time.time()

    download_csv()
    table_name = 'parcel'
    csv_to_table(CSV_FILENAME, table_name)

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f'Total executed time: {elapsed_time} seconds')

if __name__ == "__main__":
    main()