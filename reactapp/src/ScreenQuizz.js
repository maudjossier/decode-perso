import React, {useState, } from 'react';
import {Redirect} from "react-router-dom";
import NavBar from "./navbar";
import {connect} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Row, Col } from 'react-bootstrap';



function Quiz(props) {
  const [progressBarWidth, setProgressBarWidth] = useState(14)
  const [clickCount, setCount] = useState(0)
  const [answer, setAnswer ] = useState()
  const [answersArray, setAnswersArray] = useState([])
  const [isPhoto1Selected, set_isPhoto1Selected] = useState(false)
  const [isPhoto2Selected, set_isPhoto2Selected] = useState(false)
  const [isPhoto3Selected, set_isPhoto3Selected] = useState(false)
  const [isPhoto4Selected, set_isPhoto4Selected] = useState(false)
  const [error, setError] = useState('')
  const [buttonValider, setButtonValider] = useState(false)
  
    // données du qestionnaire 
  var dataQuestions = [
      {question : 'Parmi ces matériaux et tissus, lequel préférez-vous ?', 
        photo1: {
            url: '1lin.png', 
            name: 'ethnique'},
        photo2: {
            url: '1boisFonce.png',
            name: 'bohème'},
        photo3:{
             url: '1velours.png',
            name: 'artDeco'},
        photo4: {
            url: '1marbre.png',
            name: 'modernMinimal'}
        },
        {question : "Vous souhaitez avoir une ambiance..." ,
        photo1: {
            url: '2ethnique.png', 
            name: 'ethnique'},
        photo2: {
            url: '2boheme.png',
            name: 'bohème'},
        photo3:{
             url: '2artdeco.png',
            name: 'artDeco'},
        photo4: {
            url: '2modern.png',
            name: 'modernMinimal'}
        },
        {question : 'Parmi les styles de décorations suivants, lequel préférez-vous ?', 
        photo1: {
            url: 'ambiance-ethnique.png', 
            name: 'ethnique'},
        photo2: {
            url: 'ambiance-boheme.png',
            name: 'bohème'},
        photo3:{
            url: 'ambiance-artDeco.png',
            name: 'artDeco'},
        photo4: {
            url: 'ambiance-minimal.png',
            name: 'modernMinimal'}
        },
        {question : 'Parmi les éclairages suivants, lequel préférez-vous ?', 
        photo1: {
            url: '4ethnique.png', 
            name: 'ethnique'},
        photo2: {
            url: '4boheme.png',
            name: 'bohème'},
        photo3:{
            url: '4artdeco.png',
            name: 'artDeco'},
       photo4: {
            url: '4modern.png',
            name: 'modernMinimal'}
        }, 
        {question : 'Vous cherchez un nouveau meuble. Votre choix se tourne vers...', 
        photo1: {
            url: '5boutique.png', 
            name: 'ethnique'},
        photo2: {
            url: '5brocante.png',
            name: 'bohème'},
        photo3:{
            url: '5grandeenseigne.png',
            name: 'artDeco'},    
        photo4: {
            url: '5designer.png',
            name: 'modernMinimal'}
        },
        {question : 'Vous devez choisir un nouveau canapé. Vous choisissez...', 
        photo1: {
            url: '6canape-ethnique.png', 
            name: 'ethnique'},
        photo2: {
            url: '6canape-boheme.png',
            name: 'bohème'},
        photo3:{
            url: '6canape-artDeco.png',
            name: 'artDeco'},
        photo4: {
            url: '6canape-minimal.png',
            name: 'modernMinimal'}
        },
        { question: 'Quel est le revêtement idéal pour le salon selon vous ?',
            photo1: {
            url: '7parquetclair.png', 
            name: 'ethnique'},
        photo2: {
            url: '7tomettes.png',
            name: 'bohème'},
        photo3:{
            url: '7parquetfonce.png',
            name: 'artDeco'
        },
        photo4: {
            url: '7beton.png',
            name: 'modernMinimal'}
        },
  ]

  // affichage dynamique des questions et réponses basé sur le nombre de click sur les boutons suivant / retour 
  var currentQuestion = dataQuestions[clickCount]
 

  /////////// AU CLICK SUR LE BOUTON ">>" ///////////
  var  handleClickIncreaseWidth = () => {
        // si l'une des réponses est sélectionnée 
    if (isPhoto1Selected === true || isPhoto2Selected === true || isPhoto3Selected === true || isPhoto4Selected === true ) {
        if (answersArray[clickCount] === undefined ){        // si il s'agit du premier clic : on enregistre la réponse 
            var copy = answersArray 
            copy.push(answer)
            } else if (answersArray[clickCount]) {                // si revient en arrière modifie la valeur
            answersArray[clickCount] = answer 
            }
        setCount(clickCount+1)
        setProgressBarWidth(progressBarWidth+14)           //  barre de progression    
        set_isPhoto1Selected(false); set_isPhoto2Selected(false);set_isPhoto3Selected(false);set_isPhoto4Selected(false)    // déselection des images
        setError('')
    } else  { setError('Merci de sélectionner une réponse') }  // si pas de réponse sélectionnée
    }

  /////////// AU CLICK SUR LE BOUTON "<<" ///////////
  var handleClickDecreaseWidth = () => {          // gestion de la barre de progression décrémentant
        setProgressBarWidth(progressBarWidth-14)
        if (clickCount !== 0 ) {                // gestion du compteur de click / affichage question
            setCount(clickCount-1)}             // suppression du message d'erreur
            setError('')
    } 

  /////////// AU CLICK SUR LE BOUTON "VALIDER"  ///////////
  var handleClickValider = async () => {
        props.addPalette('')      // supprime le lag d'affichage de la dernière palette en store sur la page suivante   
                // même vérification que pour le bouton '>>'
        if (isPhoto1Selected === true || isPhoto2Selected === true || isPhoto3Selected === true || isPhoto4Selected === true ) {
            var copy = answersArray 
            copy.push(answer)
            setButtonValider(true)    // activation du bouton valider car réponse sélectionnée 
            const data = await fetch('/validerQuiz', {      // envoi des réponses en BDD 
                method: 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `rep1=${copy[0]}&rep2=${copy[1]}&rep3=${copy[2]}&rep4=${copy[3]}&rep5=${copy[4]}&rep6=${copy[5]}&rep7=${copy[6]}&token=${props.userToken}` 
            });
            const body = await data.json()      // réponse reçue : palette 
            props.addPalette(body.userPalette)  // ajout de l'objet dans le Store 
        } else  { setError('Merci de sélectionner une réponse') }   // si pas de réponse selectionnée 
    }

  if (buttonValider === true) {return <Redirect to='/mypalette' />}   // si le bouton valider est actif, redirection vers le résultat


    /////////// GESTION DE LA SELECTION DES REPONSES  ///////////
    var clickPhoto1 = async () => {
        if (isPhoto1Selected === false){    // mécanique pour permettre uniquement la sélection d'une seule réponse
            set_isPhoto1Selected(true)
            set_isPhoto2Selected(false)
            set_isPhoto3Selected(false)
            set_isPhoto4Selected(false)

        } else {
            set_isPhoto1Selected(false)
        }
    }
    if (isPhoto1Selected === true) {    // ajout d'une bordure si réponse sélectionnée 
        var selectBorder1 = '4px solid #9AB6A4'
        var borderRadius1 = '7%'
    }

    var clickPhoto2 = async () => {
        if (isPhoto2Selected === false){
            set_isPhoto2Selected(true)
            set_isPhoto1Selected(false)
            set_isPhoto3Selected(false)
            set_isPhoto4Selected(false)
        } else {
            set_isPhoto2Selected(false)
        }
    }
    if (isPhoto2Selected === true) {
        var selectBorder2 = '4px solid #9AB6A4'
        var borderRadius2 = '7%'
    }

    var clickPhoto3 = async () => {
        if (isPhoto3Selected === false){
            set_isPhoto3Selected(true)
            set_isPhoto2Selected(false)
            set_isPhoto1Selected(false)
            set_isPhoto4Selected(false)
        } else {
            set_isPhoto3Selected(false)
        }
    }
    if (isPhoto3Selected === true) {
        var selectBorder3 = '4px solid #9AB6A4'
        var borderRadius3 = '7%'
    }

    var clickPhoto4 = async () => {
        if (isPhoto4Selected === false){
            set_isPhoto4Selected(true)
            set_isPhoto2Selected(false)
            set_isPhoto3Selected(false)
            set_isPhoto1Selected(false)
        } else {
            set_isPhoto4Selected(false)
        }
    }
    if (isPhoto4Selected === true) {
        var selectBorder4 = '4px solid #9AB6A4';
        var borderRadius4 = '7%';
    }
    

    /////////// GESTION DE L'AFFICHAGE DES BOUTONS ///////////
    var buttons =       // boutons de base : << et >> 
    <div className= 'quizzButton'> 
    <img   className='arrow-button' src='arrow-left.png' alt='arrow left' onClick={() => handleClickDecreaseWidth()}/>
    <img  className='arrow-button' src='arrow-right.png' alt='arrow right' onClick={() => handleClickIncreaseWidth()}/>
    </div>; 

    if (clickCount === 6 ) {        // si on est à la dernière question, << et "valider"
    buttons = 
    <div className= 'quizzButton'> 
    <img src='arrow-left.png' alt='arrow left'  className='arrow-button' onClick={() => handleClickDecreaseWidth()}/>
    <button type='button' className='ButtonQuestionnaire' onClick={() => {handleClickValider()}}> Valider</button>
    </div> } 

    else if (clickCount === 0) {    // si on est à la première question uniquement >>
    buttons = 
    <div className= 'quizzButton'> 
    <img className="arrow-button" src='arrow-right.png' alt='arrow left' 
    onClick={() => handleClickIncreaseWidth()}/>
    </div>; }


/////////// GESTION DE L'AFFICHAGE DU MESSAGE D'ERREUR ///////////
  if (error !== null) {
    <p className="ErrorQuiz"> {error}</p> 
} else {
   <div style={{height:"50vh"}}></div>
}

    return (
        <div className='background'> 
            <NavBar/>
            <div className='ScreenQuestion' > 

                <p  className='questions'> {currentQuestion.question} </p>
                <Row className= 'questionsPhoto' style={{width:'100%', marginLeft:'4px'}}  >  
                    <Col lg={3} md={6} xs={6} className='photoBox'>
                        <img className='photo'  src={currentQuestion.photo1.url} alt='ethnique'   style={{border:selectBorder1, borderRadius: borderRadius1}} onClick={()=> {setAnswer('ethnique'); clickPhoto1()}} />
                    </Col>
                    <Col lg={3} md={6} xs={6} className='photoBox'>
                        <img className='photo'  src={currentQuestion.photo2.url} alt='bohème'   style={{ border: selectBorder2,borderRadius: borderRadius2 }} onClick={()=> {setAnswer('bohème');clickPhoto2()}}/>
                    </Col>
                    <Col lg={3} md={6} xs={6} className='photoBox'>
                        <img className='photo'  src={currentQuestion.photo3.url} alt='artDeco' style={{border: selectBorder3,  borderRadius: borderRadius3}} onClick={()=> {setAnswer('artDeco');clickPhoto3()}}/>
                    </Col>
                    <Col lg={3} md={6} xs={6} className='photoBox'>
                        <img className='photo' src={currentQuestion.photo4.url} alt='modernMinimal' style={{border: selectBorder4, borderRadius: borderRadius4,}} onClick={()=> {setAnswer('modernMinimal');clickPhoto4()}}/>
                    </Col>
                </Row>

            <div className="ProgressBar" style={{ height:"3vh", display:'flex', justifyContent:'center'}} > 
                <div style={{borderBottom:'3px solid #FCFBF6', width:`${progressBarWidth}%`}}> </div> 
            </div>

            <p style={{height:'2vh'}} className="ErrorQuiz"> {error}</p> 

            {buttons} 

            </div>
     </div> 

    );
  }


  function mapStateToProps(state)
   {  return {userPaletteFromStore: state.palette, userToken: state.token}
  }

  
  function mapDispatchToProps(dispatch){
    return {
      addPalette: function(palette){
        dispatch({type: 'addPalette', palette: palette})
      }
    }
  }

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Quiz)
