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

const loginWithGoogle = (async () => {
  console.log('call signInWithRedirect');
  await signInWithRedirect(auth, googleAuthProvider);
  console.log('called');
});
window.loginWithGoogle = loginWithGoogle;
export {loginWithGoogle};

const logout = (async () => {
  if(confirm('ログアウトしてよろしいですか？')){
    const result = await signOut(auth).then(() => {
      // Sign-out successful.
      console.log('Sign-out successful. (signOut then)');
      return true;
    }).catch((error) => {
      // An error happened.
      console.error('signOut catch error happened.');
      console.error(error);
      return false;
    });
    return result;
  } else {
    return false;
  }
});
window.logout = logout;
export {logout};

const forceLogOut = (async () => {
  return await signOut(auth).then(() => {
    // Sign-out successful.
    console.log('Sign-out successful. (signOut then)');
    return true;
  }).catch((error) => {
    // An error happened.
    console.error('signOut catch error happened.');
    console.error(error);
    return false;
  });
});
window.forceLogOut = forceLogOut;
export {forceLogOut};


getRedirectResult(auth)
.then(async (result) => {

  // プライベートブラウザだと、ログアウトした後にログインしようとすると、なぜかうまくいかない。
  // 引数のresultがnullになってしまう・・。
  // ログイン・ログアウトのテストでは、プライベートブラウザを避けること。

  console.log('getRedirectResult then result : ' + JSON.stringify(result));
  console.log('auth.currentUser : ' + auth.currentUser);

  if(result == null){
    // if(auth.currentUser != null){

    //   await signOut(auth).then(() => {
    //     // Sign-out successful.
    //     console.log('Sign-out successful. (signOut then)');
    //   }).catch((error) => {
    //     // An error happened.
    //     console.error('signOut catch error happened.');
    //     console.error(error);
    //   });
    // }
    return;
  }

  /*firebase.auth().*/auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    // Send token to your backend via HTTPS
    // ...
    console.log('getIdToken then idToken : ' + idToken);
    document.getElementById('idToken').value = idToken;
    document.getElementById('submit').click();
  }).catch(function(error) {
    // Handle error
    console.error('getIdToken catch error occurred!');
    console.error(error);
  });
}).catch((error) => {
  console.error('getRedirectResult catch error occurred!');
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