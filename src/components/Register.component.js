import React,{Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

export default class Register extends Component{

    state = {};
    handleSubmit = e =>{
        e.preventDefault();

        const data = {
            firstName :this.firstName,
            lastName :this.lastName,
            userName :this.userName,
            email :this.email,
            password :this.password,
            gender :this.gender,
            age :this.age,
        }
        axios.post('/users/new',data)
        .then(
            res =>{
                 console.log(res)
                 this.setState({
                    loggedIn:true
                });
            }
        ).catch(e => {
            this.setState({
                message: e.response.data 
            })
        })
    };

    render(){

        if(this.state.loggedIn)
        {
            return <Redirect to={'/login'}/>; //preusmjeravanje na stranice
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
            <div className="auth-login">
                <form onSubmit={this.handleSubmit}>
                        {error}
                    <h3>Sign Up</h3>

                    <div className="form-group">
                        <label>Frist name</label>
                        <input type="text" className="form-control" placeholder="Frist name" onChange={e => this.firstName = e.target.value}/>
                    </div>       
                    <div className="form-group">
                        <label>Last name</label>
                        <input type="text" className="form-control" placeholder="Last name" onChange={e => this.lastName = e.target.value}/>
                    </div>        
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" className="form-control" placeholder="Username" onChange={e => this.userName = e.target.value}/>
                    </div>       
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" placeholder="Email" onChange={e => this.email = e.target.value}/>
                    </div>       
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Password" onChange={e => this.password = e.target.value}/>
                    </div>      
                    {/* <div className="form-group">
                        <label>Confirm password</label>
                        <input type="password" className="form-control" placeholder="Password" onChange={e => this. = e.target.value}/>
                    </div>       */}
                    {/* <div className="form-group">
                        <label>Gender</label>
                        <input type="text" className="form-control" placeholder="M or " onChange={e => this.gender = e.target.value}/>
                    </div>    */}
                    <label>Gender </label>
                    <select className="form-control" onChange={e => this.gender = e.target.value} name="gender" >
                        <option value=""></option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                    <div className="form-group">
                        <label>Age</label>
                        <input type="number" className="form-control" placeholder="Age" min="12" max="90" onChange={e => this.age = e.target.value}/>
                    </div>
                    <div className="form-group"><br></br>                
                        <button className="btn btn-primary"> Sign Up </button>                
                    </div>               
                </form>
            </div>
        )
    }
}