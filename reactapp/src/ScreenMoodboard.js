import React, {useState, useEffect} from 'react';
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Row, Col } from 'react-bootstrap';
import NavBar from "./navbar";
import interact from 'interactjs'
import html2canvas from 'html2canvas';



function Moodboard(props) {
const [wishlist, setWishlist] = useState([props.wishlist])
const [moodboardPictures, setMoodboardPictures] = useState([])

useEffect(() => {
  setWishlist(props.wishlist) // mise à jour de la wishlist sur la mise à jour du store 
}, [props.wishlist])

var inspo = props.userPaletteFromStore.inspirations
console.log(inspo)

var handleClickAddArticle = (imageUrl) => {
    if (moodboardPictures.length < 6 ){
setMoodboardPictures([...moodboardPictures, imageUrl])}

}

// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end (event) {
        var textEl = event.target.querySelector('p')

        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
      }
    }
  })

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener

//////// MAP DES ARTICLES EN WISHLIST ////////
var displayWishlist = wishlist.map((article,i) => {
  return (
    <div   className="cardMoodboard draggable" > 
       <div  className='productMoodboard' >
         <img   style={{maxWidth:'100%', maxHeight: '100%'}} src={article.imageUrl}  alt='product' /> 
        </div>
        <img  style={{height:'15px', width:'15px', marginBottom:'3px', cursor:'pointer'}} src='./plus.svg' onClick={() => {handleClickAddArticle(article.imageUrl)}}/>
  </div>
  )
})

var displayPalette = props.userPaletteFromStore.colors.map((color, i) => {
    return (
    <div key={i}  className='colorMoodboard' style={{backgroundColor:`${color}`}}> 
    </div>) }
    )
  
var displayArticles = moodboardPictures.map((url, i) => {
    return (
    <Col style={{display:'flex', justifyContent:'center', marginBottom:'10px'}} md={4}lg={4}> 
        <img src={url} className='imageMoodboard' alt='product' /> 
    </Col>
     ) }
)    


var listInspo = [];
for (var i=0; i<3; i++) {
 listInspo.push(props.userPaletteFromStore.inspirations[i])
}

    var displayInspo = listInspo.map((photo, i) => {
    return (
          <img style={{maxWidth:'20vh'}} src={photo} alt='inspo' /* crossorigin="use-credentials" *//>
      )
    })  

var handleClickScreen = () => {
     
    html2canvas(document.querySelector('#MoodBoard')).then(function(canvas) {
        
        saveAs(canvas.toDataURL(), 'file-name.png');
    });
}

function saveAs(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
      link.href = uri;
      link.download = filename;

      //Firefox requires the link to be in the body”
      document.body.appendChild(link);

      //simulate click
      link.click();

      //remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  }

  

if (wishlist.length !== 0){  // SI LA WISHLIST EST N'EST PAS VIDE 
    return (
      <div className='backgroundWishlist'>
      <NavBar/>
      <div style={{height: '3vh', backgroundColor: '#203126'}}></div>


      <div  style={{backgroundColor:'#FCFBF6', paddingTop: '11px'}}> 

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <button className="inputWishlistNonConnecte" onClick={handleClickScreen}>Télécharger Moodboard</button>
          <Link to="/shoppinglist">
              <button className="inputWishlist">Voir ma shopping list</button>
          </Link>
        </div>
       
     <Container fluid={true}  className='containerMoodboard'> 

        <div  id='Moodboard' className='MoodboardSpace'> 
        <div className='InspoBox'> {displayInspo} </div> 
             <div className='LeftMoodboard'>   
                
                    <h4 className='MoodboardTitle'> MON SALON {props.userPaletteFromStore.name.toUpperCase()}</h4>
                    
                  
                     
                
                <div className='MoodboardBox' > 
                
                    <Row className='MoodboardRow'> {displayArticles} </Row>
                        
                    
                </div> 
                
             </div>
            
                
                <div className='MoodboardPalette'>
                    {displayPalette} 
                </div>
           
        </div>




        <div  className="containerMoodboardArticles" > 
          <div className="wishlist-text" > 
              <div className="wishlist-title">
                <h4 className="h4style">
                VOS ARTICLES
                </h4>
              </div>
          </div>
       
          <Row  style={{ display:'flex', justifyContent: 'center', overflowY:'scroll', height:'60vh'}}> 
            {displayWishlist}
          </Row>

        </div> 
        </Container>
        </div>  
      </div>
      
    );}
    else if (props.token !== null) {  //SI USER CONNECTE MAIS WISHLIST VIDE 
      return ( 
      <div className="background">
        <NavBar/>
        <div style={{height: '3vh', backgroundColor: '#203126'}}></div>

        <div style={{dislpay:'flex', backgroundColor:'#FCFBF6',paddingTop:'3vh', paddingBottom:'3vh', height:'100vh' }}> 
          <p className="messageWishlist" >Wishlist vide</p> 
         
            <Link style={{display: 'flex', justifyContent:'center', alignItems: 'center'}} to="/shoppinglist">
              <button className="inputWishlistNonConnecte">Voir ma shopping list</button>
            </Link>
        </div>  
    </div>
    ) 
    } else { 
        return ( <Redirect to='/'/>)
    }
  }
 
  
function mapStateToProps(state) {
  return { userPaletteFromStore: state.palette, token: state.token, wishlist:state.wishlist };
}

function mapDispatchToProps(dispatch){
  return {
    addToWishlist: function(wishlist){
        dispatch({type: 'addWishlist', wishlist:wishlist})
    },
    deleteArticle : function(index){
      dispatch({type: 'deleteArticle', index:index})
  },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Moodboard);