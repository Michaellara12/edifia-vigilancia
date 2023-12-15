importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDPBWyFnGbeyXCBvDq6UeFxkZ9JNL2SYKE',
  authDomain: 'edifia.firebaseapp.com',
  projectId: 'edifia',
  messagingSenderId: '837815301944',
  appId: '1:837815301944:web:35a935c31fcd602ffcf3cd',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
});