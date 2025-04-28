// src/firebase/firebaseInit.js
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'         // ← add this

import firebaseConfig from './firebaseConfig'

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app()

export const auth    = firebase.auth()
export const db      = firebase.firestore()
export const storage = firebase.storage()   // ← and export storage

// enable persistence, etc.
db.enablePersistence().catch(err => console.error(err.code))

export default app
