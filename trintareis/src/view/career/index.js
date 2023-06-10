import './career.css';
import React, {useEffect, useContext, useState, useCallback} from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { Calendar } from '@natscale/react-calendar';
import '@natscale/react-calendar/dist/main.css';

import api from '../../config/api';
import Header from '../../components/header/index';
import CoachCard from '../../components/coach-card';
import CourseCard from '../../components/course-card';
import NotyfContext from '../../components/notyf-toast/NotyfContext';
import Modal from '../../components/modal/Modal';
import useModalState from '../../hooks/useModalState';

export default function Career() {

    const notyf = useContext(NotyfContext);
    const [courseList, setCourseList] = useState([]);
    const [cardList, setCardList] = useState(<div> </div>);
    const [redirect, setRedirect] = useState(<></>);
    const [loaded, setLoaded] = useState(false);
    const [update, setUpdate] = useState(false);
    
    //---------------------- variáveis do mock de coach-------------------------------------
    const [isCoach1Open, openCoach1, closeCoach1] = useModalState();
    const [isCoach2Open, openCoach2, closeCoach2] = useModalState();
    const [isCoach3Open, openCoach3, closeCoach3] = useModalState();

    let coach1Name = "Fernando Ferreira";
    let coach1Info = "Coach de carreira";
    let coach1Details = "Orientação de carreira acadêmica e profissional";
    let coach1Pic = "https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/profile_images%2Ffernando%20ferreira%20profile.jpg?alt=media&token=03cbaf87-d77e-4357-8229-2778cd72f22c&_gl=1*1iz2zo1*_ga*MjQwMjAzNTAwLjE2MzY4MzA5Mzg.*_ga_CW55HF8NVT*MTY4NTc2MzM4Ny42LjEuMTY4NTc2Mzg0Ni4wLjAuMA..";

    let coach2Name = "Marcos Marques";
    let coach2Info = "Psicólogo";
    let coach2Details = "Psicologia voltada a empresas / Orientação vocacional";
    let coach2Pic = "https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/profile_images%2Fmarcos%20marques%20profile.jpg?alt=media&token=e4f18ab3-29a7-4c4b-8e6f-3829fb53e529&_gl=1*ttgem1*_ga*MjQwMjAzNTAwLjE2MzY4MzA5Mzg.*_ga_CW55HF8NVT*MTY4NTc2MzM4Ny42LjEuMTY4NTc2MzY5OC4wLjAuMA..";

    let coach3Name = "Zelda Alves";
    let coach3Info = "Psicóloga";
    let coach3Details = "Orientação vocacional";
    let coach3Pic = "https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/profile_images%2Fzelda%20alves%20profile.jpg?alt=media&token=c7753275-6cdc-4cfd-828e-26cb664e0daa&_gl=1*1azdm5o*_ga*MjQwMjAzNTAwLjE2MzY4MzA5Mzg.*_ga_CW55HF8NVT*MTY4NTc2MzM4Ny42LjEuMTY4NTc2MzQzMS4wLjAuMA.."

    const [date, setDate] = useState([]);
    const monthsLabel = {0: 'janeiro',1: 'fevereiro',2: 'março',3: 'abril',4: 'maio',5: 'junho',6: 'julho',7: 'agosto',8: 'setembro',9: 'outubro',10: 'novembro',11: 'dezembro'};
    const weekDaysLabel = {0: 'Dom',1: 'Seg',2: 'Ter',3: 'Qua',4: 'Qui',5: 'Sex',6: 'Sab'};
    const isDisabled = useCallback((date) => {
        // disable wednesdays and any date that is divisible by 5
        if (date.getDay() === 3 || date.getDate() % 5 === 0) { return true }
      }, []);
    //-----------------------------------------------------------
    let location = useLocation();

    useEffect(()=>{
        let abortController = new AbortController();

        if(!loaded){
            fetch();
        } else {
            setCardList(<div> </div>);
            setCardList(
                courseList.map(course => (
                    <div className='course_div'>
                        <CourseCard 
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            description={course.description}
                            stateFirstLogin={location.state.firstLogin}
                            stateProfilePhoto={location.state.profilePhoto} 
                            stateCoverPhoto={location.state.coverPhoto} 
                            stateUserData={location.state.userData}
                            type="course"
                        />
                    </div>
                ))
            )
        }

        return function cleanup() {
            abortController.abort();
        }  
    },[update]);

    return (
        <div className="App">
            {redirect}
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData} origin="career"/>
            <div className='career'>
                <div className='info'>
                    <span> 
                        Aqui você encontra informações sobre cursos e onde são ofertados.<br/><br/>
                        Aproveite para explorar possibilidades! Quem sabe se interesse por algo que você nunca pensou?<br/><br/>
                        Caso tenha dúvidas sobre o que deseja seguir na sua carreira, talvez um coach ou orientador de carreira pode ajudá-lo!
                    </span>
                </div>
                <div className="div__main_career">
                    <div className="div__title_career">
                        <span>Cursos</span>
                    </div>
                    <div className='content'>
                        <span className='note'>Ordenar</span>
                        <select className="sortSelector" id="sort-selector">
                            <option key='az' onClick={()=>{sortHandler("alfabetically")}} value="alfabetically">A-Z</option>
                            <option key='za' onClick={()=>{sortHandler("alfabeticallyReverse")}} value="alfabeticallyReverse">Z-A</option>
                        </select>

                        <section className="section_course_list" id="sec-bd5e">
                            {cardList}
                        </section>
                        
                        {/* mock */}
                        <div className="div__title_career">
                            <span><br/>Orientação vocacional</span>
                        </div>
                        <section className="section_coach_list" id="sec-bd5e">
                            <div onClick={openCoach1}>
                                <CoachCard 
                                    key = {1}
                                    profileId = {1}
                                    nome = {coach1Name}
                                    details = {coach1Details}
                                    profileInfo = {coach1Info}
                                    pic = {coach1Pic}/>
                            </div>
                            <div onClick={openCoach2}>
                                <CoachCard 
                                    key = {2}
                                    profileId = {2}
                                    nome = {coach2Name}
                                    details = {coach2Details}
                                    profileInfo = {coach2Info}
                                    pic = {coach2Pic}/>
                            </div>
                            <div onClick={openCoach3}>
                                <CoachCard 
                                    key = {3}
                                    profileId = {3}
                                    nome = {coach3Name}
                                    details = {coach3Details}
                                    profileInfo = {coach3Info}
                                    pic = {coach3Pic}/>
                            </div>
                        </section>
                        <Modal title='Orientação de carreira' isOpen={isCoach1Open} onClose={closeCoach1} size='large'>
                            <Modal.Content>
                                <form className="form">
                                    <div className="row">
                                        <div className="main_modal_div">
                                            <div className="div__image">
                                                <img className="friend-img" src={coach1Pic} alt="user image"/>
                                            </div>
                                            <div className="div__description">
                                                <span className="coach_name">{coach1Name}</span>
                                                <span className="coach_info">{coach1Info}</span>
                                                <span className="coach_details">{coach1Details}</span>
                                            </div>
                                        </div>
                                        <div className="div_calendar">
                                            <span className="coach_info">Disponibilidade<br/></span>
                                            <Calendar showDualCalendar isRangeSelector={true} value={date} onChange={(d)=>setDate(d)} isDisabled={isDisabled} weekDaysLabel={weekDaysLabel} monthsLabel={monthsLabel}/>
                                        </div>
                                        <span style={{color: 'red'}}>Esta tela é um exemplo, esta funcionalidade ainda não está disponível</span>
                                    </div>  
                                </form>
                            </Modal.Content>
                            <Modal.Footer>
                                <div className="div__btn_post">
                                    <button onClick={notifyDev}>Entrar em contato</button>
                                </div>
                            </Modal.Footer>
                        </Modal>
                        <Modal title='Orientação de carreira' isOpen={isCoach2Open} onClose={closeCoach2} size='large'>
                            <Modal.Content>
                                <form className="form">
                                    <div className="row">
                                        <div className="main_modal_div">
                                            <div className="div__image">
                                                <img className="friend-img" src={coach2Pic} alt="user image"/>
                                            </div>
                                            <div className="div__description">
                                                <span className="coach_name">{coach2Name}</span>
                                                <span className="coach_info">{coach2Info}</span>
                                                <span className="coach_details">{coach2Details}</span>
                                            </div>
                                        </div>
                                        <div className="div_calendar">
                                            <span className="coach_info">Disponibilidade<br/></span>
                                            <Calendar showDualCalendar isRangeSelector={true} value={date} onChange={(d)=>setDate(d)} isDisabled={isDisabled} weekDaysLabel={weekDaysLabel} monthsLabel={monthsLabel}/>
                                        </div>
                                        <span style={{color: 'red'}}>Esta tela é um exemplo, esta funcionalidade ainda não está disponível</span>
                                    </div>  
                                </form>
                            </Modal.Content>
                            <Modal.Footer>
                                <div className="div__btn_post">
                                    <button onClick={notifyDev}>Entrar em contato</button>
                                </div>
                            </Modal.Footer>
                        </Modal>
                        <Modal title='Orientação de carreira' isOpen={isCoach3Open} onClose={closeCoach3} size='large'>
                            <Modal.Content>
                                <form className="form">
                                    <div className="row">
                                        <div className="main_modal_div">
                                            <div className="div__image">
                                                <img className="friend-img" src={coach3Pic} alt="user image"/>
                                            </div>
                                            <div className="div__description">
                                                <span className="coach_name">{coach3Name}</span>
                                                <span className="coach_info">{coach3Info}</span>
                                                <span className="coach_details">{coach3Details}</span>
                                            </div>
                                        </div>
                                        <div className="div_calendar">
                                            <span className="coach_info">Disponibilidade<br/></span>
                                            <Calendar showDualCalendar isRangeSelector={true} value={date} onChange={(d)=>setDate(d)} isDisabled={isDisabled} weekDaysLabel={weekDaysLabel} monthsLabel={monthsLabel}/>
                                        </div>
                                        <span style={{color: 'red'}}>Esta tela é um exemplo, esta funcionalidade ainda não está disponível</span>
                                    </div>  
                                </form>
                            </Modal.Content>
                            <Modal.Footer>
                                <div className="div__btn_post">
                                    <button onClick={notifyDev}>Entrar em contato</button>
                                </div>
                            </Modal.Footer>
                        </Modal>
                    {/* mock */}
                    
                    </div>
                </div>
            </div>
        </div>
    )

    function fetch(){
        //------------------ fetch cursos -----------------------
        api.get('/course')
        .then((response) => {
            setCourseList(
                response.data.sort((a, b) => {
                let fa = a.title.toLowerCase(),
                    fb = b.title.toLowerCase();
            
                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
                })
            )
            setLoaded(true);
            setUpdate(!update);
        })
        .catch((error)=>{
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro")
            setRedirect(<Redirect to={{ pathname: '/home', state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData , origin: "career-error"}}}/>)
        })
    }

    function sortHandler(s){
        let list = courseList;
        switch(s){
            case "alfabeticallyReverse":
                setCourseList(
                    list.sort((a, b) => {
                        let fa = a.title.toLowerCase(),
                            fb = b.title.toLowerCase();
                    
                        if (fa > fb) {
                            return -1;
                        }
                        if (fa < fb) {
                            return 1;
                        }
                        return 0;
                    })
                );
                setUpdate(!update);
                break;

            case "alfabetically":
                setCourseList(
                    list.sort((a, b) => {
                        let fa = a.title.toLowerCase(),
                            fb = b.title.toLowerCase();
                    
                        if (fa < fb) {
                            return -1;
                        }
                        if (fa > fb) {
                            return 1;
                        }
                        return 0;
                    })
                );
                setUpdate(!update);
                break;
        }
    }

    function notifyDev(){
        notyf.open({
            type: 'info',
            message: 'Em desenvolvimento'
        })
    }
};