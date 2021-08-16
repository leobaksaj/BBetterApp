import axios from 'axios';
import React,{useEffect,useState} from 'react';
import moment from 'moment';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import {Modal} from 'react-bootstrap';
// import { Switch, Route } from 'react-router-dom';
import { HabitCalendar } from './HabitCalendar';
import { MonitorCalendar } from './MonitorCalendar';


const ShadowWrapper = styled('div')`
  border-top: 1px solid #737374;
  border-left: 1px solid #464648;
  border-right: 1px solid #464648;
  border-bottom: 2px solid #464648;
  border-radius: 8px;
  overflow:hidden;
  margin: 5px;
`;

const Hover = styled.div`
    visibility: ${props => props.isHover ? 'hidden' : 'visible'};   
`;

function HabbitTracker(props){
    let d = localStorage.getItem('data');   
    useEffect(() => {
        axios.get(`/habits/all/${d}`)
        .then(res =>  {
            setHabits(res.data);   
        });   
       
    },[]);

    window.moment =  moment;     
    moment.updateLocale('en', {week:{dow:1}}); 
    const [today, setToday] = useState(moment());
    const startDay = today.clone().startOf('month').startOf('week'); 

    const [habits, setHabits] = useState([]); 
    const [habit, setHabit] = useState([]); 
    const [habitItem, setHabitItem] = useState([]); 
    const [habitIID, setHabitID] = useState([]); 

    const refreshPage = ()=>{
        axios.get(`/habits/all/${d}`)
        .then(res =>  {
            setHabits(res.data);   
        });
     }    

     const refreshCallgrid = ()=>{
        axios.get(`/habits/get/${habitIID}`)
        .then(res =>  {
            setHabitItem(res.data.habitDates);   
        });
     }    

    /********* MODAL *********** */

    const [show, setShow] = useState(false);
    const [showcalendar, setShowCalendar] = useState(false);

    const handleClose = () => setShow(false);
    function handleCloseCalendar(){
        setShowCalendar(false);
        refreshPage();
    } 

    function handleShow(){    
        setShow(true);  
        let titleError = "";
        let startError = "";
        let intentionError = "";
        serError({ titleError, startError, intentionError });
    };

    let habitID = "";
    function handleShowCalendarModal(habID){  
        // setHabit(habID);     
        setShowCalendar(true);            
        habitID = habID ;
        // console.log(habitID);
        axios.get(`/habits/get/${habitID}`)
        .then(res =>  {
            setHabitItem(res.data.habitDates);
            setHabitID(habitID); 
        });
    };
    
    function handle(e){
        const newhabit = {...habit };
        newhabit[e.target.id] = e.target.value;
        setHabit(newhabit);
    }

    const [error, serError] = useState({
        titleError: "",
        startError: "",
        intentionError: "",
    });

    const validate = () => {
        let titleError = "";
        let startError = "";
        let intentionError = "";
    
        if (!habit.habitTitle) {
          titleError = "Title cannot be blank!";
        }    
        if (!habit.start) {
            startError = "Please select an habit type!";
        }
        if (!habit.intention) {
            intentionError = "Namjera cannot be blank!!";
        }    
        if (titleError || startError || intentionError) {
            serError({ titleError, startError, intentionError });
          return false;
        }    
        return true;
      };


    function submit(e){      
        e.preventDefault();
        let todaycurr = new Date().toLocaleDateString();       
        const dd = todaycurr.substring(0,2);
        const mm = todaycurr.substring(4,6);
        const yyyy = todaycurr.substring(8,12);
        const date11 = dd +"."+mm+"."+yyyy;
        const isValid = validate();
        if (isValid) {
        axios.post('/habits/new',{
            userId: d,
            habitTitle: habit.habitTitle,
            start: habit.start,
            habitDates: [{date: date11 }],            
            intentions: [{intention: habit.intention}]
        })
        .then(res =>{
            setHabit({
                userId: d,
                habitTitle: habit.habitTitle,
                start: habit.start,
                habitDates: [{date: date11 }],            
                intentions: [{intention: ""}]
            });
            handleClose();
            refreshPage();
        })
        .catch(e => {
            setError({
            err: "Something is wrong. Try again!"
        })
        console.log(err.value);
        })
        }                    
    };  

    function getDays(){
        var dt = new Date();
        var month = dt.getMonth();
        var year = dt.getFullYear();
        var daysInMonth = new Date(year, month, 0).getDate();
        return daysInMonth;
    }
    const [err, setError] = useState();    
    
if(props.user){ 
    const prevHandler = () =>  setToday(prev => prev.clone().subtract(1, 'month'));   //this.state.setToday.clone().subtract(1, 'month');    
    const todayHandler = () => setToday(moment());
    const nextHandler = () =>  setToday(prev => prev.clone().add(1, 'month'));
          
    return(<>
        <div className="row mainrow">
            <div className="todo col-md-9">  
                <div className="row">
                    <h4 className="col-sm-8">Habit</h4>
                    <button className="col-sm-2 btn btn-info" onClick={handleShow}><FontAwesomeIcon icon={faPlus} /></button>
                </div><br></br> 
                <table className="table">
                <thead>
                    <tr>
                        <th scope="col"></th>
                    </tr>
                </thead>                                                        
                    {habits.map(item => (<> <br></br>                                   
                        <button className={item.start === 1 ? "btn btn-primary habitMap" : "btn btn-success habitMap"} onClick={() => handleShowCalendarModal(item._id)}>
                           <div className="row">
                               <div className="col-sm-10">{item.habitTitle}</div>
                               <div className="col-sm-2">{((item.habitDates.map(item => item._id).length) /getDays()*100 ).toFixed(2) + " %"}</div>
                           </div>
                        </button>                                                        
                        <br></br>                                     
                        </>))}                    
                </table>                                                
            </div>
            <div className="col-md-1">              
            </div>
        </div>

        {/* Open kalendar */}
    <Modal show={showcalendar} onHide={handleCloseCalendar}>
        <Modal.Header closeButton>
            <Modal.Title>Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>                       
            <form onSubmit={(e)=> submit(e)}>
                <div className="form-group">
                    <label>{showcalendar.title}</label>                  
                </div>                   
                <ShadowWrapper>
                    <MonitorCalendar 
                        today={today}
                        prevHandler={prevHandler}
                        todayHandler={todayHandler}
                        nextHandler={nextHandler}>
                    </MonitorCalendar>                                             
                        <HabitCalendar startDay={startDay} today={today} items={habitItem} habID={habitIID} refreshPage={refreshPage} 
                        refreshCallGrid={refreshCallgrid}>
                        </HabitCalendar>
                </ShadowWrapper>                
                <div className="row">
                    <div className="col-xs-12">
                        <div className="text-right">
                            <button className="btn btn-primary saveEventBtn">Save event</button>
                            <button onClick={handleCloseCalendar}  className="btn btn-danger saveEventBtn">Close</button>
                        </div>
                    </div>      
                </div> 
            </form>                 
        </Modal.Body>
    </Modal>

        {/* Add habit */}
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Save new habbit</Modal.Title>
        </Modal.Header>
        <Modal.Body>                       
            <form onSubmit={(e)=> submit(e)}>
                <div className="form-group">
                    <label>Title</label>                  
                    <input onChange={(e) => handle(e)} value={habit.habitTitle} id="habitTitle" type="text" className="form-control" placeholder="Title"/>
                    <div style={error.titleError !== "" ? {display: "block" } : {display:"none"}} 
                        className="alert alert-danger hidden" role="alert">{error.titleError}
                    </div>
                </div>   <br></br>
                <div className="form-group">
                    <input onChange={(e) => handle(e)} checked={habit.start == 1} type="radio" id="start" value={1}/> <label for="start1"> Prestajem sa lošom navikom</label><br></br>
                    <input onChange={(e) => handle(e)} checked={habit.start == 2} type="radio" id="start" value={2}/> <label for="start2"> Započinjem dobru naviku</label><br></br>
                    <div style={error.startError !== "" ? {display: "block" } : {display:"none"}} 
                        className="alert alert-danger hidden" role="alert">{error.startError}
                    </div>
                 </div> {/* Start1 je kad želimo prestati sa navikom------ Start2 je kada započinjemo neku dobru naviku  */}
                <div>
                    <input onChange={(e) => handle(e)} value={habit.intention} type="text" id="intention" className="form-control" placeholder="Namjera"/>
                </div>
                <div style={error.intentionError !== "" ? {display: "block" } : {display:"none"}} 
                        className="alert alert-danger hidden" role="alert">{error.intentionError}
                    </div>
                 <hr></hr> 
                <div className="row">
                    <div className="col-xs-12">
                        <div className="text-right">
                            <button className="btn btn-primary saveEventBtn">Save event</button>
                            <button onClick={handleClose}  className="btn btn-danger saveEventBtn">Close</button>
                        </div>
                    </div>      
                </div> 
            </form>                 
        </Modal.Body>
    </Modal>
    </>)    

}else{

    return(<>
        <div className="auth-inner">
            <h2> You are not logged in! </h2>
        </div>
    </>)
}

}

export{HabbitTracker};