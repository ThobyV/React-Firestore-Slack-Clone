import firebase from './initialize';
import 'firebase/auth';

class Auth {
    constructor() {
        this.authRef = firebase.auth();
        this.googleProvider = new firebase.auth.GoogleAuthProvider();
    }

    googleSignInRedirect() {
        //call this on auth page to trigger redirect result
        return this.authRef.signInWithRedirect(this.googleProvider)
    }

    getRedirectResult() {
        //get the expected returned UserObject on any page
        return this.authRef.getRedirectResult()
    }

    googleSignInPopUp() {
        //if you prefer users to sign in with google popup UI
        return this.authRef.signInWithPopup(this.googleProvider)
    }

    async emailSignIn(email) {
        let actionCodeSettings = {
            url: 'https://thobyv.github.io/demo-app/React-Firestore-Slack-Clone',
            handleCodeInApp: true,
        }
        try {
            await this.authRef.sendSignInLinkToEmail(email, actionCodeSettings);
            return Promise.resolve(email);
        } catch (error) {
            return Promise.reject(error)
        }
    }

    //call this on the url/route passed to action code settings
    async completeEmailSignIn(email) {
        //deeplink formed by google contains auth otp, and email verified for comparison
        let authDeepLink = window.location.href;
        try {
            if (!email) throw new Error('no email found to match');
            if (!this.authRef.isSignInWithEmailLink(authDeepLink)) {
                throw new Error('email does not match');
            }
            const authUser = await this.authRef.signInWithEmailLink(email, window.location.href)
            return Promise.resolve(authUser);
        } catch (error) {
            Promise.reject(error);
        }
    }

    async customAnonymousSignIn() {
        //pending finalization of this on our discussion
    }

    async anonymousSignIn() {
        return firebase.auth().signInAnonymously();
    }

    onAuthStateObserver(callback, fallback) {
        const unsubscribe = this.authRef.onAuthStateChanged((currentUser) => {
            callback(currentUser)
        })
        return unsubscribe;
    }

}

const auth = new Auth();

export default auth;