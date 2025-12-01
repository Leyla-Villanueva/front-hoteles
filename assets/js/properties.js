export const properties = {
API_URL: "https://api.example-hotel.com/api",
APP_NAME: "HotelesPWA",
VERSION: "1.0.0",
SYNC_ENDPOINT: "/sync/changes",
CACHE_NAME: "hoteles-pwa-v1",
};


export function getProperty(key) {
return properties[key];
}


export default properties;