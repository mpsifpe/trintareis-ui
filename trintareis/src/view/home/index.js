import './home.css';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoChevronDownCircleOutline } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";

import Header from '../../components/header/index'
import FeedForm from '../../components/feed-form/index';
import FeedPost from '../../components/feed-post/FeedPost';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';

import Modal from '../../components/modal/Modal';
import useModalState from '../../hooks/useModalState';
import NotyfContext from '../../components/notyf-toast/NotyfContext';

import api from '../../config/api';
import firebase from '../../config/firebase';
import { isEmpty, formatDate, isURL } from '../../helpers/helper';

export default function Home() {
    
    let location = useLocation();
    const storage = firebase.storage();
    const emailUser = useSelector(state => state.emailUser);
    const notyf = useContext(NotyfContext);

    const [isPostOpen, openPost, closePost] = useModalState();

    const [visible, setVisible] = useState(false);
    const [page, setPage] = useState(0);
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState({});
    const [urlImageProfile, setUrlImageProfile] = useState(loading);    
    const [profImageUpdated, setProfImageUpdated] = useState(false);
    const [urlImageCover, setUrlImageCover] = useState(loading);
    const [coverImageUpdated, setCoverImageUpdated] = useState(false);
    const [homeRefresh, setHomeRefresh] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [textField, setTextField] = useState('');
    const [file, setFile] = useState();
    const [errorMessage, setErrorMessage] = useState(<></>);
    const [button, setButton] = useState(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>)
    const [type, setType] = useState("text");
    const [media, setMedia] = useState(<></>);
    const [field, setField] = useState(<></>);

    useEffect(() => {
        const abortController = new AbortController()       
        
        if(!loaded){
            loadData();    
        } else {
            fetchContent();
        }

        return function cleanup() {
            abortController.abort()
        }
    }, [homeRefresh]);

    return (
        <div className="App">
                <Header 
                    firstLogin={location.state.firstLogin} 
                    profilePhoto={profImageUpdated ? urlImageProfile : location.state.profilePhoto} 
                    coverPhoto={coverImageUpdated ? urlImageCover : location.state.coverPhoto} 
                    userData={location.state.userData}
                    id={location.state.userData.id}
                    origin="home"/>
            <homeRefreshContext.Provider value={{homeRefresh, setHomeRefresh}}>
                <div className="feed_content">
                    <div onClick={openPost}>
                        <FeedForm profilePhoto={urlImageProfile} stateFirstLogin={location.state.firstLogin} stateProfilePhoto={location.state.profilePhoto} stateCoverPhoto={location.state.coverPhoto} stateUserData={location.state.userData}/>
                    </div>
                    {posts}
                    {/*visible && 
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={fetch}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}>

                        {posts.map((item, index) => (
                            
                            <FeedPost key={item.id}
                                id={item.id}
                                img={item.photoName}
                                profilePhoto={item.profilePhotoUrl}
                                profileInformation={item.profileInformation}
                                title={item.title}
                                nome={item.userName}
                                horario={formatDate(item.hour)}
                                conteudo={item.text}
                                emailUser={item.userEmail}
                                profileId={item.profileId}
                                like={item.views}
                                share={item.share}
                                coments={item.coments}
                                tipo={item.typePost}
                                stateFirstLogin={location.state.firstLogin}
                                stateProfilePhoto={location.state.profilePhoto} 
                                stateCoverPhoto={location.state.coverPhoto} 
                                stateUserData={location.state.userData}/>
                        ))}
                    </InfiniteScroll>
                        */}
                </div>
                <Modal title='Publicar' isOpen={isPostOpen} onClose={closeModal} size='medium'>
                    <Modal.Content>
                        <form className="form">
                            <div className="row">
                                <div className="radioButtonsForm">
                                    <div className="form-check">
                                        <label>
                                            <input
                                                type="radio"
                                                name="react-tips"
                                                value="text"
                                                checked={type === "text"}
                                                onChange={(e) => typeHandler(e.target.value)}
                                                className="form-check-input"/>
                                            Texto
                                        </label>
                                        </div>

                                        <div className="form-check">
                                        <label>
                                            <input
                                                type="radio"
                                                name="react-tips"
                                                value="photo"
                                                checked={type === "photo"}
                                                onChange={(e) => typeHandler(e.target.value)}
                                                className="form-check-input"/>
                                            Imagem
                                        </label>
                                        </div>

                                        <div className="form-check">
                                        <label>
                                            <input
                                                type="radio"
                                                name="react-tips"
                                                value="video"
                                                checked={type === "video"}
                                                onChange={(e) => typeHandler(e.target.value)}
                                                className="form-check-input"/>
                                            Video
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <div className="div__description">
                                        <label>Descrição</label>
                                        <textarea id="textInpt" onChange={()=>setTextField(document.getElementById("textInpt").value.toString())} className="post-text" height="auto" cols="20" spellCheck="true" wrap="hard" placeholder="Ex.: tópicos, programa, etc." maxLength={500} style={{height:"100px"}}></textarea>
                                        <div style={{float:"right"}}>Caracteres restantes:
                                            {isEmpty(textField) ? 500 : 500 - textField.length}
                                        </div>
                                    </div>
                                </div>
                            
                                {field}
                                {media}
                            </div>
                        </form>
                    </Modal.Content>
                    <Modal.Footer>
                        <div className="div__btn_post">
                            {button}
                        </div>
                    </Modal.Footer>
                </Modal>
            </homeRefreshContext.Provider>
        </div>
    )

    function loadData(){
        setData({ 
            id: location.state.userData.id,
            userName: location.state.userData.userName,
            profileInformation: location.state.userData.profileInformation,
            details: location.state.userData.details,
            region: location.state.userData.region,
            city: location.state.userData.city })
        
        //update imagem profile
        if(isEmpty(location.state.profilePhoto)) { 
            setUrlImageProfile(user); 
        } 
        else {
            if(isURL(location.state.profilePhoto)){
                setUrlImageProfile(location.state.profilePhoto)
            } else {
                storage.ref("profile_images/" + location.state.profilePhoto).getDownloadURL().then(url => {
                    setUrlImageProfile(url);
                    
                    api.put('/profile/update', {
                        "id": location.state.userData.id,
                        "city": location.state.userData.city,
                        "details": location.state.userData.details,
                        "coverPhoto": location.state.coverPhoto,
                        "profileInformation": location.state.userData.profileInformation,
                        "profilePhoto": url,
                        "emailUser": emailUser,
                        "region": location.state.userData.region,
                        "userName": location.state.userData.userName
                    })
                    .catch(error => console.log(error))
                    .finally(()=>{
                        setProfImageUpdated(true);
                    })      
                })
            }
        }

        //update imagem cover
        if(!isEmpty(location.state.coverPhoto)){
            if (isURL(location.state.coverPhoto)){
                setUrlImageCover(location.state.coverPhoto)
            } else {
                storage.ref("profile_images/" + location.state.coverPhoto).getDownloadURL().then(url => {  
                    setUrlImageCover(url);

                    api.put('/profile/update', {
                        "id": location.state.userData.id,
                        "city": location.state.userData.city,
                        "details": location.state.userData.details,
                        "coverPhoto": url,
                        "profileInformation": location.state.userData.profileInformation,
                        "profilePhoto": location.state.profilePhoto,
                        "emailUser": emailUser,
                        "region": location.state.userData.region,
                        "userName": location.state.userData.userName
                    })
                    .catch(error => console.log(error))
                    .finally(()=>{
                        setCoverImageUpdated(true);
                    })        
                })
            }
        }
        
        setLoaded(true);
        setHomeRefresh(!homeRefresh);
    }

    function fetchContent(){
        api.get('/content/getContent/',{
            params : {
                page: page,
                size: 20
            }
        })
        .then((response)=>{        
            setPosts(
                <div>
                    {
                        response.data.content.map((item) => (     
                            <FeedPost key={item.id}
                                id={item.id}
                                img={item.photoName}
                                profilePhoto={item.profilePhotoUrl}
                                profileInformation={item.profileInformation}
                                title={item.title}
                                nome={item.userName}
                                horario={formatDate(item.hour)}
                                conteudo={item.text}
                                emailUser={item.userEmail}
                                profileId={item.profileId}
                                like={item.likes}
                                share={item.share}
                                coments={item.comments}
                                tipo={item.typePost}
                                stateFirstLogin={location.state.firstLogin}
                                stateProfilePhoto={location.state.profilePhoto} 
                                stateCoverPhoto={location.state.coverPhoto} 
                                stateUserData={location.state.userData}
                                origin="home"/>
                        ))
                    }
                    <div className='more_button'>
                        <IoChevronDownCircleOutline className='more_button_icon'/>
                    </div>
                </div>    
            );
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    function clickButtonHandle(){
        setField(<div><br/></div>);
        console.log(type);
        
        let text;
        try { text = document.getElementById("textInpt").value.toString()}
        catch { text = ""}

        let photo;
        try { photo = document.getElementById("imgInpt").files[0] }
        catch { photo = "" }
        
        let link;
        try { link = document.getElementById("linkInpt").value.toString() }
        catch { link = "" }
        
        if (!isEmpty(photo)){
            console.log("POST_PHOTO");
            setButton(<button type="button" disabled={true}> <img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}}/> </button>)
            setErrorMessage(<></>)

            let timestamp = new Date();
            let fileName = emailUser + "_" + timestamp.getTime() + "." + photo.name.split(".").pop();           

            storage.ref("images/"+ fileName).put(photo).then(()=>{
                api.post('/content/post-content', {
                    userEmail: emailUser,
                    photoName: fileName,
                    text: text,
                    title: fileName,
                    views: 0,
                    hour: timestamp,
                    publicPost: true,
                    share:0,
                    typePost: "POST_PHOTO"
                    }
                ).then((docRef) => {
                    console.log(docRef);
                    setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>);
                    closePost();
    
                }).catch((error) => {
                    console.error("Error adding document: ", error);
                    notyf.error("Opa, ocorreu um erro. Favor tentar novamente mais tarde");
                    setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>);
                    setHomeRefresh(!homeRefresh);
                })
                .finally(()=>{
                    setHomeRefresh(!homeRefresh);
                })
            });
        }
        
        if (!isEmpty(link)){
            console.log("POST_VIDEO");
            setButton(<button type="button" disabled={true}> <img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}}/> </button>)
            setErrorMessage(<></>)

            api.post('/content/post-content', {
                userEmail: emailUser,
                photoName: link,
                text: text,
                title: "video",
                views: 0,
                hour: new Date(),
                publicPost: true,
                share:0,
                typePost: "POST_VIDEO"
            }
            ).then((docRef) => {
                console.log(docRef);
                setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>);
                closePost();

            }).catch((error) => {
                console.error("Error adding document: ", error);
                notyf.error("Opa, ocorreu um erro. Favor tentar novamente mais tarde");
                setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>);
                setHomeRefresh(!homeRefresh);
            })
            .finally(()=>{
                setHomeRefresh(!homeRefresh);
            })

        }
        
        if( isEmpty(link) && isEmpty(photo) && !isEmpty(text)){
            console.log("POST_TEXT");
            setButton(<button type="button" disabled={true}> <img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}}/> </button>)
            api.post('/content/post-content', {
                userEmail: emailUser,
                text: text,
                views: 0,
                hour: new Date(),
                publicPost: true,
                share:0,
                typePost: "POST_TEXT"
            }
            ).then((docRef) => {
                console.log(docRef);
                setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>);
                closePost();

            }).catch((error) => {
                console.error("Error adding document: ", error);
                notyf.error("Opa, ocorreu um erro. Favor tentar novamente mais tarde");
                setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>)
            })
            .finally(()=>{
                    setHomeRefresh(!homeRefresh);
                })
                
        }
    }

    function typeHandler(type){
        switch(type){
            case "text":
                setType("text");
                setMedia(<></>);
            break
            
            case "photo":
                setType("photo");
                setMedia(
                    <div className="media">
                        <label>Carregar imagem</label>
                        <input id="imgInpt" onChange={(e)=>{setFile(e.target.value[0])}} type="file" className="form-control" accept=".jpg, .png, .jpeg, .bmp"/>
                        {errorMessage}
                    </div>
                )
            break

            case "video":
                setType("video");
                setMedia(
                    <div className="media">
                        <label>Link do video</label>
                        <input id="linkInpt" type="text" className="video" style={{width : "85vh"}}/>
                        {errorMessage}
                    </div>
                )
            break
        }
    }

    function closeModal(){
        closePost();
        setHomeRefresh(!homeRefresh);
    }
}

export const homeRefreshContext = createContext();