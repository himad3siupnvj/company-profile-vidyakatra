import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let cachedFirestore: Firestore | null = null

function getCredential() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON

  if (serviceAccount) {
    return cert(JSON.parse(serviceAccount))
  }

  return applicationDefault()
}

export function getFirestoreDb() {
  if (cachedFirestore) return cachedFirestore

  const projectId = process.env.FIREBASE_PROJECT_ID
  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID is required")
  }

  const app =
    getApps()[0] ??
    initializeApp({
      credential: getCredential(),
      projectId,
    })

  cachedFirestore = getFirestore(app)
  cachedFirestore.settings({ ignoreUndefinedProperties: true })

  return cachedFirestore
}

export const firestoreCollections = {
  periods: "periods",
  requestRateLimits: "requestRateLimits",
  members: "members",
  users: "users",
  organizationalUnits: "organizationalUnits",
  divisions: "divisions",
  articleCategories: "articleCategories",
  articles: "articles",
  articleVersions: "articleVersions",
  assets: "assets",
  siteSettings: "siteSettings",
  auditLogs: "auditLogs",
} as const

