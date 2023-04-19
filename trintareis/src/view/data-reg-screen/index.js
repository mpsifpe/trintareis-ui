import './data-reg-screen.css'
import React, {useState, useEffect} from 'react';
import api from '../../config/api';

export default function DataRegistryScreen(){

    const [registry, setRegistry] = useState("");
    const onRegistryOptionChange = e => {
        setRegistry(e.target.value);
        chooseFields(e.target.value);
    }

    const [category, setCategory] = useState("");
    const [message, setMessage] = useState("");
    // const [institutions, setInstittutions] = useState({});
    const [courseList, setCourseList] = useState([{}]);
    const [instCourse, setInstCourse] = useState({});

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
    const [instName, setInstName] = useState("");

    useEffect(() => {
        const abortController = new AbortController()       
        
        api.get('/course')
        .then((response) => {
            console.log(response.data)
            setCourseList(
                response.data.map(course => <option value={course.id}>{course.title}</option>)
            )
        })
        .catch((error)=>{
            console.log(error);
            setMessage("erro ao buscar cursos")
        })

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

    function cadastraCurso(){
        console.log(courseDesc);
        console.log(courseTitle);
        console.log(category);

        api.post('/course', {
            "description": courseDesc,
            "title": courseTitle,
            "category": category
        }).
        then((()=>{
            setMessage("cadastrado com sucesso")
        }))
        .catch(()=>{
            setMessage("erro")
        })
    }

    function cadastraPersonalizacao(){
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

    function cadastraInstituicao(){
        api.post('/profile/create', {
            userName: instName,
            profileType: "INSTITUTIONAL"
        })
        .then((()=>{
            setMessage("cadastrado com sucesso")
        }))
        .catch(()=>{
            setMessage("erro")
        })
    }

    function clearAll(){
        setMessage("");
        chooseFields("clear");
        setCategory("");
        setRegistry("");
        setCourseDesc("");
        setCourseTitle("");
        setInstID("");
        setCourseID("");
        setPersonalizationDesc("");
        setPersonalizationLink("");
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
                <select className="formInst" name="institution" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categoryList.map((cat, i) => <option key={i} value={cat} >{cat}</option>)}
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
                </form>
                <br/>
                <button onClick={cadastraCurso}>CADASTRAR</button><br/>
            </div>
        )
    }

    function personalizationForm(){
        return(
            personalizRegVisible &&
            <div>
                <form>
                    <p><strong>Cadastro de personalização de curso para instituições</strong></p>
                    <div>
                        <label>Instituição</label><br/>
                        <select className="formInst" name="courses" placeholder="Selecione" defaultValue="Selecione">
                            <option value="Selecione">Selecione</option>
                            {courseList}
                        </select>
                    </div>
                    <fieldset>
                        <label>Link</label><br/>
                        <input className='formInput' onChange={(e) => setPersonalizationLink(e.target.value)} value={personalizationLink} type="text"/>
                    </fieldset>
                    <fieldset>
                        <label>Descrição personalizada</label><br/>
                        <textarea onChange={(e) => setPersonalizationDesc(e.target.value)} value={courseDesc} rows='10' cols='100'/>
                    </fieldset>
                </form>
                <button onClick={cadastraPersonalizacao}>CADASTRAR</button><br/>
            </div>
        )
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
                <button onClick={cadastraInstituicao}>CADASTRAR</button><br/>
            </div>
        )
    }
}

/*
<div>
                        <select className="formInst" name="institution" placeholder="Selecione">
                            <option onClick={()=>{setInstID("641d02e37b01cb5c26d78353")}}>UFPE</option>
                            <option onClick={()=>{setInstID("641d03457b01cb5c26d78354")}}>UFRPE</option>
                            <option onClick={()=>{setInstID("641d03967b01cb5c26d78355")}}>IFPE</option>
                            <option onClick={()=>{setInstID("641d03b47b01cb5c26d78356")}}>IFPE-JAB</option>
                            <option onClick={()=>{setInstID("641d03de7b01cb5c26d78357")}}>IFPE-AFI</option>
                            <option onClick={()=>{setInstID("641d04077b01cb5c26d78358")}}>UPE</option>
                            <option onClick={()=>{setInstID("641d04bc7b01cb5c26d78359")}}>UFRPE-UAST</option>
                        </select>
                    </div>
                    */