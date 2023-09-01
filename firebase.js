import {initializeApp,getApp,getApps} from "firebase/app"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
    apiKey: "AIzaSyDnqg0L74iajNHl2Lt208xSVELpC6a1300",
    authDomain: "twitter-clone-6b6a8.firebaseapp.com",
    projectId: "twitter-clone-6b6a8",
    storageBucket: "twitter-clone-6b6a8.appspot.com",
    messagingSenderId: "301146864897",
    appId: "1:301146864897:web:24cd2bb728f8784a582f00"
  };

  const app=!getApps().length ? initializeApp(firebaseConfig) : getApp()
  const db=getFirestore()
  const storage=getStorage()

  export default app
  export {db,storage}