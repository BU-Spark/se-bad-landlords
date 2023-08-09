# Installation Guide

First, create virtual environment.
1. `pip install virtualenv`
2. `virtualenv venv`
3. `source venv/Scripts/activate` - this can be different depending on where you install your venv

Then, install dependencies. You can either 1 or 2.
1. `pip install -r requirements.txt`
2. `pip install sqlalchemy psycopg2 requests bs4`

Change `.env.sample` to `.env`

Run `docker compose up -d` to create postgresql inside docker container.

## Dataset Setup

### Building and Property Violations
To setup Building and Property Violations dataset run `python bpvSetup.py`.
Building and Property Violations dataset gets updated daily.
Depending on client's need this script should run most often.

### Parcel
To setup Parcel dataset run `python parcelSetup.py`.
`parcelSetup.py` api version was working, but the api is blocked. So, this uses csv implementation.
Parcel dataset updates yearly. Change the dataset link inside the script to update to newest one.
At the moment it uses Parcel 2023, but you should change to different dataset link when 2024 one releases.

### Property Assessment
To setup Property Assessment dataset run `python propertySetup.py`.
Property Assessment dataset updates yearly. This script will take very long to run at first.
You should be running this once to initialize. The, you can comment out all previous api routes and table deleting process when you update a new dataset.

### Live Street Address Management(SAM) Addresses
To setup Live Street Address Management(SAM) Addresses dataset run `python samSetsup.py`.
I am not sure how often this updates, but probably updates yearly.