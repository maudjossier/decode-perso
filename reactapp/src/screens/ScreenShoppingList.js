import React, {useState, useEffect} from 'react';
import { Link, Redirect} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Row, Col } from 'react-bootstrap';
import { connect } from "react-redux";
import NavbarFixed from '../components/navbarFixed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Popover, Button, Checkbox } from 'antd';


function ShoppingList(props) {
const [articleList, setArticleList] = useState([])
const [articleListFromBDD, setArticleListFromBDD] = useState([])
const [wishlist, setWishlist] = useState(props.userWishlist)
const [FilterDeco, setFilterDeco]= useState(false)
const [FilterMobilier, setFilterMobilier] = useState(false)
const [stateDeco, setStateDeco] = useState(false)
const [stateMob, setStateMob] = useState(false)

var userPalette = props.userPaletteFromStore
var likeColor = ''      // gestion de la couleur des picto coeur si dans wishlist 

////////// CHERCHER LES ARTICLES EN BDD  //////////
async function loadData() { 
  const rawResponse = await fetch('/myShoppingList', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `paletteName=${userPalette.name}`
  })
  const body = await rawResponse.json()     
  setArticleList(body.shoppingList)   // Mettre les articles dans un état dynamique qui va être utilisé pour filtrer 
  setArticleListFromBDD(body.shoppingList)  // Mettre les articles dans un état ArticleListFromBDD qui ne changera pas 
}

useEffect( () => {
  loadData()
 }, []);

