// there is an error when writing typescript...
// "Uncaught ReferenceError: exports is not defined"


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, signInWithRedirect, getRedirectResult, signOut, GoogleAuthProvider, TwitterAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "./publicEnvVarsModule.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

const loginWithGoogle = (() => {
  signInWithRedirect(auth, googleAuthProvider);
});
window.loginWithGoogle = loginWithGoogle;
export {loginWithGoogle};

const twitterAuthProvider = new TwitterAuthProvider();
const loginWithTwitter = (() => {
  signInWithRedirect(auth, twitterAuthProvider);
});
window.loginWithTwitter = loginWithTwitter;
export {loginWithTwitter};

const logout = (() => {
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log('Sign-out successful.');
  }).catch((error) => {
    // An error happened.
    console.error('An error happened.');
    console.error(error);
  });

});
window.logout = logout;
export {logout}; 

getRedirectResult(auth)
  .then((result) => {
    console.log('result : ' + JSON.stringify(result));
    // This gives you a Google Access Token. You can use it to access Google APIs.
    //const credential = GoogleAuthProvider.credentialFromResult(result);
    //console.log('credential : ' + JSON.stringify(credential));

    // The signed-in user info.
    //const user = result.user;
    //console.log('user : ' + JSON.stringify(user));
    // IdP data available using getAdditionalUserInfo(result)
    // ...

    /*firebase.auth().*/auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      // Send token to your backend via HTTPS
      // ...
      console.log('getIdToken then');
      document.getElementById('idToken').value = idToken;
      document.getElementById('submit').click();
    }).catch(function(error) {
      // Handle error
      console.error('error occurred!');
      console.error(error);
    });
  }).catch((error) => {
    console.error('error occurred!');
    console.error(error);
    // Handle Errors here.
    const errorCode = error.code;
    console.error('errorCode: ' + errorCode);
    const errorMessage = error.message;
    console.error('errorMessage: ' + errorMessage);
    // The email of the user's account used.
    const email = error.customData.email;
    console.error('email: ' + email);
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    console.error('credential: ' + credential);
  });