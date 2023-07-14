import requests
import csv
from bs4 import BeautifulSoup
from sqlalchemy import create_engine, MetaData, Table, Column, Text, exc

DATASET_URL = 'https://data.boston.gov/dataset/live-street-address-management-sam-addresses'

def download_csv():
    response = requests.get( DATASET_URL)
    soup = BeautifulSoup(response.text, 'html.parser')
    resource_list = soup.find('ul', class_='resource-list')
    csv_url = resource_list.find_all('li', class_='resource-item')[1].find('div', class_='btn-group').find_all('a')[1]['href']
    
    # download the csv file by chunk so it can be large
    # it used wb to overwrite old sam.csv
    with requests.get(csv_url, stream=True) as r:
        r.raise_for_status()
        with open('sam.csv', 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192): 
                f.write(chunk)

def csv_to_table(csv_file, table_name):
    engine = create_engine("postgresql://postgres:postgres@localhost:5432/badlandlords")
    metadata = MetaData()

    with open(csv_file, newline='') as f:
        reader = csv.reader(f)
        headers = next(reader)

        try:
            table = Table(table_name, metadata, autoload_with=engine)
            table.drop(engine)
        except exc.NoSuchTableError:
            pass
        metadata.clear()

        table = Table(
            table_name,
            metadata,
            *[Column(header, Text) for header in headers]
        )

        metadata.create_all(engine)

        conn = engine.connect()
        trans = conn.begin()

        try:
            for row in reader:
                ins = table.insert().values({headers[i]: val for i, val in enumerate(row)})
                conn.execute(ins)
            trans.commit()
        except:
            trans.rollback()
            raise

def main():
    download_csv()
    csv_file = 'sam.csv'
    table_name = 'sam'
    csv_to_table(csv_file, table_name)

if __name__ == "__main__":
    main()
