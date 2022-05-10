import './userList.css'
import React from 'react';
import FriendCard from '../friend-card'
import firebase from '../../config/firebase';

export default function UserList(){

    //lista para exportar
    let list = [];
    let data = [];

    async function getUsers(){
        let tempList = [];

        await firebase.firestore().collection('profiles').get().then(  
            (result) => {
                result.docs.forEach(
                    doc => {tempList.push([doc.get("userName"), doc.get("city")]); }
                );
            }
        );
        //console.log(tempList); 
        list = tempList;
    };
    
    //obriga a prosseguir apenas quando acabar getUsers
    async function makeList(){
        await getUsers();
        //console.log(list);

        for (var i = 0; i < list.length; i++){
            data.push({
                id: i,
                name: list[i][0],
                course: list[i][1],
                type: "aluno"
            })
            //console.log(data[i]) 
        }

        //console.log(data)

    };

    makeList();

    return (
        <div> 
            <p>teste</p>
            {data.map(d => (
                <FriendCard 
                    key={d.id} 
                    name={d.name} 
                    course={d.course} 
                    type={d.type}/>
            ))}
        </div>
    );
}