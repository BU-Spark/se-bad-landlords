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