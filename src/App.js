import React, { Component } from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Home } from './components/Home.component';
import Nav from './components/Nav.component';
import Login from './components/Login.component';
import Register from './components/Register.component';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import axios from 'axios';
require ('dotenv').config()


  export default class App extends Component {

    state = {
      isVisible: ''
    };

    componentDidMount = () => {    
      let d = localStorage.getItem('data');
  
      axios.get(`/users/get/${d}`).then(
          res => {
              this.setUser(res.data);
          },
          err => {
              console.log(err);
          }
      )         
    };

    setUser = user => {
        this.setState({
          user: user
      });
    };
    
    render(){
      return (       
        <BrowserRouter>
        <div className="App">
          <Nav user={this.state.user} setUser={this.setUser}/>
          <div className="auth-wrapper">
            <div className="notloged2">
              <Switch>
                <Route exact path="/" component={() => <Home user={this.state.user}/>}/>
              </Switch>
              <div className="auth-innerlogin">
                <Switch>
                    <Route exact path="/login" component={() => <Login setUser={this.setUser} />}/>
                    <Route exact path="/register" component={Register}/>
                </Switch>            
              </div>
            </div>             
          </div>              
        </div>
        </BrowserRouter>
      );
    }
  };

