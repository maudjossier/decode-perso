var express = require("express");
var router = express.Router();

var uid2 = require("uid2");
var bcrypt = require("bcrypt");

var userModel = require("../models/users");
var paletteModel = require("../models/palettes");
var articleModel = require("../models/articles");

router.get("/", async (req, res, next) => {
  res.json();
});

router.post('/signUp', async (req, res, next) => {
  var error = []
  var saveUser = null
  var result = false
  var token = null
  console.log('body', req.body)

  // vérification de la présence ou non de l'email dans la BDD
  const data = await userModel.findOne({
    email: req.body.emailFromFront,
  });
  if (data != null) {
    error.push("Utilisateur déjà présent");
  }

  // vérification du bon remplissage des champs
  if (
    req.body.usernameFromFront == "" ||
    req.body.emailFromFront == "" ||
    req.body.passwordFromFront == ""
  ) {
    error.push("Champs vides");
  }

  // vérification de la validité de l'email 
  var emailRegex = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)
  var isEmailValid = emailRegex.test(req.body.emailFromFront); 
  if (isEmailValid === false ) { 
    error.push('Merci de rentrer un email valide')
  } 
 
   // vérification si l'utilisateur a bien répondu au questionnaire
  if (
    req.body.paletteFromStore === 'undefined' 
    ) {
      error.push('Répondez au questionnaire avant de vous inscrire')
    }
  
    console.log('error', error)
  // si aucune erreur, l'utilisateur est inscrit dans la base de données
  if(error.length == 0){
      var hash = bcrypt.hashSync(req.body.passwordFromFront, 10); 
      var newUser = new userModel({
      firstName: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
      palette: req.body.paletteFromStore, 
      wishlist: [] 
    })
  
    saveUser = await newUser.save();
   /*  await saveUser.updateOne({palette : idPalette}) */
  }
  // si enregistrement en BDD ok, on renvoie au front
  if(saveUser){
    result = true
    token = saveUser.token
    res.json({result, saveUser, token})
  } else {res.json({result, error});}  // sinon on renvoie les erreurs 

  
});

router.post("/signIn", async (req, res) => {
  var result = false;
  var user = null;
  var error = [];
  var token = null;

  // verification du bon remplissage des champs
  if (req.body.emailFromFront == "" || req.body.passwordFromFront == "") {
    error.push("Champs vides");
  }

  // si pas d'erreur, recherche de l'email en BDD, puis de l'adéquation mdp/email
  if (error.length == 0) {
    const userIsFound = await userModel.findOne({
      email: req.body.emailFromFront,
    });

    if (userIsFound) {
      if (bcrypt.compareSync(req.body.passwordFromFront, userIsFound.password)) {
        var user = await userModel
          .findById(userIsFound._id)
          .populate("palette")
          .populate('wishlist')
          .exec()

        result = true;
        token = user.token;
        res.json({ result, user, token})
      } else {
        result = false;
        error.push("Mot de passe incorrect");
        res.json({ result, error })
      }
    } else {
      error.push("Email incorrect");
      res.json({ result, error})
    }
  }

  ;
});

