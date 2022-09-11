import firebase from '../config/firebase';

const profiles = firebase.firestore().collection('profiles');

export async function hasProfile(email){
    await profiles.where("emailUser", "==", email).get().then((result) => {
          return !result.empty
        })
}