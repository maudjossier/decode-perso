
import React from 'react';
import './App.css';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom';
import { Popover } from 'antd';
import { Badge } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Row, Col } from 'react-bootstrap';





function NavBar(props) {

  const text = <span>Bonjour {props.userNameFromStore}</span>;
          const content = (
            <div>
              <Link style={{color: 'grey', textDecoration: 'underline grey'}} to ='/mypalette'><p>Ma palette</p></Link>
              <Link style={{color: 'grey', textDecoration: 'underline grey'}} to ='/shoppinglist'><p>Ma shopping list</p></Link>
              <Link style={{color: 'grey', textDecoration: 'underline grey'}} to ='/'><p onClick={() => {props.suppressionToken(); props.deleteWishlist(); props.deletePalette()}}>Déconnexion</p></Link>
            </div>
          );

  if(props.token != null){
    var userNav = <Popover placement="bottomRight" title={text} content={content} trigger="hover">
    <img src='user.svg' alt='user icon' className='NavBarIcon'/>
    </Popover>
} else {
    userNav =  <Link to='/login'><img src='user.svg' alt='user icon' className='NavBarIcon' style={{ cursor:'pointer'}}/></Link>
}
  var count = props.wishlist.length
  console.log('count', count)
  return (
    <div className= 'navbarNormal'>
       
        <Row className='TitleNavBox'>
      <Link style={{textDecoration:"none"}} to="/">
            <h1 className='h2Navbar'>
              DÉCODE.
            </h1>
        </Link>
        </Row> 
        
        <Row>
        <div className="icon">
          <Link to="/allpalettes">
            <img src="palette.svg" alt="user icon" className='NavBarIcon'
            />
          </Link>
          <div style={{margin:'20px'}}> 
          <Badge count={count} style={{backgroundColor:'#A7430A', }}>
            <Link to = '/wishlist'><img src='heart.svg' alt='heart icon' className='pictoWishlist'/></Link>
          </Badge>
          </div>
          {userNav}
        </div>
        </Row>
       
    </div>
  

  
  );
}


function mapStateToProps(state){
return {token: state.token, userNameFromStore: state.userName, wishlist: state.wishlist};
}

function mapDispatchToProps(dispatch){
  return {
    suppressionToken: function(){
        dispatch({type: 'deconnexion'})
    },
    deleteWishlist : function(){
      dispatch({type: 'deleteWishlist'}) 
    },
    deletePalette : function(){
      dispatch({type: 'deletePalette'}) 
    }, 
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar)
