# Bad Landlords ReadMe
Getting Started

To run locally, Clone this repo and navigate into the Bad-landlords directory in your terminal
- run npm install to install all the dependencies on your system
- then run npm run dev to start the local server.
- type in http://localhost:3000 your browser to access the site.

# Data Processing Workflow
Three datasets->
- Building violations dataset (https://data.boston.gov/dataset/building-and-property-violations1/resource/800a2663-1d6a-46e7-9356-bedb70f5332c)
- Property Assessment dataset (https://data.boston.gov/dataset/property-assessment/resource/1000d81c-5bb5-49e8-a9ab-44cd042f1db2)
- Boston Parcels dataset (https://data.boston.gov/dataset/parcels-2023)
  ** Combined the parcel dataset and property assessment dataset to add ownership to points geospatially as indicated by the parcel 2023 information. 

  * 
  To add ownership information please join the Property Assessment CSV file in Analyze Boston with Parcels 2022 geospatial data using MAP_PAR_ID and GIS_ID fields.
  * 

  **Then I combined the building violations dataset(BVD) with the now combined dataset using Arcgis. BVD contains point data(longitude and latitude), while its counterpart contains shape data. combined by finding these points in the shape dimensions.

Next Steps: Once all of the data has been merged, convert the combined csv to geoJson. Reason for this is for Mapbox to recognize it. I created a github pages link for this step and I recommend you do the same for now. That way I have a url I can call to access this data in the map code. 

# MapBox Workflow
How it works? The way is by uploading your data source to mapbox studio and then accessing those sources through a unique url(explore the Map.js file to find out more details)
- Created tilesets by uploading source folders to mapbox studio
- In order to query mapbox api, you need a public token that is available in your mapbox account.

# Deploying to netlify
- https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/

## Next steps: 
- Create a pipeline for new data to be retrieved, processed, uploaded in mapbox or github to automatically populate map with the newest data
- Modify data to display one point for owners with multiple violations at the same address
- Dynamically load data based on viewport. To work on this, you will have to modify the Map.js file. (Code in this file allows you to modify the map)
- Implement a search feature that allows users to search for anything, a landlord, specific violations, codes etc.

# Site Pages
## Landlord page
- This page currently displays the landlords with the most violations. This is done by creating a python file (landlords.py) which creates a new dataframe with new columns such as the owner name and violations and groups them together by owner name. I then use this dataframe in my getLandlords.js file to retrieve and count the landlords with the most violations and display the top 100 in descending order.

-This new dataframe is stored in the Public folder and is called the (df_grouped_json.json)

## Map Page
- This page contains the map component and the table component as well. Ideally, the table should display the points currently in the viewport and should dynamically update with the points in the viewport. If this need is still in the requirements, then I recommend this feature to be modified and worked on. Currently it displays points in the area, but it also displays points outside of the map view.

Important Notes
- Add images to the public folder for it to display.
- geocoder.html is a file that allows you to input the mapbox geocoder api.
  - This is the search feature on the map page that allows you to locate points by address
- Google doc with more information: https://docs.google.com/document/d/1xmPJJ7fR8X6g3dA58RCjWSGqD0B-ipqMu-uVj3tB8N0/edit

## API List

There are three api routes.

1. `/api/geojson/map-points` : Returns geoJson format of data points need to create the map.

2. `/api/landlords/top-ten` : Fetches violation_view view during the build time.

3. `/api/addresses?search=QUERY` : Fetches addesses that are similar to what user input in the search input box.

## Below is information about the nextjs and netlify setup 
# Next + Netlify Starter
 
[![ Status](https://api.netlify.com/api/v1/badges/46648482-644c-4c80-bafb-872057e51b6b/deploy-status)](https://app.netlify.com/sites/next-dev-starter/deploys)

This is a [Next.js](https://nextjs.org/) v12 project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and set up to be instantly deployed to [Netlify](https://url.netlify.com/SyTBPVamO)!

This project is a very minimal starter that includes 2 sample components, a global stylesheet, a `netlify.toml` for deployment, and a `jsconfig.json` for setting up absolute imports and aliases. With Netlify, you'll have access to features like Preview Mode, server-side rendering/incremental static regeneration via Netlify Functions, and internationalized routing on deploy automatically.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify-templates/next-netlify-starter&utm_source=github&utm_medium=nextstarter-cs&utm_campaign=devex-cs)

(If you click this button, it will create a new repo for you that looks exactly like this one, and sets that repo up immediately for deployment on Netlify)

## Table of Contents:

- [Getting Started](#getting-started)
- [Installation options](#installation-options)
- [Testing](#testing)
  - [Included Default Testing](#included-default-testing)
  - [Removing Renovate](#removing-renovate)
  - [Removing Cypress](#removing-cypress)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

### Installation options

**Option one:** One-click deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify-templates/next-netlify-starter&utm_source=github&utm_medium=nextstarter-cs&utm_campaign=devex-cs)

**Option two:** Manual clone

1. Clone this repo: `git clone https://github.com/netlify-templates/next-netlify-starter.git`
2. Navigate to the directory and run `npm install`
3. Run `npm run dev`
4. Make your changes
5. Connect to [Netlify](https://url.netlify.com/Bk4UicocL) manually (the `netlify.toml` file is the one you'll need to make sure stays intact to make sure the export is done and pointed to the right stuff)

## Testing

### Included Default Testing

We’ve included some tooling that helps us maintain these templates. This template currently uses:

- [Renovate](https://www.mend.io/free-developer-tools/renovate/) - to regularly update our dependencies
- [Cypress](https://www.cypress.io/) - to run tests against how the template runs in the browser
- [Cypress Netlify Build Plugin](https://github.com/cypress-io/netlify-plugin-cypress) - to run our tests during our build process

If your team is not interested in this tooling, you can remove them with ease!

### Removing Renovate

In order to keep our project up-to-date with dependencies we use a tool called [Renovate](https://github.com/marketplace/renovate). If you’re not interested in this tooling, delete the `renovate.json` file and commit that onto your main branch.

### Removing Cypress

For our testing, we use [Cypress](https://www.cypress.io/) for end-to-end testing. This makes sure that we can validate that our templates are rendering and displaying as we’d expect. By default, we have Cypress not generate deploy links if our tests don’t pass. If you’d like to keep Cypress and still generate the deploy links, go into your `netlify.toml` and delete the plugin configuration lines:

```diff
[[plugins]]
  package = "netlify-plugin-cypress"
-  [plugins.inputs.postBuild]
-    enable = true
-
-  [plugins.inputs]
-    enable = false 
```

If you’d like to remove the `netlify-plugin-cypress` build plugin entirely, you’d need to delete the entire block above instead. And then make sure sure to remove the package from the dependencies using:

```bash
npm uninstall -D netlify-plugin-cypress
```

And lastly if you’d like to remove Cypress entirely, delete the entire `cypress` folder and the `cypress.config.ts` file. Then remove the dependency using:

```bash
npm uninstall -S cypress
```
