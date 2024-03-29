import api from "../config/api"

/*
Essas funções são modelos: o corpo precisa ser copiado e colado dentro de cada tela,
porque se apenas chamadas a demora na resposta faz a tela seguir com resultado undefined
*/
export function hasProfile(email){
    let aux = []

    api.get('/profile/' + email)
    .then((response) => {
        (response.status === 200) ? aux.push(true) : aux.push(false)   })
    .catch((error) => {
        console.log(error)
        aux.push(false)   })
    .finally(() => {
        console.log("hasProfile return " + aux[0])
        return aux[0]   })
}

export function getProfileData(email){
    
    api.get('/profile/' + email)
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        console.log(error);
        return []
    })
}

export function postCreateProfile(){
    api.post('/profile', {
        city: "string",
        coverPhoto: "string",
        details: "string",
        profileInformation: "string",
        profilePhoto: "string",
        emailUser: "string",
        region: "string",
        userName: "string"
      })
      .then(function (response) {
        console.log(response.status);
      })
      .catch(function (error) {
        console.log(error);
      });
}

//se o ID não for informado, será feito um post e criado um novo ID 
export function putUpdateProfile(){
    api.post('/profile', {
        id: "string",
        city: "string",
        coverPhoto: "string",
        details: "string",
        profileInformation: "string",
        profilePhoto: "string",
        emailUser: "string",
        region: "string",
        userName: "string"
      })
      .then(function (response) {
        console.log(response.status);
      })
      .catch(function (error) {
        console.log(error);
      });
}