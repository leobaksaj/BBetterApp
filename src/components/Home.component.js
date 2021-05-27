import axios from 'axios';
import React,{Component} from 'react';

export default class Home extends Component{

    state ={};

    constructor(props){
        super(props);
        this.state = {
            items:[],
        }
    };

    componentDidMount(){
        let d = localStorage.getItem('data');
         axios.get(`/notes/all/${d}`)
         .then(res => {
             this.setState({
                 items: res.data,                 
             })             
            }); 
    }
   
  
    render(){
       
        if(this.props.user){               
            
            return(
                <div className="row">
                    {/* TODO LISTA */}
                    <div className="todo col-md-3">
                    
                    <div className="container">
                        <h4>TODO List</h4>                    
                            {this.state.items.map(item => ( <div className="row titlecontent"><div className="titlenote"> {item.noteTitle}<br></br>
                            {(<span>{item.noteContent}</span>)}</div></div> ))}                  
                                                      
                        </div>                     
                    </div>                 

                                {/* KALENDAR  */}
                    <div className="col-md-5 kal">           
                       
                        <div className="title">January 2021</div>
                        <table border="1" className="kalendar">
                        <tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>
                        <tr><td><span className="date">&nbsp;</span></td><td><span class="date">&nbsp;</span></td><td><span class="date">&nbsp;</span></td><td><span className="date">&nbsp;</span></td><td><span className="date">&nbsp;</span></td><td><span className="date">1</span></td><td><span className="date">2</span></td></tr>
                        <tr><td><span className="date">3</span></td><td><span className="date">4</span></td><td><span className="date">5</span></td><td><span className="date">6</span></td><td><span className="date">7</span></td><td><span className="date">8</span></td><td><span className="date">9</span></td></tr>
                        <tr><td><span className="date">10</span></td><td><span className="date">11</span></td><td><span className="date">12</span></td><td><span className="date">13</span></td><td><span className="date">14</span></td><td><span className="date">15</span></td><td><span className="date">16</span></td></tr>
                        <tr><td><span className="date">17</span></td><td><span className="date">18</span></td><td><span className="date">19</span></td><td><span className="date">20</span></td><td><span className="date">21</span></td><td><span className="date">22</span></td><td><span className="date">23</span></td></tr>
                        <tr><td><span className="date">24</span></td><td><span className="date">25</span></td><td><span className="date">26</span></td><td><span className="date">27</span></td><td><span className="date">28</span></td><td><span className="date">29</span></td><td><span className="date">30</span></td></tr>
                        <tr><td><span className="date">31</span></td><td><span className="date">&nbsp;</span></td><td><span className="date">&nbsp;</span></td><td><span className="date">&nbsp;</span></td><td><span className="date">&nbsp;</span></td><td><span className="date">&nbsp;</span></td><td><span className="date">&nbsp;</span></td></tr>
                        </table>                
                                                              
                    </div>
                              
                    <div className="col-md-3 todo">
                    {/* <h2>Hi {this.props.user.firstName} {this.props.user.lastName}</h2> */}
            
                        <table className="table table">
                        <div>
                            <h4>Pomidoro Timer</h4>
                        </div>
                        </table>
                    </div>                   
                </div>          
             
            )
        }
        return(
            <div className="auth-inner">
                <h2> You are not logged in! </h2>
            </div>
        )
        
    }
}
