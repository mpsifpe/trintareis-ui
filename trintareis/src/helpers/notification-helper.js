import firebase from '../config/firebase';

const notifications = firebase.firestore().collection('notifications');

/*
Para criar uma nova notificação, os campos abaixo são obrigatórios para não causar falta de campos para renderização
        
    notifyUser:   email do usuário que recebe a notificação
    seen:         criado como false, atualizado para true ao ser clicado 
    text:         texto exibido na notificação
    type:         "friend_invite" / "friend_accept"
    timestamp:    (new Date())


Campos específicos
    inviter:      usuário que enviou o convite de amizade
    response:     utilizado para registrar quem respondeu a solicitação de amizade
*/

export function notifyFriendInvite(friend_email, user_email){
    
    notifications.add({
        notifyUser: friend_email,
        seen: false,
        text: ("Você recebeu um convite de: " + user_email),
        type: "friend_invite",
        timestamp: (new Date()),
        inviter: user_email,
        response: ""
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    console.log("notificação convite enviada", friend_email, user_email )
}


export function notifyAcceptInvite(friend_email, user_email){
    
    notifications.add({
        notifyUser: friend_email,
        seen: false,
        text: ("Sua solicitação de amizade foi aceita por " + user_email),
        type: "friend_accept",
        timestamp: (new Date()),
        inviter: friend_email,
        response: user_email
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    console.log("notificação aceite enviada", friend_email, user_email )
}


export function updateNotificationText(notificationID, newtext){
    notifications.doc(notificationID).update({text: newtext})
    console.log("texto notificação atualizado", notificationID, newtext )
}


export function updateNotificationSeen(notificationID, status){
    notifications.doc(notificationID).update({seen: status})
    console.log("notificação atualizada", notificationID, status )
}


export function deleteNotification(notificationID){
    notifications.doc(notificationID).delete();
    console.log("notificação deletada", notificationID)
}


export function deleteFriendInviteNotifications(friend_email, user_email){
    notifications.where("inviter", "==", friend_email)
                 .where("notifyUser", "==", user_email)
                 .where("type", "==", "friend_invite")
                 .get().then((docs) => {
                    docs.forEach((doc) => {
                        deleteNotification(doc.id)   })})

    notifications.where("inviter", "==", user_email)
                 .where("notifyUser", "==", friend_email)
                 .where("type", "==", "friend_invite")
                 .get().then((docs) => {
                    docs.forEach((doc) => {
                        deleteNotification(doc.id)   })})

    notifications.where("inviter", "==", user_email)
                 .where("response", "==", friend_email)
                 .where("type", "==", "friend_accept")
                 .get().then((docs) => {
                    docs.forEach((doc) => {
                        deleteNotification(doc.id)   })})

    notifications.where("response", "==", user_email)
                 .where("inviter", "==", friend_email)
                 .where("type", "==", "friend_accept")
                 .get().then((docs) => {
                    docs.forEach((doc) => {
                        deleteNotification(doc.id)   })})
    
    console.log("notificações de amizade deletadas", friend_email, user_email)
}


export function findAndUpdateInviteNotification(inviter, user){
    
    let newtext = ("Você e " + inviter + " agora são amigos");

    notifications.where("inviter", "==", inviter)
                 .where("notifyUser", "==", user)
                 .where("type", "==", "friend_invite")
                 .get().then((docs) => {
                    docs.forEach((doc) => {
                        updateNotificationSeen(doc.id, true)
                        updateNotificationText(doc.id,newtext)   })})

    console.log("notificação de convite atualizada", inviter, user)
}