router.post("/validerQuiz", async (req, res, next) => {
  var result = false;
  var userPalette = null;
  var isConnected = false
  if (req.body.token !== null ) { isConnected = true} 
 
  ///////// ALGORITHME DU QUESTIONNAIRE ///////
  console.log('body', req.body)
  var responses = [req.body.rep1, req.body.rep2, req.body.rep3, req.body.rep4, req.body.rep5, req.body.rep6, req.body.rep7]  

  var palette1 = 0;
  var palette2 = 0;
  var palette3 = 0;
  var palette4 = 0;

  //compteur des réponses reçues
  for (var i = 0; i < responses.length; i++) {
    if (responses[i] === "ethnique") {
      palette1++;
    } else if (responses[i] === "bohème") {
      palette2++;
    } else if (responses[i] === "artDeco") {
      palette3++;
    } else if (responses[i] === "modernMinimal") {
      palette4++;
    }
  }

  // question plus forte pour départager si jamais il avait eu égalité
  if (responses[2] === "ethnique") {
    palette1 += 2;
  } else if (responses[2] === "bohème") {
    palette2 += 2;
  } else if (responses[2] === "artDeco") {
    palette3 += 2;
  } else if (responses[2] === "modernMinimal") {
    palette4 += 2;
  }

  // adéquation compteur et nom de palette 
  var compteursArray = [
    { palette: "ethnique", compteur: palette1 },
    { palette: "bohème", compteur: palette2 },
    { palette: "artDeco", compteur: palette3 },
    { palette: "modernMinimal", compteur: palette4 },
  ];

  // arrangement des résultats par ordre de grandeur 
  var sortedResults = compteursArray.sort(function compare(a, b) {
    if (a.compteur < b.compteur)
       return -1;
    if (a.compteur > b.compteur )
       return 1;
    return 0;}
    )

 console.log('Votre palette est ', sortedResults[sortedResults.length-1].palette)   

 var resultquizz = sortedResults[sortedResults.length-1].palette

 /////////////////////// TROUVER LA PALETTE EN BDD ////////////////

 // find palette dans la bdd avec le nom donné par le résultat de l'algo
  var userPalette = await paletteModel.findOne(    
  {name: resultquizz})

  // si l'utilisateur n'est pas connecté on renvoit juste la palette 
 if (isConnected === false){
    if (userPalette) 
    {result = true; res.json({result, userPalette})}
     else {res.json({result})}  
   } 
   else  {  
 // si l'utilisteur est connecté on modifie la clé étrangère 'palette' de l'utilisateur 
      var userUpdated = await userModel.updateOne( 
        {token: req.body.token},
        {palette: userPalette._id}
      ) 
      if (userUpdated) 
      { result = true; res.json({result, userPalette}) }
      else {res.json({result})} 
   }
  });
 

/* router.post("/myPalette", async (req, res, next) => {
  if (req.body.token != null) {
    var userForId = await userModel.findOne(   // trouver l'utilisateur avec son token 
      {token: req.body.token})

      var user = await userModel.       // populate pour aller récupére la palette 
      findById(userForId._id)
      .populate('palette')
    res.json({userPalette: user.palette})}

    else {
      res.json({userPalette: false})
    }
}); */

router.post("/myShoppingList", async (req, res) => {
  var result = false;
  var paletteFromFront = req.body.paletteName;

  // trouver les articles avec le nom de la palette de l'utilisateur 
  var shoppingList = await articleModel.find({
    paletteName: paletteFromFront,
  });

  // si les articles ont été trouvés, on renvoit les articles 
  if (shoppingList) {
    result = true;
    res.json({ result, shoppingList });
  } else {
    res.json({ result });
  }
});

router.post("/addToWishlist", async (req, res) => {
  var result = false;
  article = req.body.articleID;

  // trouver l'utilisateur pour récupérer son id
  const findUser = await userModel.findOne({token: req.body.token})

  // modifier la wishlist 
  var updateUser = await userModel.updateOne(
    { token: req.body.token },
    {$push: 
    {wishlist: article}
    } );

  // aller chercher les articles en wishilist par leurs clés étrangères
  var user = await userModel
    .findById(findUser._id)
    .populate("wishlist")
    .exec();

  var wishlist = user.wishlist;

  // si la modification a bien été fait, on renvoit la wishlist mise à jour 
  if (updateUser.n !=0){
    result=true
    res.json({ result, wishlist })
  } else { 
    res.json({result})
  }
});


router.put("/deleteFromWishlist", async (req, res) => {
  var result = false;

  // récupérer l'id utilisateur 
  const myUser = await userModel.findOne(
    {token : req.body.token}
  )
  // retirer un article de la wishlist par sa clé étrangère  
  var update = await userModel.updateOne(
    {token : req.body.token}, 
    {$pull: 
      {wishlist: req.body.articleID}
    }
  )

// populate la wishlist pour renvoyer son contenu mis à jour 
  var user = await userModel
    .findById(myUser._id)
    .populate("wishlist")
    .exec();

  var wishlist = user.wishlist

  // si la modificiation a bien été faite on renvoit le nouveau résultat 
  if (update.nModified != 0 ){
    result = true 
  res.json({result, wishlist})
  } else {
    res.json({result})
  }
});

router.get("/AllPalettes", async (req, res, next) => {
  var result = false;
  var AllPalettes = await paletteModel.find();

  if (AllPalettes) {
    result = true;
    res.json({ result, AllPalettes});
  } else {
    res.json({ result });
  }

  
});

module.exports = router;
