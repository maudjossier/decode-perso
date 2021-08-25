import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Row, Col } from 'react-bootstrap';
import NavbarFixed from '../components/navbarFixed';



function Wishlist(props) {
const [wishlist, setWishlist] = useState([props.wishlist])

useEffect(() => {
  setWishlist(props.wishlist) // mise à jour de la wishlist sur la mise à jour du store 
}, [props.wishlist])

 var handleClickDelete = async (articleID, index) => {  // gestion de la suppression des articles en BDD et store 
    await fetch('/deleteFromWishlist', {
    method: 'PUT',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `token=${props.token}&articleID=${articleID}`
  })
  props.deleteArticle(index)
 } 

//////// MAP DES ARTICLES EN WISHLIST ////////
var displayWishlist = wishlist.map((article,i) => {
  return (
    <Col md={2}lg={2} className="cardWishlist" > 
      <a href={article.merchantUrl} target="_blank" rel="noreferrer">
       <div  className='productImage' >
         <img style={{maxWidth:'100%', maxHeight: '100%'}} src={article.imageUrl}  alt='product' /> 
        </div>
      </a>
    <div className="productInfo"> 
      <div className="infoWishlist"> 
       <a href={article.merchantUrl} target="_blank" rel="noreferrer"> 
        <h5 className='articleWishList'> {article.name} </h5>
       </a>
        <h6 className='articleCardBrand'> {article.brand} </h6>
      </div>
      <div className="priceWishlist" > 
        <img src='delete.svg' alt='bin icon' style={{width: '15px', cursor:'pointer'}} onClick={() => handleClickDelete(article._id, i)}/>
        <p className='articleWishList'> {article.price}€ </p>
      </div>
    </div>
  </Col>
  )

})
  
if (wishlist.length !== 0){     // SI LA WISHLIST EST N'EST PAS VIDE 
    return (
      <div className='backgroundWishlist'>
      <NavbarFixed />
      <div className="greenBar"></div>


      <div  style={{backgroundColor:'#FCFBF6', paddingTop: '11px'}}> 

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Link to="/shoppinglist">
              <button className="inputWishlist">Voir ma shopping list</button>
          </Link>
        </div>
       
     
        <Container className="containerWishlistCard" > 
          <div className="wishlist-text" > 
              <div className="wishlist-title">
                <h4 className="h4style">
                VOTRE WISHLIST
                </h4>
              </div>
              <div> 
                <h4 style={{fontSize: '15px'}}>{props.wishlist.length} articles</h4>
              </div>
          </div>
       
          <Row  style={{ display:'flex', justifyContent: 'center'}}> 
            {displayWishlist}
          </Row>

        </Container> 
        </div>  
      </div>
      
    );}
    else if (props.token !== null) {  //SI USER CONNECTE MAIS WISHLIST VIDE 
      return ( 
      <div className="background">
        <NavbarFixed />
        <div style={{height: '17vh', backgroundColor: '#203126'}}></div>

        <div style={{dislpay:'flex', backgroundColor:'#FCFBF6',paddingTop:'3vh', paddingBottom:'3vh', height:'100vh' }}> 
          <p className="messageWishlist" >Wishlist vide</p> 
            <Link style={{display: 'flex', justifyContent:'center', alignItems: 'center'}} to="/shoppinglist">
              <button className="inputWishlistNonConnecte">Voir ma shopping list</button>
            </Link>
        </div>  
    </div>
    ) 
    } else  {   // SI USER NON CONNECTE  
      return (
      <div className="background">
        <NavbarFixed />
        <div style={{height: '17vh', backgroundColor: '#203126'}}></div>
        <div  style={{dislpay:'flex', justifyContent:'center', alignItems: 'center',backgroundColor:'#FCFBF6',paddingTop:'3vh', paddingBottom:'3vh', height:'100vh' }}> 
          <p className="messageWishlist" >Connectez vous pour accéder à votre wishlist</p> 
          <Link style={{display: 'flex', justifyContent:'center', alignItems: 'center'}} to="/login">
              <button className="inputWishlistNonConnecte">Connectez-vous</button>
          </Link>
        </div>  
        </div>
      )
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


export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);