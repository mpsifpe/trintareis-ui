import './data-reg-screen.css'
import React, {useState, useEffect, useContext} from 'react';

import api from '../../config/api';
import firebase from '../../config/firebase';
import NotyfContext from '../../components/notyf-toast/NotyfContext';
import { isEmpty } from '../../helpers/helper';


export default function DataRegistryScreen(){
    
    const storage = firebase.storage();
    const notyf = useContext(NotyfContext);

    const [courseData, setCourseData] = useState([]);
    const [institutions, setInstitutions] = useState([]);

    const [message, setMessage] = useState("");
    const [registry, setRegistry] = useState("");
    const onRegistryOptionChange = e => {
        setRegistry(e.target.value);
        chooseFields(e.target.value);
    }

    // visibilidade
    const [courseRegVisible, setCourseRegVisible] = useState(false);
    const [instRegVisible, setInstRegVisible] = useState(false);
    const [personalizRegVisible, setPersonalizRegVisible] = useState(false);

    //cadastro de curso
    const [courseTitle, setCourseTitle] = useState("");
    const [courseDesc, setCourseDesc] = useState("");

    //cadastro de personalização
    const [instiID, setInstID] = useState("");
    const [courseID, setCourseID] = useState("");
    const [personalizationDesc, setPersonalizationDesc] = useState("");
    const [personalizationLink, setPersonalizationLink] = useState("");

    //cadastro de instituicao
    const [instSigla, setInstSigla] = useState("");
    const [instName, setInstName] = useState("");
    const [instImage, setInstImage] = useState();

    useEffect(() => {
        const abortController = new AbortController()       
    
        api.get('/course')
        .then((response) => {
            setCourseData(response.data)
        })
        .catch((error)=>{ console.log(error) })
        //----------------------------------------------------
        api.get('/profile/get-by-profile-type?profileType=INSTITUTIONAL')
        .then((profiles) => {
            let list = []
            profiles.data.forEach((profile)=>{
                list.push([profile.id, profile.userName])
            });
            setInstitutions(list);
        })
        .catch((error) => { console.log(error) })

        //--------------------------------------------------
        notyf.success('carga finalizada');

        return function cleanup() {
            abortController.abort()
        }
    }, [])

    return (
        <div className='main'>
            <p>{message}</p>
            {registrySelector()}
            <br/>
            <div>
                {courseForm()}
                {personalizationForm()}
                {institutionForm()}
            </div><br/>
            <button onClick={clearAll}>Limpar campos</button>
        </div>
    )

    function chooseFields(option){
        switch(option){
            case "curso":
                setCourseRegVisible(true);
                setPersonalizRegVisible(false);
                setInstRegVisible(false);
                break;

            case "personalizacao":
                setCourseRegVisible(false);
                setPersonalizRegVisible(true);
                setInstRegVisible(false);
                break;

            case "clear":
                setCourseRegVisible(false)
                setPersonalizRegVisible(false)
                setInstRegVisible(false);
                break;

            case "instituicao":
                setCourseRegVisible(false)
                setPersonalizRegVisible(false)
                setInstRegVisible(true);
                break;
        }
    }

    function registrySelector(){
        return(
            <div>
                <p><strong>Tipo de cadastro</strong></p>
                <input 
                    type="radio" 
                    className="radioButton"
                    name="registry" 
                    value="curso" 
                    checked={registry === "curso"}
                    onChange={onRegistryOptionChange}/>
                    <label>Curso</label>
                <br/>
                <input 
                    type="radio"
                    className="radioButton"
                    name="registry"
                    value="personalizacao"
                    checked={registry === "personalizacao"}
                    onChange={onRegistryOptionChange}/>
                    <label>Personalização de curso</label>
                <br/>
                <input 
                    type="radio"
                    className="radioButton"
                    name="registry"
                    value="instituicao"
                    checked={registry === "instituicao"}
                    onChange={onRegistryOptionChange}/>
                    <label>Instituição</label>
            </div>
        )
    }

    function categorySelector(){
        let categoryList = [
            "ADMINISTRATION", 
            "BUSINESS",
            "EXACT_SCIENCES",
            "MARKETING_ADVERTISING",
            "AGRICULTURAL_SCIENCES",
            "BIOLOGICAL_SCIENCES",
            "HEALTH_SCIENCES",
            "EXACT_EARTH_SCIENCES",
            "ENGINEERING",
            "HUMAN_SCIENCES",
            "APPLIED_SOCIAL_SCIENCES",
            "LINGUISTICS_LETTERS_ARTS"
        ]

        return(
            <div>
                <select className="formInst" id="category-selector">
                    {categoryList.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                </select>
            </div>
        )
    }

    function levelSelector(){
        let levelList = [
            "BACHARELADO", 
            "LICENCIATURA",
            "ESPECIALIZACAO",
            "MESTRADO",
            "DOUTORADO"
        ]

        return(
            <div>
                <select className="formInst" id="category-selector">
                    {levelList.map((level, i) => <option key={i} value={level}>{level}</option>)}
                </select>
            </div>
        )
    }

    function courseForm(){
        return(
            courseRegVisible &&
            <div>
                <form>
                    <p><strong>Cadastro de novo curso</strong></p>
                    <fieldset>
                        <label className='fieldname'>Título</label><br/>
                        <input className='formInput' onChange={(e) => setCourseTitle(e.target.value)} value={courseTitle} type="text"/>
                    </fieldset>
                    <fieldset className='fieldname'>
                        <label>Descrição genérica</label><br/>
                        <textarea onChange={(e) => setCourseDesc(e.target.value)} value={courseDesc} rows='10' cols='100'/>
                    </fieldset>
                    {categorySelector()}
                    {levelSelector()}
                </form>
                <br/>
                <button onClick={cadastraCurso}>CADASTRAR</button><br/>
            </div>
        )
    }

    function cadastraCurso(){
        setMessage("")
        api.post('/course', {
            "description": courseDesc,
            "title": courseTitle,
            "category": document.getElementById('category-selector').value
        }).
        then(()=>{
            setMessage("cadastrado com sucesso")
        })
        .catch(()=>{
            setMessage("erro")
        })
    }

    function personalizationForm(){        
        return(
            personalizRegVisible &&
            <div>
                <form>
                    <p><strong>Cadastro de personalização de curso para instituições</strong></p>
                    <div>
                        <label>Curso</label><br/>
                        <select className="formInst" name="courses" placeholder="Selecione" defaultValue="Selecione">
                            <option value="Selecione">Selecione</option>
                            {courseData.map((course, index) => <option key={index} value={course.id} onChange={(e) => setCourseID(course.id)}>{course.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Instituição</label><br/>
                        <select className="formInst" name="courses" placeholder="Selecione" defaultValue="Selecione">
                            <option value="Selecione">Selecione</option>
                            { institutions.map( (i, index) => <option key={index} value={i[0]} onChange={(e) => setInstID(i[0])}> {i[1]} </option> )}
                        </select>
                    </div>
                    <fieldset>
                        <label>Link</label><br/>
                        <input className='formInput' onChange={(e) => setPersonalizationLink(e.target.value)} value={personalizationLink} type="text"/>
                    </fieldset>
                    <fieldset>
                        <label>Descrição personalizada</label><br/>
                        <textarea onChange={(e) => setPersonalizationDesc(e.target.value)} value={personalizationDesc} rows='10' cols='100'/>
                    </fieldset>
                </form>
                <button onClick={cadastraPersonalizacao}>CADASTRAR</button><br/>
            </div>
        )
    }

    function cadastraPersonalizacao(){
        setMessage("")
        api.post('/customization', {
            "institutionId": instiID,
            "courseId": courseID,
            "courseDescriptionCustomization": personalizationDesc,
            "descriptionLink": personalizationLink
        })
        .then((()=>{
            setMessage("cadastrado com sucesso")
        }))
        .catch(()=>{
            setMessage("erro")
        })
    }

    function institutionForm(){
        return(
            instRegVisible &&
            <div>
                <form>
                    <p><strong>Cadastro de instituições</strong></p>
                        <label>Sigla ou nome</label><br/>
                        <input className='formInput' onChange={(e) => setInstName(e.target.value)} value={instName} type="text"/>
                </form><br/>
                <div>
                    <label>Imagem</label><br/>
                    <input onChange={(e) => setInstImage(e.target.files[0])} type="file" style={{height:"40px"}} accept=".jpg, .png, .jpeg, .bmp"/>
                </div>
                <br/>
                <br/>
                <button onClick={cadastraInstituicao}>CADASTRAR</button>
            </div>
        )
    }

    function cadastraInstituicao(){
        setMessage("")
        if (!isEmpty(instImage)){

            let name = (instName + "_profile." + instImage.name.split(".").pop());
            
            storage.ref("profile_images/" + name).put(instImage)
                .then(()=>{
                    api.post('/profile/create', {
                        userName: instName,
                        profileImage: name,
                        profileType: "INSTITUTIONAL"
                    })
                    .then(()=>{
                        setMessage("cadastrado com sucesso")
                    })
                    .catch(()=>{
                        setMessage("erro")
                    })
                })
        }
        else{
            api.post('/profile/create', {
                userName: instName,
                profileType: "INSTITUTIONAL"
            })
            .then(()=>{
                setMessage("cadastrado com sucesso")
            })
            .catch(()=>{
                setMessage("erro")
            })
        }
        
    }
    
    function clearAll(){
        setMessage("");
        chooseFields("clear");
        setRegistry("");
        setCourseDesc("");
        setCourseTitle("");
        setInstID("");
        setCourseID("");
        setPersonalizationDesc("");
        setPersonalizationLink("");
    }
}