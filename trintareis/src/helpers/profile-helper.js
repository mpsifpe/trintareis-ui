import api from "../config/api"

//----------------- functions auxiliares
export function hasProfile(email){

    api.get('/profile/' + email)
    .then((response) => {
        if (response.status === 200){
            return true }
        else {
            console.log("API error " + response.status)
            return false }        
    })
    .catch((error) => {
        console.log(error);
        return false;
    })
}

//------------------ gets posts puts
export function getProfileData(email){
    //let profileData = []

    api.get('/profile/' + email)
    .then(function (response) {
        return response;
        /*profileData.push(
            response.data.city,
            response.data.details,
            response.data.profileInformation,
            response.data.emailUser,
            response.data.region,
            response.data.userName)
            */
    })
    .catch(function (error) {
        console.log(error);
        return []
    })/*
    .finally(()=>{
        //console.log(profileData)
        return profileData
    })*/
    
}


export function postCreateProfile({data}){

    api.post('/profile', {
        city: data.city,
        coverPhoto: data.coverPhoto,
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

