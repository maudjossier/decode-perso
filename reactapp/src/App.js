import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';


import token from './reducers/token';
import palette from './reducers/palette';
import wishlist from './reducers/wishlist';
import userName from './reducers/user';


import Home from './screens/ScreenHome';
import Quiz from './screens/ScreenQuizz';
import MyPalette from './screens/ScreenMyPalette';

import ShoppingList from './screens/ScreenShoppingList';
import Login from './screens/ScreenLogin';
import Wishlist from './screens/ScreenWishlist';
import Moodboard from './screens/ScreenMoodboard';
import AllPalettes from './screens/ScreenAllPalettes';
import NavBar from './components/navbar';
import NavbarFixed from './components/navbarFixed';




const store = createStore(combineReducers({token, palette, wishlist, userName}))

function App() {

  return (
   
    <Provider store={store}>
    <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/quiz" component={Quiz}  />
      <Route exact path="/mypalette" component={MyPalette}  />
      <Route path="/shoppinglist" component={ShoppingList}  />
      <Route path="/login" component={Login}  />
      <Route path="/wishlist" component={Wishlist}  />
      <Route path="/allpalettes" component={AllPalettes}  />
      <Route path="/moodboard" component={Moodboard}  />
      <Route path="/navbar" component={NavBar}  />
      <Route path="/navbarFixed" component={NavbarFixed}  />

    </Switch>
  </Router>
  </Provider>
 
  );
}

export default App;
