import axios from 'axios';
import React,{useEffect,useState,useContext,useRef} from 'react';
import moment from 'moment';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import {Modal} from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
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

    const refreshPage = ()=>{
        axios.get(`/habits/all/${d}`)
        .then(res =>  {
            setHabits(res.data);   
        });
     }    

    /********* MODAL *********** */

    const [show, setShow] = useState(false);
    const [showcalendar, setShowCalendar] = useState(false);

    const handleClose = () => setShow(false);
    const handleCloseCalendar = () => setShowCalendar(false);

    function handleShow(){    
        setShow(true);  
        // let titleError = "";
        // let eventError = "";
        // let timeError = "";
        // setEvents({ titleError, eventError, timeError });
    };

    let habitID = "";
    function handleShowCalendarModal(habID){    
        setShowCalendar(true);  
        setHabit(habID);      
        habitID = habID ;
        console.log(habitID);
        console.log(habit);
    };
    
    function handle(e){
        // const newevent = {...event };
        // newevent[e.target.id] = e.target.value;
        // setEvents(newevent);
    }

    function submit(e){      
        e.preventDefault();
        // const isValid = validate();
        // if (isValid) {
        // axios.post('/events/new',{
        //     userId: d,
        //     eventTitle: event.eventTitle,
        //     eventDetails: "event.eventDetails",
        //     eventDate: curdate +" at "+ event.eventDate,            
        //     eventType: event.eventType,
        //     eventChecked: false,
        //     synced: 0
        // })
        // .then(res =>{
        //     setEvents({
        //         userId: d,
        //         eventTitle: "",
        //         eventDetails: "event.eventDetails",
        //         eventDate: "",            
        //         eventType: 0,
        //         eventChecked: false,
        //         synced: 0
        //     });
        //     handleClose();
        //     refreshPage();
        // })
        // .catch(e => {
        //     setError({
        //     err: "Something is wrong. Try again!"
        // })
        // // console.log(err);
        // })
        // }
                    
    };  

    
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
                        <button className="btn btn-primary habitMap" onClick={() => handleShowCalendarModal(item._id)}>
                            {item.habitTitle}
                        </button><br></br>                                     
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
                        <HabitCalendar startDay={startDay} today={today} items={habit} refreshPage={refreshPage}>
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
                    <input onChange={(e) => handle(e)} id="habbitTitle" type="text" className="form-control" placeholder="Title"></input>
                    <div
                        className="alert alert-danger hidden" role="alert">
                    </div>
                </div>   
                {/* <div className="form-group">
                    <label>Content</label>
                    <textarea onChange={(e) => handle(e)} value={event.eventDetails} id="eventDetails" className="form-control" type="text"  rows="3" ></textarea>
                </div>   */}<br></br>
                {/* <div className="form-group">
                    <input onChange={(e) => handle(e)} checked={event.eventType == 1} type="radio" id="eventType" name="event" value={1}/> <label for="event"> Event</label><br></br>
                    <input onChange={(e) => handle(e)} checked={event.eventType == 2} type="radio" id="eventType" name="reminder" value={2}/> <label for="reminder"> Reminder</label><br></br>
                    <input onChange={(e) => handle(e)} checked={event.eventType == 3} type="radio" id="eventType" name="todo" value={3}/> <label for="todo"> TODO</label><br></br>
                </div> 
                <div style={event.eventError !== "" ? {display: "block" } : {display:"none"}} 
                        className="alert alert-danger hidden" role="alert">{event.eventError}
                    </div>
                <div>
                    <input onChange={(e) => handle(e)} value={event.eventDate} type="time"  id="eventDate" name="eventDate"/>
                </div>
                <div style={event.timeError !== "" ? {display: "block" } : {display:"none"}} 
                        className="alert alert-danger hidden" role="alert">{event.timeError}
                    </div>
                 <hr></hr> */}
                <div className="row">
                    
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