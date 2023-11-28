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
    'line-width': 0
  },
}

// violations data and layers
// change the url to one of map-point api to fetch data points
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
    'circle-radius': 4,
    'circle-stroke-width': 1.5,
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
    'circle-color': ['step', ['get', 'point_count'], '#F9E1AC', 100, '#F09DB1', 750, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
    'circle-stroke-width': 2,
    'circle-stroke-color': ['step', ['get', 'point_count'], '#FFD166', 100, '#EF476F', 750, '#f28cb1']
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
