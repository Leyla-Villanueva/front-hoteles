const DB_VERSION = 1;
let dbPromise = null;


function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('rooms')) {
                db.createObjectStore('rooms', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('pending')) {
                db.createObjectStore('pending', { autoIncrement: true });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
    return dbPromise;
    }


export async function getStore(storeName, mode = 'readonly') {
    const db = await openDB();
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
}


export async function putItem(storeName, item) {
    const store = await getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
        const req = store.put(item);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}


export async function getItem(storeName, key) {
    const store = await getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}


export async function getAll(storeName) {
    const store = await getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}


export async function addPending(item) {
    const store = await getStore('pending', 'readwrite');
    return new Promise((resolve, reject) => {
        const req = store.add(item);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}


export async function clearPending() {
    const store = await getStore('pending', 'readwrite');
    return new Promise((resolve, reject) => {
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
    });
}