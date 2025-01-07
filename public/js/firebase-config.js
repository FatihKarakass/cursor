const firebaseConfig = {
    // Firebase console'dan alacağınız config bilgileri
    apiKey: "senin-api-keyin",
    authDomain: "senin-projen.firebaseapp.com",
    projectId: "senin-projen",
    storageBucket: "senin-projen.appspot.com",
    messagingSenderId: "senin-messaging-id",
    appId: "senin-app-id",
    databaseURL: "https://senin-projen.firebaseio.com"
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database(); 