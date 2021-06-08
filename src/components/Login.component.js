import axios from 'axios';
import React,{Component} from 'react';
import { Redirect } from 'react-router';

export default class Login extends Component{

    state = {};

    handleSubmit = e =>{
        e.preventDefault();

        const data = {
            email: this.email,
            password: this.password,
        }

        axios.get(`/users/login/${data.email}/${data.password}`)
        .then(res => {
           localStorage.setItem('data',res.data[0]._id);
           this.setState({
               loggedIn:true
           });
           this.props.setUser(res.data[0]);
        }).catch(e => {
            this.setState({
                message: "Something is wrong. Try again!"
            })
        });
    }

    render(){
        if(this.state.loggedIn)
        {
            return <Redirect to={'/'}/>; //preusmjeravanje na stranice
        }

        let error = '';
        if(this.state.message){
            error = (
                <div className="alert alert-danger" role="alert">
                    {this.state.message}
                </div>
            )
        }

        return(
            <form onSubmit={this.handleSubmit}>
                {error}
                <h3>Log In</h3>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" placeholder="Email" onChange={e => this.email = e.target.value}/>
                </div>       
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Password" onChange={e => this.password = e.target.value}/>
                </div>              
                <div className="form-group"><br></br>                
                    <button className="btn btn-primary"> Log In </button>                
                </div>               
            </form>
        )
    }
}