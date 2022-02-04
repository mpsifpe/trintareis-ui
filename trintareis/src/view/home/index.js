import React, { useState, useEffect } from 'react';
import './home.css';
import Header from '../../components/header/index'
import FeedForm from '../../components/feed-form/index';
import FeedPost from '../../components/feed-post/FeedPost';
import firebase from '../../config/firebase';

function Home() {
    const [eventos, setEventos] = useState([]);
    let listEventos = [];

    useEffect(() => {
        firebase.firestore().collection('events').get().then(async (result) => {
            await result.docs.forEach(doc => {
                listEventos.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            setEventos(listEventos);
        })
    });
    return (
        <div className="App">
            <Header />
            <div className="feed_content">
                <FeedForm />
                {eventos.map(item => <FeedPost key={item.id} id={item.id} img={item.photo} title={item.title} nome="Trinta Reis" horario={item.hour} conteudo={item.details} />)}
            </div>
        </div>
    )
}

export default Home;