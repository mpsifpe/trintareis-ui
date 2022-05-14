import './userList.css'
import React from 'react';
import FriendCard from '../friend-card'
import firebase from '../../config/firebase';

export default function UserList(){
    
    let data = [];

    async function getUsers(){
        console.log("start getusers")
        
        let tempList = [];

        await firebase.firestore().collection('profiles').get().then(  
            (result) => {
                result.docs.forEach(
                    doc => {tempList.push([doc.get("userName"), doc.get("city")]); }
                );
            }
        );
        
        for (var i = 0; i < tempList.length; i++){
            data.push(
                {
                    id: i,
                    nome: tempList[i][0],
                    course: tempList[i][1],
                    type: "aluno"  
                }
            )
        };
        
        console.log(data);
        return ( data ); 
    };
    
    getUsers();
};