////////// WISHLIST //////////
 useEffect( () => {
  setWishlist(props.wishlist)
  console.log('wishlist from store', props.wishlist)
 }, [props.wishlist]);


 ////////// AJOUTER OU SUPPRIMER UN ARTICLE EN WISHLIST  //////////
 var handleClickWishList = (articleID) => {
    var resultFilter = wishlist.find(wishlist => wishlist._id === articleID)   // vérification que l'article existe en wishlist avec son id 

      if (!resultFilter) {      // l'article n'est pas en wishlist, on l'ajoute en BDD et au store 
      async function addToWishlist() {
        const rawResponse = await fetch('/addToWishlist', {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `token=${props.token}&articleID=${articleID}`,
        })
        const response = await rawResponse.json()
        props.addToWishlist(response.wishlist)  // réponse : wishlist mise à jour 
      }
      addToWishlist()

      } else {      // l'article existe dans la wishlist, on le supprime en BDD et store 
      async function deleteArticle() {    
        const deleteArticle = await fetch('/deleteFromWishlist', {
          method: 'PUT',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: `token=${props.token}&articleID=${articleID}`,
        })
        const updateWishlist = await deleteArticle.json() 
        props.addToWishlist(updateWishlist.wishlist)  // réponse : wishlist mise à jour 
      }
      deleteArticle()
      } 
  }  

 ////////////////// MAP DES ARTICLES TROUVES EN BDD /////////////////
 if (props.userPaletteFromStore === '' ) {        // si il n'y a rien dans la liste d'article, l'utilsateur n'a pas fait le quizz, donc redirect home
  return ( <Redirect to='/' /> )
} else {

  var displayArticles = articleList.map((article, i) => {

    var wishlistFilter = props.wishlist.find(wishlist => wishlist.merchantUrl === article.merchantUrl)  // trouver si l'article est dans la wishlist
     if (wishlistFilter) { 
        likeColor =  "#A7430A"} else {  // si il est dans la wishlist le picto coeur devient rouge 
        likeColor = "#000000"
      }
        
    if (props.token){    // si connecté le picto coeur permet l'ajout / suppression en wishlist 
      var popoverWishList = <FontAwesomeIcon onClick={() => handleClickWishList(article._id)} style={{cursor:'pointer', width: '15px'}} icon={faHeart} color={likeColor} />
    } else {
    popoverWishList =  // pop over si pas connecté pour la wishlist 
      <Popover placement="bottomRight" content='Veuillez vous connecter pour ajouter un article à votre Wishlist' trigger="click">
        <FontAwesomeIcon style={{cursor:'pointer', width: '15px'}} icon={faHeart}/>
      </Popover>
    }   
  

  return ( 
   <Col key={i}  xs={10} md={4} lg={3} className="articleCard" > 
    <a href={article.merchantUrl} target="_blank" rel="noreferrer">
      <div  className='productImage' >
        <img  style={{maxWidth:'100%', maxHeight: '100%'}} src={article.imageUrl}  alt='product' /> 
        {/* image + picto coeur  */}
      </div>
    </a>
    <div className="productInfo" > 
      <div className="cardPartLeft"> 
        <a href={article.merchantUrl} target="_blank" rel="noreferrer">
          <h5 className='articleCardTitle'> {article.name} </h5> 
        </a>
        <h6 className='articleCardBrand'> {article.brand} </h6>
      </div>
      <div className="cardPartRight" > 
        {popoverWishList}
        <p className='articleCardTitle'> {article.price}€ </p>
      </div>
    </div>
  </Col>
  )
})
  
/// Map des couleurs de la palette //// 
  var displayPalette = userPalette.colors.map((color, i) => {
    return (
    <div key={i} className='color1' style={{backgroundColor:`${color}`}}> 
    </div>) }
    )

   
/// map des inspirations /// 
  var displayInspo = userPalette.inspirations.map((photo, i) => {
    const content = (     // popover de l'image en grand au hover 
      <img className="displayInspo" style={{minWidth:'400px', minHeight:'400px', maxWidth:'600px', maxHeight: '600px'}} src={photo} alt='inspo'/>
      )
    return (
      <Popover content={content} placement='right' >
      <Col key={i} md={2}lg={3}  style={{backgroundColor:'white', margin:'10px', display:'flex'}}>
        <div  style={{height: '100%',display: 'flex' , justifyContent:'center', alignItems: 'center'}}>
          <img style={{maxWidth:'100%', maxHeight: '100%'}} src={photo} alt='inspo'/>
        </div>
      </Col>
      </Popover>
      )}
      ) 
    
 // gestion de l'affichage du nom de la palette ///
  var paletteName = props.userPaletteFromStore.name;
    if (paletteName === "artDeco") {
        paletteName = "Art Déco"
    } else if (paletteName === "modernMinimal") {
          paletteName = "Modern Minimal"
    } 

//////////////// FILTER  //////////////// 
function onChangeDécoration(e) {
  setArticleList(articleListFromBDD)  //  retour à la liste d'articles complète
  setFilterDeco(e.target.checked)     // gestion du check 
}
function onChangeMobilier(e) {
  setArticleList(articleListFromBDD)  
  setFilterMobilier(e.target.checked)  
}

if (FilterDeco === true) {
  setStateMob(false)       // gestion du check  
  setStateDeco(true)       // gestion du check 
  var resultFilterDeco = articleList.filter(article => article.category === "décoration")  // filter sur la catégorie 
  setArticleList(resultFilterDeco)    // changement de l'état pour afficher le résultat du filtre 
  setFilterDeco(false)   
}

if (FilterMobilier === true) {
  setStateDeco(false)
  setStateMob(true)
  var resultFilterMob = articleList.filter(article => article.category === "mobilier")
  setArticleList(resultFilterMob)
  setFilterMobilier(false)
}

var handleClickReset = () => {    // réinitialisation du filtre, tout passe à false et on remet la liste d'articles complète 
  setArticleList(articleListFromBDD)
  setStateDeco(false)
  setStateMob(false)
  setFilterMobilier(false)
  setFilterDeco(false)
}

var content = (
  <div style={{backgroundColor:'#fcfbf6'}}> 
    <h6 className="h6filter"> CATÉGORIES </h6>
      <Checkbox  checked={stateMob} onChange={onChangeMobilier}>Mobilier</Checkbox>
      <Checkbox  checked={stateDeco} onChange={onChangeDécoration}>Décoration</Checkbox>
    <p style={{color: 'grey', textDecoration: 'underline grey', marginBottom:'0px', textAlign:'center', cursor:'pointer'}} onClick={()=> handleClickReset()}> Réinitialiser le filtre </p>
  </div>
)


  return (
    <div  className="background">     {/* FOND  */}
      <NavbarFixed />
    <div className="greenBar" ></div>  {/* trait vert */}

  {/* CONTAINER ARTICLES */}
    <div className="ContainerShoppingList" style={{dislpay:'flex', backgroundColor:'#FCFBF6', paddingBottom:'3vh', justifyContent:'center' }}>  

  {/* PALETTE + BOUTON REFAIRE QUIZZ */}
        <div style={{display:'flex', justifyContent:'space-between', paddingTop:'11px',  marginLeft: '1%',marginRight: '1%'}}> 
          <div className="PaletteColors"> 
            {displayPalette}
          </div>
          <Link to="/quiz">
            <button className="inputShoppingList">Refaire le questionnaire</button>
          </Link>
        </div>

  {/* SELECTION D'ARTICLE */}
        <div className='ArticleShoppingList'> 
          <div className="TitleShoppingListContainer"> 
            <h4 className="h4style"> VOTRE SHOPPING LIST {paletteName.toUpperCase()}</h4>
            </div>
            {/* FILTRER  */}
            <div className='FilterContainer'> 
            <Popover overlayStyle={{backgroundColor:"#fcfbf6"}} content={content} placement='bottom' >
            <Button id="Popover1" type="button" > 
              <FontAwesomeIcon style={{cursor:'pointer', width: '15px'}} icon={faSearch}/>
              Filtrer
            </Button>
            </Popover>
            </div>
          
  
      {/* SLIDER */}  
          <div className="scrollerShoppingList " > 
            <Container className="containerArticles"> 
              <Row  className="rowArticles"> 
                {displayArticles}
              </Row>
            </Container> 
          </div>   {/* fin div slider */}
        </div> {/* fin article */}
      </div> {/* fin shopping list */}


  {/* BOUTTON SCROLL */}
    <div className="scrollShoppingList" >
      <h5 className='textShoppingList'>Découvrir des photos d'inspiration</h5>
      <a href="#sect2">
        <img className="arrowShoppingList" src="doubleChevron.svg" alt="double chevron" />
      </a>
    </div>


{/* PARTIE INSPIRATION */}
    <div id='sect2' className="ContainerInspi" >
      <div className="Inpiration-Text" > 
      <h4 className="TitleInspoContainer" style={{paddingTop:"18vh"}}> INSPIRATIONS </h4>
      </div>

      <div className="Inspirations-DisplayPhoto"> 
        <Container className='containerPhotoInspi' lg={12} md={12} > 
            <Row  className='rowPhotoInspi' lg={12} md={12} > 
              {displayInspo}
            </Row>
        </Container>
      </div>
    </div> {/* fin div inspiration  */}

    </div> /* fin div background */
  );   
}}

function mapStateToProps(state) {
  return { 
     userPaletteFromStore: state.palette,
     token: state.token, 
     wishlist: state.wishlist };
}

function mapDispatchToProps(dispatch){
  return {
    suppressionToken: function(){
        dispatch({type: 'deconnexion'})
    },
    addToWishlist: function(wishlist){
      dispatch({type: 'addWishlist', wishlist:wishlist})
  },
  }
}

export default connect (
  mapStateToProps,
  mapDispatchToProps)
  (ShoppingList)


