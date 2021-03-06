import React,{Component} from 'react';
import {Link} from "react-router-dom"; 

export default class Nav extends Component{

  handleLogout= () => {
      localStorage.clear();
      this.props.setUser();
  }
 

    render(){
     
      let buttons;
      if(this.props.user){
        console.log(this.props.user.firstName + "Ja ja ");
        buttons =(          
          <ul className="navbar-nav">   
           <li className="hiName">
               Bok, {this.props.user.firstName} {this.props.user.lastName}  |  
            </li>            
            <li className="logout">
              <Link className="nav-link" onClick={this.handleLogout} to={'/'}>Logout</Link>
            </li>           
          </ul>          
          )
      }else{
          buttons =(
          <ul className="navbar-nav">     
            <li className="nav-item">
              <Link className="nav-link" to={'/login'}>Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={'/register'}>Sign Up</Link>
            </li>
          </ul>)
      }

        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
              <div className="container-fluid">
                <ul className="nav navbar-nav">
                  <li><Link className="navbar-brand" to={'/'}>Početna </Link></li>                  
                  <li><Link className="navbar-brand" to={'/notes'}>Bilješke </Link></li>
                  <li><Link className="navbar-brand" to={'/bodovi'}>Bodovi </Link></li>
                  <li><Link className="navbar-brand" to={'/habit'}>Habbit tracker </Link></li>
                </ul>
                <ul className="nav navbar-nav navbar-right">
                  <div className="collapse navbar-collapse" id="navbarNav">            
                  {buttons}
                  </div>
              </ul>
            </div>
          </nav>
        )
    }
}