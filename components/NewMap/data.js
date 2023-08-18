// block data and layers
export const censusData = {
  type: 'vector',
  url: 'mapbox://spark-badlandlords.cxyyru86'
}

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
    'fill-opacity': 0.3
  }
}

// neighborhoods data and layers

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
  }
}

export const neighborhoodsBordersLayer = {
  id: 'neighborhoods-borders',
  type: 'line',
  source: 'neighborhoodsData',
  'source-layer': 'census2020_bg_neighborhoods-5hyj9i',
  layout: {},
  paint: {
    'line-color': 'purple',
    'line-width': 2
  },
}

// violations data and layers
export const violationsData = {
  type: 'geojson',
  // change this url to api or static geojson file
  url: 'https://kolade2.github.io/Bad-Landlords/data/updated_data.csv.geojson'
  // url: 'http://localhost:3000/api/geojson/map-points2'
}

export const unclusteredViolationsLayer = {
  id: 'unclustered-violations',
  type: 'circle',
  source: 'violationsData',
  filter: [
    '!',
    ['has', 'point_count']
  ],
  paint: {
    'circle-color': 'white',
    'circle-radius': 4,
    'circle-stroke-width': 1.5,
    'circle-stroke-color': 'purple'
  }
}

export const clusteredViolationsLayer = {
  id: 'clustered-violations',
  type: 'circle',
  source: 'violationsData',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
  }
}

export const clusterViolationsCountLayer = {
  id: 'cluster-violations-count',
  type: 'symbol',
  source: 'violationsData',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
}
