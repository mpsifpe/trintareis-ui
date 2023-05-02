import api from "../config/api";
/*
Essas funções são modelos: o corpo precisa ser copiado e colado dentro de cada tela,
porque se apenas chamadas a demora na resposta faz a tela seguir com resultado undefined
*/
export function postFriendRequest(friendEmail){
    
    api.post('/friends', {
        params : {
            userEmailFriend: "string",
            userEmail: "string"
        }
    })
    .then(function (response) {
        console.log(response.status);
    })
    .catch(function (error) {
        console.log(error);
    });
}

export function getFriends(){
    
    api.get('/friends/',{
        params : {
            userEmail: "string",
            page: "integer",
            size: "integer"
        }
    })
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        console.log(error);
    })
}


export function deleteFriendship(friend){
    api.delete('/friends/'+ friend)
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        console.log(error);
    })
}

export function getNotFriends(){
    
    api.get('/friends/has-not-connection', {
        params : {
            userEmail: "emailUser",
            page: 0,
            size: 10
        }
    })
    .then(function (response) {
        console.log(response)
    })
    .catch(function (error) {
        console.log(error);
    })
}
