import axios from 'axios';
import React,{useEffect,useState,useContext,useRef} from 'react';
import moment from 'moment';
import { TitleCalendarComponent } from './TitleCalendar';
import { MonitorCalendar } from './MonitorCalendar';
import { CalendarGridComponent } from './CalendarGridComponent';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import {Modal} from 'react-bootstrap';

const ShadowWrapper = styled('div')`
  border-top: 1px solid #737374;
  border-left: 1px solid #464648;
  border-right: 1px solid #464648;
  border-bottom: 2px solid #464648;
  border-radius: 8px;
  overflow:hidden;
  margin: 5px;
`;

function Home(props){

  const refreshPage = ()=>{
    axios.get(`/events/all/${d}`)
    .then(res =>  {
        setItems(res.data);   
    });
 }
    let d = localStorage.getItem('data');  
    ////////// KALENDAR ////////////////
    const [items, setItems] = useState([]); 
    const [items1, setItems1] = useState(); 
    const [sessions, setSessions] = useState([]); 
                
    window.moment =  moment;     
    moment.updateLocale('en', {week:{dow:1}}); 
    const [today, setToday] = useState(moment());
    const startDay = today.clone().startOf('month').startOf('week'); 

    useEffect(() => {
        axios.get(`/events/all/${d}`)
        .then(res =>  {
            setItems(res.data);   
        });   
        axios.get(`/sessions/all/${d}`)
        .then(res =>  {
            setSessions(res.data);   
        });         
    },[]);

    /////////////////////// KRAJ KALENDARA //////////////////
    //////////////////////// TIMER ////////////////////
    const [time, setTime] = useState({
      durationTime: 0
  });

    function handleDurationTime(e){
      const newevent = {...session };
      newevent[e.target.name] = e.target.value;
      setTime(newevent);
  }

    const [session, setSession] = useState({
      userId: d,
      sessionLength: "",
      sessionPoints: "",
      sessionFinished: false,
      synced: 0
  });
  const intervalRef = useState(null);
  const [timer, setTimer]  = useState('00:00:00');

  function getTimeRemaining(endtime){
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total/1000)%60); 
    const minutes = Math.floor((total/1000/60)%60); 
    const hours = Math.floor((total/1000*60*60)%24); 
    const days = Math.floor(total/(1000*60*60*24)); 
   return {
     total,days,hours,minutes,seconds
   };
  }

  function startTimer(deadline){
    let {total,days,hours,minutes,seconds} = getTimeRemaining(deadline);
    if(total >= 0){
      setTimer(
        (hours > 9 ? hours: '0'+hours)+ ':' + (minutes > 9 ? minutes: '0'+minutes)+ ':' +(seconds > 9 ? seconds: '0'+seconds)
      )
     console.log(time.durationTime);
    }else{   
      console.log(time.durationTime);
      clearInterval(intervalRef.current);
      axios.post('/sessions/new',{
            userId: d,
            sessionLength: time.durationTime,
            sessionPoints: time.durationTime,
            sessionFinished: true,
            synced: 0
        })
        .then(res =>{
          console.log(time.durationTime);
            // console.log(res);
            setSession({
              userId: d,
              sessionLength: "",
              sessionPoints: "",
              sessionFinished: true,
              synced: 0
            })
            axios.get(`/sessions/all/${d}`)
            .then(res =>  {
                setSessions(res.data);   
            }) 
          })        
    }
  }

  function clearTimer(endtime){
    setTimer('00:00:00');
    if(intervalRef.current) {clearInterval(intervalRef.current)} 
      const id = setInterval(() => {
        startTimer(endtime);
      },1000)
      intervalRef.current = id;   
  }

  function getDeadlineTime(){ 
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds()+(time.durationTime)*60);
    return deadline; 
  }

  function starttimer(){
    clearTimer(getDeadlineTime());
    return () => {if(intervalRef.current) clearInterval(intervalRef.current)}
  }

  function onClickResetbutton(){
    if(intervalRef.current){    
      setTimer(timer);
      clearInterval(intervalRef);
      clearTimer(getDeadlineTime());
    }
    // console.log("Break"); 
    axios.post('/sessions/new',{
      userId: d,
      sessionLength: time.durationTime,
      sessionPoints: time.durationTime,
      sessionFinished: false,
      synced: 0
  })
  .then(res =>{
    console.log(time.durationTime);
      console.log(res);
      setSession({
        userId: d,
        sessionLength: "",
        sessionPoints: "",
        sessionFinished: false,
        synced: 0
      })
      axios.get(`/sessions/all/${d}`)
      .then(res =>  {
          setSessions(res.data);   
      })
    })    
    // window.location.reload();  
  }

  function parseDateYYYYMMDD(key){ 
    const date = key.substring(0,10);    
    const yyyy = date.substring(0,4);
    const mm = date.substring(5,7);
    const dd = date.substring(8,10);
    const date11 = dd +"."+mm+"."+yyyy;
    // console.log(date11);  
    return date11;
}
      
      /************** DELETEE EVENTS ********************** */

      const [event, setEvents] = useState({
        userId: d,
        eventTitle: "",
        eventDetails: "",
        eventDate: "",            
        eventType: 1,
        eventChecked: false,
        synced: 0
    });

    function submitDeleteEvent(e){      
      e.preventDefault();
      deleteEvents(event);
      // console.log(event);         
  };

    function deleteEvents(event1){
      axios.put(`/events/put/${event1._id}`,{
          userId: d,
          eventTitle: event.eventTitle,
          eventDetails: event.eventDetails,
          eventDate: event.eventDate,
          eventType: event.eventType,
          eventChecked: true,
          synced: 3
      })
      .then(res => {
          // console.log(res.data);
          setEvents({
            userId: d,
            eventTitle: event.eventTitle,
            eventDetails: event.eventDetails,
            eventDate: event.eventDate,
            eventType: event.eventType,
            eventChecked: true,
            synced: 3
          });
          axios.get(`/events/all/${d}`)
          .then(res =>  {
              setItems(res.data);   
          });
          handleCloseDelete();
          })            
          .catch((err) => {
              console.log(err);
          });
    }

    function submitDoneEvent(e){      
      e.preventDefault();
      updateEvent(event);        
  };

  function updateEvent(event1){
      axios.put(`/events/put/${event1._id}`,{
          userId: d,
          eventTitle: event.eventTitle,
          eventDetails: event.eventDetails,
          eventDate: event.eventDate,
          eventType: event.eventType,
          eventChecked: true,
          synced: 2
      })
      .then(res => {
          // console.log(res.data);
          setEvents({
            userId: d,
            eventTitle: event.eventTitle,
            eventDetails: event.eventDetails,
            eventDate: event.eventDate,
            eventType: event.eventType,
            eventChecked: true,
            synced: 2
          });
          axios.get(`/events/all/${d}`)
          .then(res =>  {
              setItems(res.data);   
          });
          handleClose();
          })            
          .catch((err) => {
              console.log(err);
          });
  }

       /************ MODALS ****************** */
       const [show, setShow] = useState(false);
       const [showDelete, setShowDelete] = useState(false);

       const handleClose = () => setShow(false);
       const handleCloseDelete = () => setShowDelete(false);

       function handleShowDelete(id){    
        setShowDelete(true);            
        axios.get(`/events/get/${id}`)
        .then(res =>  {
            setEvents(res.data);               
         })      
    };
   
    function handleShow(id){    
        setShow(true);            
        axios.get(`/events/get/${id}`)
        .then(res =>  {
            setEvents(res.data);                  
        })      
    };
      
    function handleChange(e){
        const newevent = {...event };
        newevent[e.target.name] = e.target.value;
        setEvents(newevent);
    }              
    /************ TAB KONTROLE    ******************** */
    const [toggleState, setToggleState] = useState(1);

    const toggleTab = (index) => {
      setToggleState(index);
    };
    /******** SEARCH ********** */
    const [searchTerm, setSearchTerm] = useState("")

        if(props.user){   
                
            const prevHandler = () =>  setToday(prev => prev.clone().subtract(1, 'month'));   //this.state.setToday.clone().subtract(1, 'month');    
            const todayHandler = () => setToday(moment());
            const nextHandler = () =>  setToday(prev => prev.clone().add(1, 'month'));
            return(<>
                <div className="row mainrow">
                    {/* TODO LISTA */}
                    <div className="todo col-md-3">                    
                    <div className="container leftcontainer">
                      <div className="tab">
                        <div className="bloc-tabs">
                          <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"}  onClick={() => toggleTab(1)}>Event</button>
                          <button className={toggleState === 2 ? "tabs active-tabs" : "tabs"}  onClick={() => toggleTab(2)}>Reminder</button>
                          <button className={toggleState === 3 ? "tabs active-tabs" : "tabs"}  onClick={() => toggleTab(3)}>Todo</button>
                          <button className={toggleState === 4 ? "tabs active-tabs" : "tabs"}  onClick={() => toggleTab(4)}>All</button>
                        </div>
                      </div>
                      <div className="content-tabs">
                        <div className={toggleState === 1 ? "content  active-content" : "content"}>
                        <div>
                            <input onChange={event => {setSearchTerm(event.target.value)}} type="text" placeholder="Search..." className="form-control searchNotes"></input>
                        </div>  
                        <h4>Event</h4>  
                        <div className="sessionMapEvent">                     
                            {items.filter((item) => {
                              if(searchTerm =="" &&  item.synced !== 3 && item.eventType === 1 && item.eventChecked === false ){
                                  return item
                              }else if(item.synced !== 3 && item.eventType === 1 && item.eventChecked === false
                                 && item.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
                                 || item.synced !== 3 && item.eventType === 1 && item.eventChecked === false
                                 && item.eventDate.toLowerCase().includes(searchTerm.toLowerCase()) ){
                                  return item
                              }                             
                            })
                            .map(item => ( 
                            <>
                              <div className="row titlecontent">
                                <div className="titlenote">
                                  <div className="row buttoninnotes">
                                    <button onClick={() => handleShow(item._id)} className="btn btn-secondary NotesBtn">
                                      <FontAwesomeIcon icon={faCheck} /></button> 
                                    <button onClick={() => handleShowDelete(item._id)} className="btn btn-danger NotesBtn">
                                      <FontAwesomeIcon icon={faTrash} /></button>
                                    </div>                                    
                                        <p>{item.eventTitle}</p>                               
                                        <p>{item.eventDate}</p>                                                                       
                                    </div>
                                  </div>               
                          </>)).reverse()}  
                          </div>
                          </div>

                          <div className={toggleState === 2 ? "content  active-content" : "content"}>
                            <div>
                              <input onChange={event => {setSearchTerm(event.target.value)}} type="text" placeholder="Search..." className="form-control searchNotes"></input>
                            </div>  
                            <h4>Reminder</h4>  
                            <div className="sessionMapEvent">                    
                            {items.filter((item) => {
                              if(searchTerm =="" &&  item.synced !== 3 && item.eventType === 2 && item.eventChecked === false ){
                                  return item
                              }else if(item.synced !== 3 && item.eventType === 2 && item.eventChecked === false
                                 && item.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
                                 || item.synced !== 3 && item.eventType === 2 && item.eventChecked === false
                                 && item.eventDate.toLowerCase().includes(searchTerm.toLowerCase()) ){
                                  return item
                              }                             
                            }).map(item => ( 
                                <>
                                  <div className="row titlecontent">
                                    <div className="titlenote">
                                      <div className="row buttoninnotes">
                                        <button onClick={() => handleShow(item._id)} className="btn btn-secondary NotesBtn"><FontAwesomeIcon icon={faCheck} /></button> 
                                        <button onClick={() => handleShowDelete(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                        <p>{item.eventTitle}</p>   
                                        <p>{item.eventDate}</p> 
                                  </div>
                                </div>               
                          </>))}  
                          </div>
                          </div>
                          <div className={toggleState === 3 ? "content  active-content" : "content"}>
                            <div>
                              <input onChange={event => {setSearchTerm(event.target.value)}} type="text" placeholder="Search..." className="form-control searchNotes"></input>
                            </div>  
                            <h4>TODO</h4>   
                            <div className="sessionMapEvent">                    
                            {items.filter((item) => {
                              if(searchTerm =="" &&  item.synced !== 3 && item.eventType === 3 && item.eventChecked === false ){
                                  return item
                              }else if(item.synced !== 3 && item.eventType === 3 && item.eventChecked === false
                                 && item.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
                                 || item.synced !== 3 && item.eventType === 3 && item.eventChecked === false
                                 && item.eventDate.toLowerCase().includes(searchTerm.toLowerCase()) ){
                                  return item
                              }                             
                            }).map(item => ( 
                                <>
                                  <div className="row titlecontent">
                                    <div className="titlenote">
                                      <div className="row buttoninnotes">
                                        <button onClick={() => handleShow(item._id)} className="btn btn-secondary NotesBtn"><FontAwesomeIcon icon={faCheck} /></button> 
                                        <button onClick={() => handleShowDelete(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                        <p>{item.eventTitle}</p>   
                                        <p>{item.eventDate}</p> 
                                  </div>
                                </div>                  
                              </>))}  
                              </div>
                              </div>
                              <div className={toggleState === 4 ? "content  active-content" : "content"}>
                                <div>
                                  <input onChange={event => {setSearchTerm(event.target.value)}} type="text" placeholder="Search..." className="form-control searchNotes"></input>
                                </div>  
                                <h4>All</h4>   
                                <div className="sessionMapEvent">                 
                                   {items.filter((item) => {
                                    if(searchTerm =="" &&  item.synced !== 3 && item.eventChecked === false){
                                        return item
                                    }else if(item.synced !== 3 && item.eventChecked === false
                                       && item.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
                                       || item.synced !== 3 && item.eventChecked === false
                                       && item.eventDate.toLowerCase().includes(searchTerm.toLowerCase()) ){
                                        return item
                                    }                             
                                  })                              
                                .map(item => ( 
                                <>
                                  <div className="row titlecontent">
                                    <div className="titlenote">
                                      <div className="row buttoninnotes">
                                        <button onClick={() => handleShow(item._id)} className="btn btn-secondary NotesBtn"><FontAwesomeIcon icon={faCheck} /></button> 
                                        <button onClick={() => handleShowDelete(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                        <p>{item.eventTitle}</p>   
                                        <p>{item.eventDate}</p> 
                                  </div>
                                </div>                  
                              </>))}  
                              </div>
                              </div>
                        </div>                                                    
                        </div>                     
                    </div>                 
                                {/* KALENDAR  */}
                    <div className="col-md-5 kal">  
                    <ShadowWrapper> 
                        <TitleCalendarComponent></TitleCalendarComponent>
                        <MonitorCalendar 
                            today={today}
                            prevHandler={prevHandler}
                            todayHandler={todayHandler}
                            nextHandler={nextHandler}>
                        </MonitorCalendar>
                        <CalendarGridComponent startDay={startDay} today={today} items={items} refreshPage={refreshPage} ></CalendarGridComponent>
                    </ShadowWrapper> 
                    </div>
                              
                    <div className="col-md-3 todo">            
                    <div className="main-section">
                        <div className="clock-holder">
                            <div className="stopwatch">
                            <div>
                              <h1>Pomodoro timer</h1>
                              <div className="form-group">
                                <input onChange={(e) => handleDurationTime(e)} checked={time.durationTime == 10} className="radiobuttontimer" type="radio" name="durationTime"  value={10}/><label> 10 min </label>
                                <input onChange={(e) => handleDurationTime(e)} checked={time.durationTime == 25} className="radiobuttontimer" type="radio" name="durationTime"  value={25}/><label> 25 min </label>
                                <input onChange={(e) => handleDurationTime(e)} checked={time.durationTime == 30} className="radiobuttontimer" type="radio" name="durationTime"  value={30}/><label> 30 min </label><br></br>
                                <input onChange={(e) => handleDurationTime(e)} checked={time.durationTime == 35} className="radiobuttontimer" type="radio" name="durationTime"  value={35}/><label> 35 min </label>
                                <input onChange={(e) => handleDurationTime(e)} checked={time.durationTime == 40} className="radiobuttontimer" type="radio" name="durationTime"  value={40}/><label> 40 min </label>
                                <input onChange={(e) => handleDurationTime(e)} checked={time.durationTime == 45} className="radiobuttontimer" type="radio" name="durationTime"  value={45}/><label> 45 min </label><br></br>
                              </div> 
                            </div>
                                    <span> {timer}</span><br></br>
                                <button onClick={starttimer} className="stopwatch-btn stopwatch-btn-gre">Start</button>                             
                                <button onClick={onClickResetbutton} className="stopwatch-btn stopwatch-btn-red">Stop</button>   
                                <hr></hr>                               
                                <div className="sessionMap">
                            {sessions.map(item => ( 
                              <>
                                <div className={item.sessionFinished ? "titlecontent1" : "titlecontent2"} >
                                  <div className="row" >
                                    <div className="row buttoninnotes">
                                      </div>                                    
                                          <p>Trajanje sesije: {item.sessionLength} min</p>                               
                                          <p>Datum obavljanja: {parseDateYYYYMMDD(item.createdAt)}</p>                                                                       
                                      </div>
                                    </div>                                           
                            </>)).reverse()}   
                            </div>                             
                            </div>
                        </div>
                    </div>
                </div>                               
            </div>   

             <Modal show={show} onHide={handleClose}>
             <Modal.Header closeButton>
             <Modal.Title>Označi kao odrađeno</Modal.Title>
             </Modal.Header>   
             <Modal.Body>                       
                 <form onSubmit={(e)=> submitDoneEvent(e)}>
                     <div className="form-group">
                         <label>Jeste li sigurni da želite event označiti kao odrađen? </label>     
                         </div>                  
                     <button className="btn btn-primary updateBtn">Potvrdi</button>                               
                 </form>   
                 <button onClick={handleClose} className="btn btn-danger CloseUpdate">Close</button>              
             </Modal.Body>
         </Modal>
            
         <Modal show={showDelete} onHide={handleCloseDelete}>
             <Modal.Header closeButton>
             <Modal.Title>Obriši</Modal.Title>
             </Modal.Header>
             <Modal.Body>                       
                 <form onSubmit={(e)=> submitDeleteEvent(e)}>
                     <div className="form-group">
                         <label>Jeste li sigurni da želite obrisati event? </label>     
                         </div>                  
                     <button className="btn btn-primary updateBtn">Delete</button>                               
                 </form>   
                 <button onClick={handleCloseDelete} className="btn btn-danger CloseUpdate">Close</button>              
             </Modal.Body>
         </Modal>
            </>
            )
        }else{
        return(
            <div className="auth-inner">
                <h2> You are not logged in! </h2>
            </div>
        )}        
}
export {Home};