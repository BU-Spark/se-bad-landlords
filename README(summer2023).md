# BadLandLords

## Project Description
BadLandLords aims to increase the transparency of the Boston planning, zoning, and development process for its residents. This system will allow for tracking of property violations and provide a criterion for designating a property owner as a "scofflaw property owner" based on several factors.

Councilor Breadon’s office is keen on providing constituents with insights into the city's evolving landscape and identifying landlords that may not be compliant with property regulations. 

### Goals
- Establish criteria to identify "bad landlords" or "scofflaw property owners".
- Propose amendments to the City of Boston Code of Ordinances.
  
### Criteria for Scofflaw Property Owner
1. One or more rental units in active enforcement proceedings.
2. Ownership of rental units with six or more code violations within a 12-month period.
3. Ownership of a rental unit designated as a “problem property”.

## Project Requirements

### Data Engineering

- **Automate Data Extraction**: Extract and merge datasets including Problem Properties List, Property Assessment, Live Street Address Management (SAM), and Building and Property Violations.
  
- **Integrate Court Data**: Consider data sources like Civera (from Masscourts.org) or other potential sources.
  
- **Data Linking**: Identify fields that act as keys to link different datasets with assistance from domain experts.
  
- **Implement Caching Strategy**: Ensure that the data pipeline is efficient and responsive.
  
- **Data Filtering**: Determine the columns and data points to be pulled into the web application.

### UX/UI Needs

- **Research**: Review existing bad landlord sites for inspiration such as NY Worst Landlords, Chicago Scofflaw site, and Toronto Rent Safe List.
  
- **Client Consultation**: Engage with the client to determine the priority data points to display.
  
- **Branding and Design**: Create a unique brand and visual style for the platform.
  
- **User Research**: Use UX Toolkit to draft interview scripts and gather user insights.

### Deliverables

- **Interactive Web App**: Develop an interface that allows users to interact with the data.
  
- **Map Features**: Update the map to allow selection by neighborhood, census tracts, and other geographic divisions.
  
- **Data Display**: Provide displays for scofflaw landlord lists based on the map and filters.
  
- **Additional Datasets (Optional)**: Integrate datasets such as Census Block Groups or College Student Addresses for enhanced insights.

## Status (Incomplete)

### Data Engineering

- **Automate Data Extraction**: Not fully complete. While scripts are in place, automation for running these scripts needs to be set up.
- **Court Data**: Currently not being used.

### UX/UI Needs

- **Design and User Experience**: UX has been designed and is available at [Figma](https://www.figma.com/file/wlW1SadRl9pTUiIcerOMKm/Summer-2023---BadLandlords?type=design&node-id=0%3A1&mode=design&t=O27CaHn2Mvms7vlG-1). Design is still in progress as of 08/18/2023.

### Deliverables

- **Map Features**: Enhanced with clustering for faster load speeds. However, modal popup and search box features are yet to be implemented.
- **Data Representation**: More datasets need to be incorporated for accurate ScoffLaw determination.
- **UI**: Ongoing changes to align with the UX design.

## Architecture

- **Framework**: The application uses Next.js for both frontend and backend.
- **Map Features**: Mapbox is employed for map functionalities.
- **Hosting & CI/CD**: Netlify is used for hosting and CI/CD.

### Directory Structure

- `/database_scripts`: Contains Python scripts for datasets like Building and Violations, Parcel2023, Property Assessment, and SAM Addresses. Dataset links:
    - [Building and Violations](https://data.boston.gov/dataset/building-and-property-violations1)
    - [Parcel2023](https://data.boston.gov/dataset/parcels-2023)
    - [Property Assessment](https://data.boston.gov/dataset/property-assessment)
    - [SAM Addresses](https://data.boston.gov/dataset/live-street-address-management-sam-addresses)
  
- `/components`: Contains reusable components used in the website. The `/NewMap` directory here contains Mapbox interactive map implementation files.
  
- `/prisma`: Contains the current database schema. It's important to note that the models aren't connected using foreign keys in the PostgreSQL database (hosted on Railway).
  
- `/pages`: Contains frontend code.
  
- `/pages/api`: Holds the API endpoints developed over the project duration.
  
- `/styles`: Contains global CSS.

## Known Bugs/Issues

- **Data Limitations**: The current datasets might be insufficient for the desired functionalities of the app. While the app displays data points with six or more violations, the data from Building and Violations is not clean and needs client consultation.
  
- **Dataset Incompleteness**: If planning to display all households in Boston on the map, a more comprehensive dataset than SAM might be necessary as some data points could be missing.

## Contributors

- Add Contributors here.
- Jason Oh - jasonoh1998@gmail.com