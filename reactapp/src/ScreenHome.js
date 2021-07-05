import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { connect } from "react-redux";
import { Popover } from "antd";
import { Badge } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";

function Home(props) {
  // Modal de la NavBar
  const text = <span>Bonjour {props.userNameFromStore}</span>;
  const content = (
    <div>
      <Link className="navLink" to="/mypalette">
        <p>Ma palette</p>
      </Link>
      <Link className="navLink" to="/shoppinglist">
        <p>Ma shopping list</p>
      </Link>
      <Link className="navLink" to="/moodboard">
        <p>Mon moodboard</p>
      </Link>
      <Link className="navLink" to="/">        {/* déconnexion : suppression token, wishlist et palette du store */}
        <p onClick={() => {props.suppressionToken();props.deleteWishlist();props.deletePalette();}} >
          Déconnexion
        </p>
      </Link>
    </div>
  );

  // si user connecté, la modal apparait
  if (props.userToken != null) {
    var popover = (
      <Popover
        placement="bottomRight"
        title={text}
        content={content}
        trigger="click"
      >
        <img src="user.svg" alt="heart icon" className="NavBarIcon" />
      </Popover>
    );
  } else {   // si pas connecté
    popover = (
      <Link to="/login">
        <img src="user.svg" alt="heart icon" className="NavBarIcon" />
      </Link>
    );
  }

  // compteur d'articles dans la wishlist pour le badge
  var count = props.wishlist.length;

  return (
    <div style={{ scrollBehavior: "smooth" }}>
      {/* NAVBAR */}
      <div className="navbarHome">
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div className="TitleHomeBox">
            <Link style={{ textDecoration: "none" }} to="/">
              <h1 className="HomeDecode"> DÉCODE. </h1>
            </Link>
          </div>
        </div>

        <div className="icon">
          <Link to="/allpalettes">
            <img src="palette.svg" alt="user icon" className="NavBarIcon" />
          </Link>
          <div style={{ margin: "20px" }}>
            <Badge count={count} style={{ backgroundColor: "#A7430A" }}>
              <Link to="/wishlist">
                <img
                  src="heart.svg"
                  alt="heart icon"
                  className="pictoWishlist"
                />
              </Link>
            </Badge>
          </div>
          {popover}
        </div>
      </div>

      {/* SECTION 1 */}
      <div id="section1" className="imageBackground">
        <Container className="ContainerFluidHome" fluid={true}>
          <div style={{display: "flex",justifyContent: "space-around", alignItems: "center"}}>
            <div className="containerText1Home">

              <p id="pHome" data-mdb-toggle="animation" data-mdb-animation-reset="true" data-mdb-animation="fade-in-down">
                DÉCOUVREZ L'INTÉRIEUR DONT VOUS AVEZ TOUJOURS RÊVÉ
              </p>

              <div style={{display: "flex",flexDirection: "column",justifyContent: "flex-end",alignItems: "center",paddingTop: "40px"}}>
                <a href="#section2">
                  <div type="button" className="ButtonHome1" style={{display: "flex",justifyContent: "center", alignItems: "center", marginBottom: "50px"}}>
                    <p style={{ margin: "1em" }}> Je découvre</p>
                  </div>
                </a>
                <a href="#section2">
                  <img className="chevronBlanc" src="doubleChevron.svg" alt="double chevron"/>
                </a>
              </div>
            </div>
            <div className="HomePalette">
              <div className="paletteNoire"></div>
              <div className="paletteBrune"></div>
              <div className="paletteBleue"></div>
              <div className="paletteOr"></div>
              <div className="paletteBlanc"></div>
            </div>
          </div>
        </Container>
      </div>

      {/* SECTION 2 */}
      <div id="section2" className="background">
        <Container className="ContainerFluidHome2" fluid={true}>
          <a href="#section1">
            <img className="chevronBlanc2" src="doubleChevron.svg" alt="double chevron"/>
          </a>
          <div className="titreHomeSection2" style={{display: "flex", flexDirection: "column",justifyContent: "center",alignItems: "center", }}>
            <p className="pHome1">
              DÉCODE vous offre des conseils de décoration personnalisés et
              gratuits afin de vous accompagner dans vos projets déco.
            </p>
            <p className="pHome1">
              Répondez au questionnaire pour découvrir votre palette de couleurs
              et accéder à votre shopping list sur-mesure !
            </p>
          </div>
          <Link to="/quiz">
            <button type="button" className="ButtonHome2">
              Répondre au questionnaire
            </button>
          </Link>
        </Container>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userToken: state.token,
    userNameFromStore: state.userName,
    wishlist: state.wishlist,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    suppressionToken: function () {
      dispatch({ type: "deconnexion" });
    },
    deleteWishlist: function () {
      dispatch({ type: "deleteWishlist" });
    },
    deletePalette: function () {
      dispatch({ type: "deletePalette" });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
