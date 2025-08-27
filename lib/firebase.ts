import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if we have valid Firebase configuration
const hasValidConfig =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-api-key"

let app: any = null
let db: any = null
let auth: any = null

if (hasValidConfig) {
  try {
    // Initialize Firebase only if it hasn't been initialized
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }

    // Initialize Firebase services
    db = getFirestore(app)
    auth = getAuth(app)

    console.log("✅ Firebase initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing Firebase:", error)
    app = null
    db = null
    auth = null
  }
}

// Export Firebase services (may be null if not configured)
export { db, auth, app, hasValidConfig }
export default app
