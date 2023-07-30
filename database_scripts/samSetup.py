# Total execution time: 333.5433614253998 seconds
# samSetup script updates the table with existing values
# if you need the table to be deleted use the commented at line 45
import time
import requests
import csv
from bs4 import BeautifulSoup
from sqlalchemy import create_engine, MetaData, Table, Column, Text, exc
from sqlalchemy.dialects.postgresql import insert

DATASET_URL = 'https://data.boston.gov/dataset/live-street-address-management-sam-addresses'
DB = "postgresql://postgres:postgres@localhost:5432/badlandlords"
CSV_FILENAME = 'sam.csv'

# download_csv downloads the csv file locally in same directory
# we use bs4 to get the download link for the csv file from DATASET_URL
def download_csv():
    response = requests.get(DATASET_URL)
    soup = BeautifulSoup(response.text, 'html.parser')
    resource_list = soup.find('ul', class_='resource-list')
    # this is the second download button for csv file
    csv_url = resource_list.find_all('li', class_='resource-item')[1].find('div', class_='btn-group').find_all('a')[1]['href']
    
    # download the csv file in chunks because it can be large
    # we use wb to overwrite old sam.csv
    with requests.get(csv_url, stream=True) as r:
        r.raise_for_status()
        with open(CSV_FILENAME, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192): 
                f.write(chunk)

# get csv datasets to database table
def csv_to_table(csv_file, table_name):
    engine = create_engine(DB)
    metadata = MetaData()

    # specify the headers you will like to pull
    desired_headers = ['SAM_ADDRESS_ID', 'FULL_ADDRESS', 'MAILING_NEIGHBORHOOD', 'ZIP_CODE', 'PARCEL']

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
            # this part cherry picks header name, also sets primary_key
            *[Column(header, Text, primary_key=(header == 'SAM_ADDRESS_ID')) for header in headers if header in desired_headers]
        )

        metadata.create_all(engine)

        conn = engine.connect()
        trans = conn.begin()

        try:
            for row in reader:
                data = {header: val for header, val in zip(headers, row) if header in desired_headers} # this part cherry picks values with header name
                ins = insert(table).values(data).on_conflict_do_update(
                    index_elements=['SAM_ADDRESS_ID'],
                    set_=data
                )
                conn.execute(ins)
            # you can use below for testing first 100 rows
            # for i, row in enumerate(reader):
            #     if i >= 100:
            #         break
            #     data = {header: val for header, val in zip(headers, row) if header in desired_headers} # this part cherry picks values with header name
            #     ins = insert(table).values(data).on_conflict_do_update(
            #         index_elements=['SAM_ADDRESS_ID'],
            #         set_=data
            #     )
            #     conn.execute(ins)
            # trans.commit()
        except:
            trans.rollback()
            raise

def main():
    start_time = time.time()

    download_csv()
    table_name = 'sam'
    csv_to_table(CSV_FILENAME, table_name)

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f'Total execution time: {elapsed_time} seconds') # it took me about 5 minutes 30 seconds

if __name__ == "__main__":
    main()
