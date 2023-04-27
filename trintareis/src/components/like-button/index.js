import './like-button.css'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineHeart } from "react-icons/hi";

import api from '../../config/api';

export default function LikeButton(props){

    const loggedUser = useSelector(state => state.emailUser);

    function postLike(obj){        
        api.post('/likes', {
            postId: obj.id,
            userEmail: loggedUser
        })
        .then(()=>{
            let size = curtir.length;
            setCurti(size++);
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro");
        })
    }

    function deletetLike(obj){        
        api.delete('/likes', {
            params : {
                userEmail: loggedUser,
                postId: obj.id
            }
        })
        .then(()=>{
            let size = curtir.length;
            setCurti(size--);
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro");
        })
    }

    function funcGostei(obj) {
        api.get('/likes/', { params: { postId: obj.id } })
            .then((response) => {
                let flag = false;

                response.data.map(item => {
                    if(item.userEmail == loggedUser){
                        flag = true;
                    }
                });

                if(flag){
                    deletetLike({ id: props.id });
                }

                if(!flag){
                    postLike({ id: props.id });
                }
            }).catch(function (error) {
                console.log(error);
                notyf.error("Desculpe, ocorreu um erro");
                setRefresh(true);
            })
    }

    return(
        <div className='feed-content-bt-gostei'>
            <HiOutlineHeart />
            <span onClick={() => funcGostei({ id: props.id })} id={props.id + '_botao'} className="">Gostei</span>
        </div>
    )
}