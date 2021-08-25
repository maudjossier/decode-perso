import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/navbar";
import { connect } from "react-redux";
import copy from "copy-to-clipboard";
import { Popover, notification } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";

function MyPalette(props) {
  const [palette, setPalette] = useState(props.userPaletteFromStore);

  useEffect(() => {     // Modifie la palette affichée si celle dans le store ou le token utilisateur change 
    setPalette(props.userPaletteFromStore);
  }, [props.userPaletteFromStore, props.token]);

  /////// GESTION DU COPY DU CODE HEX ///////
  var handleClickCopyCode = (data) => {
    copy(`${data}`, {
      debug: true,
      message: "Press #{key} to copy",
    });
  };

  const content = (   // contenu du popover au hover d'une couleur 
    <div>
      <p style={{ fontSize: "12px", marginBottom: "0px" }}>
        Cliquez pour copier le code hex
      </p>
    </div>
  );

  /////// NOTIFICATION SUITE AU COPY ///////
  const openNotification = () => {
    notification.open({
      message: "Code copié !",
      className: "notifcopy",
      style: {width: 200}
    });
  };

 
  if (palette) {   // si il y a une palette dans le store  
    var paletteName = palette.name;     // affichage du nom de la palette 
    if (paletteName === "artDeco") {
      paletteName = "Art Déco"
    } else if (paletteName === "modernMinimal") {
      paletteName = "Modern Minimal"
    }

    var tabPaletteColor = props.userPaletteFromStore.colors.map((data, i) => {      // AFFICHAGE DES COULEURS DE LA PALETTE
      return (
        <Popover key={i} content={content} trigger="hover" placement="bottomRight">
          <Col md={4} lg={2} xs={2}>
            <div key={i} style={{ backgroundColor: data, cursor: "pointer" }} className="palette" onClick={() => {handleClickCopyCode(data); openNotification();}}>
              <p className="textColorPalette">{data}</p>
            </div>
          </Col>
        </Popover>
      );
    });

    return (
      <div style={{ height: "110vh" }} className="background">
        <NavBar />
        <div className="containerMypalette">

          <div className="MypaletteBox">
            <h3 className="h3Mypalette">VOTRE PALETTE : {paletteName.toUpperCase()} </h3>
            <div className="traitMypalette"></div>
            <Container style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
              <Row className="RowPalette">{tabPaletteColor}</Row>
            </Container>
          </div>

          <p className="descriptionMypalette">{palette.description}</p>

          <Link to="/shoppinglist">
            <button className="inputMypalette">
              Découvrir ma shopping-list
            </button>
          </Link>

        </div>
      </div>
    );
  } else {
    return (    // si pas de palette dans le store 
      <div style={{ height: "110vh" }} className="background">
        <NavBar/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { userPaletteFromStore: state.palette, token: state.token };
}


export default connect(mapStateToProps, null)(MyPalette);
