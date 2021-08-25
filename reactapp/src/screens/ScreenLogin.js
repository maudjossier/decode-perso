import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import NavBar from "../components/navbar";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import { Input } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";

function Login(props) {
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [listErrorsSignup, setErrorsSignup] = useState([]);
  const [listErrorsSignin, setErrorsSignin] = useState([]);

  //////// INSCRIPTION  ////////
  var handleSubmitSignup = async () => {  
    const data = await fetch("/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${signUpUsername}&emailFromFront=${signUpEmail}&passwordFromFront=${signUpPassword}&paletteFromStore=${props.userPaletteFromStore._id}`,
    });
    const body = await data.json();

    if (body.result === true) {
      setUserExists(true);
      props.addToken(body.token); // envoi au store du token utilisateur
      props.addUserStoreSignUp(signUpUsername); // envoi au store de son username 
    } else {
      setErrorsSignup(body.error); // si erreur avec sign-up, renvoie une erreur
    }
  };


  //////// CONNEXION  ////////
  var handleSubmitSignin = async () => {
    const data = await fetch("/signIn", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`,
    });
    const body = await data.json();

    if (body.result === true) {
      setUserExists(true);
      props.addToken(body.token);     // ajout du token au store 
      props.addUserStoreSignIn(body.user.firstName); // ajout du username au store 
      if (props.userPaletteFromStore === "") {
        props.addPalette(body.user.palette);  // si la palette dans le store est vide on ajoute la palette de la BDD
      }
      props.addToWishlist(body.user.wishlist);  // ajout de la wishlist  au store 
    } else {
      setErrorsSignin(body.error);
    }
  };

  if (userExists) {
    return <Redirect to="/mypalette" />;    // si l'utilisateur s'est bien inscrit ou connecté, redirige vers 'my palette' 
  }

  var tabErrorsSignup = listErrorsSignup.map((error, i) => {
    return (
      <p style={{ fontSize: "15px", marginBottom: "0px", marginTop: "10px" }}>
        {error}
      </p>
    );
  });

  var tabErrorsSignin = listErrorsSignin.map((error, i) => {
    return (
      <p style={{ fontSize: "15px", marginBottom: "0px", marginTop: "10px" }}>
        {error}
      </p>
    );
  });

  // permet de valider en appuyant sur la touche entrer 
  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      handleSubmitSignin();
    }
  };
  const handleKeypress2 = (e) => {
    if (e.charCode === 13) {
      handleSubmitSignup();
    }
  };

  return (
    <div className="background">
      <NavBar />
      <div className="containerLogin">
        <div className="boxLogin" style={{ marginTop: "80px" }}>
          <div className="titleLogin">
            <h3 className="h3title">Connexion / Inscription</h3>
          </div>
          <div className="trait2"></div>

          <Row className="login">

            {/*  CONNEXION  */}
            <Col lg={4} md={12} xs={12} className="connexion">
              Connexion
              <div className="formLogin">
                <Input
                  onChange={(e) => setSignInEmail(e.target.value)}
                  type="email"
                  name="emailFromFront"
                  placeholder="Email"
                  className="input_login"
                />
                <div style={{ display: "flex" }}>
                  <Input.Password
                    onKeyPress={handleKeypress}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    name="passwordFromFront"
                    placeholder="Mot de passe"
                    className="input_login"
                  />
                </div>
              </div>
              <div>{tabErrorsSignin}</div>
              <div className="boxButton">
                <input
                  onClick={() => handleSubmitSignin()}
                  type="submit"
                  value="Connexion"
                  className="inputValiderLogin"
                />
              </div>
            </Col>

            <div className="trait">
              <img src="line.png" alt="line" />
            </div>

               {/*  INSCRIPTION  */}
            <Col lg={4} md={10} xs={10} className="inscription">
              Inscription
              <div className="formLogin">
                <Input
                  onChange={(e) => setSignUpUsername(e.target.value)}
                  type="text"
                  name="usernameFromFront"
                  placeholder="Prénom"
                  className="input_login"
                />
                <Input
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  type="email"
                  name="emailFromFront"
                  placeholder="Email"
                  className="input_login"
                />
                <Input.Password
                  onKeyPress={handleKeypress2}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  name="passwordFromFront"
                  placeholder="Mot de passe"
                  className="input_login"
                />
              </div>
              <div>{tabErrorsSignup}</div>
              <input
                onClick={() => handleSubmitSignup()}
                type="submit"
                value="Connexion"
                className="inputValiderLogin"
              />
            </Col>
            
          </Row>

        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { userToken: state.token, userPaletteFromStore: state.palette };
}

function mapDispatchToProps(dispatch) {
  return {
    addToken: function (token) {
      dispatch({ type: "addToken", token: token });
    },
    suppressionToken: function () {
      dispatch({ type: "deconnexion" });
    },
    addUserStoreSignUp: function (userName) {
      dispatch({ type: "userStoreSignUp", userName });
    },
    addUserStoreSignIn: function (userName) {
      dispatch({ type: "userStoreSignIn", userName });
    },
    addPalette: function (palette) {
      dispatch({ type: "addPalette", palette: palette });
    },
    addToWishlist: function (wishlist) {
      dispatch({ type: "addWishlist", wishlist: wishlist });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
