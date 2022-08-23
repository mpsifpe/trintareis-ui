import firebase from '../config/firebase';

const friends = firebase.firestore().collection('friends');


export function inviteFriend(friend_email, user_email){

    friends.add({
        friend2: friend_email,
        friend1: user_email,
        pending: true
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    console.log("convite enviado", friend_email, user_email )
}


export function removeFriend (friend_email, user_email){

    friends.get().then(  
        (result) => {      
            result.docs.forEach(doc => {
                if (doc.data().friend1 === user_email && doc.data().friend2 === friend_email || doc.data().friend2 === user_email && doc.data().friend1 === friend_email) {
                        friends.doc(doc.id).delete();
                        console.log("amizade deletada", friend_email, user_email )     }})})
}


export function acceptInvite(friend_email, user_email){

    friends.where("friend2", "==", user_email).where("friend1", "==", friend_email)
            .get().then(
                (docs) => {
                    docs.forEach((doc) => {
                        friends.doc(doc.id).update({pending: false})
                        console.log("amizade aceita", friend_email, user_email )      })})
}