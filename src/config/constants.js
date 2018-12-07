const SECURE = true
const HOST = 'dataglitter.co.uk' // 34.243.209.233
const PORT = '11012'
const API_POINT = '/api'
const HTTPS = 'https://'
const HTTP = 'http://'
const SANGRAM_REDDY = 'Sangram Reddy'
const ANIRUP_PATNAIK = 'Anirup Patnaik'
const SHARAN_PATIL = 'Sharan Patil'
const DATAGLITTER = 'DataGlitter'
const DATA_GLITTER = 'Data Glitter'
const DATAGLITTER_AUTH_TOKEN = 'DataGlitter-Auth-Token'
const DATAGLITTER_ID = 'DataGlitter-Id'
const VALIDATE = 'VALIDATE'
const SITE_URL = 'https://dataglitter.co.uk'
const VERSION = '1.4.1'
const S3_ASSETS = 'https://s3-eu-west-1.amazonaws.com/dataglitter-assets/'

export default {
  DATAGLITTER: DATAGLITTER,
  DATA_GLITTER: DATA_GLITTER,
  SECURE: SECURE,
  HOST: HOST,
  PORT: PORT,
  API_POINT: API_POINT,
  HTTPS: HTTPS,
  HTTP: HTTP,
  END_POINT: SECURE ? HTTPS + HOST + ':' + PORT + API_POINT : HTTP + HOST + ':' + PORT + API_POINT,
  POST_IMAGES_ENDPOINT: S3_ASSETS,
  PROFILE_PICS_ENDPOINT: S3_ASSETS,
  LOGIN_END_POINT: SECURE ? HTTPS + HOST + ':' + PORT : HTTP + HOST + ':' + PORT,
  DATAGLITTER_AUTH_TOKEN: DATAGLITTER_AUTH_TOKEN,
  AUTHORIZATION: 'Authorization',
  SR: SANGRAM_REDDY,
  VR: VERSION,
  TAGS: [
    'Data Engineering',
    'Data Science',
    'Machine Learning',
    'Architecture',
    'ITIL Standards',
    'Enterprise Architecture',
    'White Papers',
    'Technology',
    'Application Architecture',
    'Dev Ops'
  ],
  PTAGS: [
    SANGRAM_REDDY,
    ANIRUP_PATNAIK,
    SHARAN_PATIL,
    DATAGLITTER,
    DATA_GLITTER
  ],
  DESCRIPTION: 'A platform built to Read, Write & Share ideas and learn from the very best in technology. It\'s become more and more tough to find content which is authenticated. We share our experiences in the fields of Data Engineering, Dev Ops, Data Science and Data Visuailization fueled with loads of passion to improve technology for the good of everyone.',
  VALIDATE: VALIDATE,
  DATAGLITTER_ID: DATAGLITTER_ID,
  SITE_URL: SITE_URL,
  TOAST: {
    SUCCESSFULLY_SAVED: 'Sucessfully saved',
    SOMETHING_WENT_WRONG: 'Something went wrong',
    CANT_ADD_EMPTY_TAG: 'Can not add an empty tag',
    IMAGE_SUCESSFULLY_UPLOADED: 'Image has been sucessfully uploaded'
  }
}
