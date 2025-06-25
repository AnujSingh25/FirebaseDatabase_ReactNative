import { firebase } from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCFu1lLZxDxhn92R6Uz94sz0ZSCJGRSzyU",
    authDomain: "geolocation-aead6.firebaseapp.com",
    projectId: "geolocation-aead6",
    storageBucket: "geolocation-aead6.firebasestorage.app",
    messagingSenderId: "1066429096881",
    appId: "1:1066429096881:web:cfb4879165343b46791390"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export { firestore, storage }
