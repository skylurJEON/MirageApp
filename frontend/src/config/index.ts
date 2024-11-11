// 실제 디바이스 테스트용 API URL
export const DEV_API_URL = 'http://192.168.35.146:3000';
export const PROD_API_URL = 'https://your-production-api.com';

// 현재 환경에 따라 API URL 설정
export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;