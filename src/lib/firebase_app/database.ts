import { initializeApp } from "firebase/app";
import { type Timestamp, collection, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { 
    PUBLIC_API_KEY, PUBLIC_AUTH_DOMAIN, PUBLIC_PROJECT_ID, 
    PUBLIC_STORAGE_BUCKET, PUBLIC_MESSAGING_SENDER_ID, PUBLIC_APP_ID, PUBLIC_MEASUREMENT_ID 
} from "$env/static/public";

interface DataKomentar {
    id: string,
    user_id: string,
    konten: string,
    likes: 0,
    dislikes: 0,
    likedby: string[],
    dislikedby: string[],
    edited: false,
    dibuat_pada: Timestamp,
    update_pada: Timestamp
}

const firebaseConfig = {
    apiKey: PUBLIC_API_KEY,
    authDomain: PUBLIC_AUTH_DOMAIN,
    projectId: PUBLIC_PROJECT_ID,
    storageBucket: PUBLIC_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_MESSAGING_SENDER_ID,
    appId: PUBLIC_APP_ID,
    measurementId: PUBLIC_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const pendaftarRef = collection(database, 'PesertaPendaftar');
const komentarRef = collection(database, 'Komentar');
const auth = getAuth(app);

export { database, pendaftarRef, komentarRef, auth, type DataKomentar };