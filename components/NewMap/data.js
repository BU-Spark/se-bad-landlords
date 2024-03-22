export const censusData = {
  type: 'vector',
  url: 'mapbox://spark-badlandlords.cxyyru86'
}

// block data and layers
// fills each neighborhoods
export const blockLayer = {
  id: 'census-block-layer',
  type: 'fill',
  source: {
    type: 'vector',
    url: 'mapbox://spark-badlandlords.cxyyru86'
  },
  'source-layer': 'census2020_tracts-4u84f2',
  paint: {
    'fill-color': 'blue',
    'fill-outline-color': 'red',
    'fill-opacity': 0
  }
}

// neighborhoods data and layers
// out lines the neighborhoods by changing color values of paint
export const neighborhoodsData = {
  type: 'vector',
  url: 'mapbox://spark-badlandlords.8o9j3v7f'
}
export const neighborhoodsLayer = {
  id: 'neighborhoods-fills',
  type: 'fill',
  source: 'neighborhoodsData',
  'source-layer': 'census2020_bg_neighborhoods-5hyj9i',
  layout: {},
  paint: {
    'fill-color': 'blue',
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.6,
      0
    ]
    // 'fill-opacity': 0
  }
}
export const neighborhoodsBordersLayer = {
  id: 'neighborhoods-borders',
  type: 'line',
  source: 'neighborhoodsData',
  'source-layer': 'census2020_bg_neighborhoods-5hyj9i',
  layout: {},
  paint: {
    'line-color': 'blue',
    'line-width': 1
  },
}

// violations data and layers
// change the url to one of map-point api to fetch data points
/*
  const geoJson = {
    type: "FeatureCollection",
    features: results.map((row: RowData) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [row.longitude, row.latitude],
      },
      properties: {
        SAM_ID: row.sam_id,
        FULL_ADDRESS: row.full_address,
        MAILING_NEIGHBORHOOD: row.mailing_neighborhood,
        ZIP_CODE: row.zip_code,
        parcel: row.parcel
      },
    })),
  };
*/
export const violationsData = {
  type: 'geojson',
  url: '/api/geojson/map-points2'
}

// small dots indicating individual points of the map styles
export const unclusteredViolationsLayer = {
  id: 'unclustered-violations',
  type: 'circle',
  source: 'violationsData',
  filter: [
    '!',
    ['has', 'point_count']
  ],
  paint: {
    'circle-color': '#FB4D42',
    'circle-radius': 6,
    // 'circle-stroke-width': 1.5,
    'circle-stroke-color': '#FB4D42'
  }
}

// clustered circles styles
export const clusteredViolationsLayer = {
  id: 'clustered-violations',
  type: 'circle',
  source: 'violationsData',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#F9E1AC', 100, '#F09DB1', 750, '#7CE4C9'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
    'circle-stroke-width': 2,
    'circle-stroke-color': ['step', ['get', 'point_count'], '#FFD166', 100, '#EF476F', 750, '#06D6A0']
  }
}
export const clusterViolationsCountLayer = {
  id: 'cluster-violations-count',
  type: 'symbol',
  source: 'violationsData',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Montserrat Bold', 'Arial Unicode MS Bold'],
    'text-size': 13
  }
}

// The names & locations of the neighborhood buttons
export const neighborhoods = [
  {
    "name": "Back Bay",
    "latitude": 42.34935079219511,
    "longitude": -71.07768484195698,
    "zoom": 12
  },
  {
    "name": "Fenway-Kenmore",
    "latitude": 42.34410046840793,
    "longitude": -71.09149456439195,
    "zoom": 12
  },
  {
    "name": "Allston",
    "latitude": 42.354073887542484,
    "longitude": -71.12205552803877,
    "zoom": 12
  },
  {
    "name": "Beacon Hill",
    "latitude": 42.35772707692351,
    "longitude": -71.06063056114242,
    "zoom": 12
  },
  {
    "name": "Brighton",
    "latitude": 42.349807928693366,
    "longitude": -71.15428721858567,
    "zoom": 12
  },
  {
    "name": "Bay Village",
    "latitude": 42.34867038592486,
    "longitude": -71.0656615496278,
    "zoom": 12
  },
  {
    "name": "Charlestown",
    "latitude": 42.37803429987562,
    "longitude": -71.06114769366161,
    "zoom": 12
  },
  {
    "name": "South End",
    "latitude": 42.340878919021804,
    "longitude": -71.07653159645594,
    "zoom": 12
  }
]