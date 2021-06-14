import axios from 'axios';
import React,{useEffect,useState} from 'react';
import moment from 'moment';
import { TitleCalendarComponent } from './TitleCalendar';
import { MonitorCalendar } from './MonitorCalendar';
import { CalendarGridComponent } from './CalendarGridComponent';
import BtnTimerComponent from './BtnTimerComponent';
import DisplayTimerComponent from './DisplayTimerComponent';
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
                
        window.moment =  moment;     
        moment.updateLocale('en', {week:{dow:1}}); 
        const [today, setToday] = useState(moment());
        const startDay = today.clone().startOf('month').startOf('week'); 

        useEffect(() => {
            // let d = localStorage.getItem('data');
            axios.get(`/events/all/${d}`)
            .then(res =>  {
                setItems(res.data);   
            });
        },[]);

    /////////////////////// KRAJ KALENDARA //////////////////

    //////////////////////// TIMER ////////////////////
    const [time, setTime] = useState({ms:0, s:0, m:0, h:0});
    const [interv, setInterv] = useState();
    const [status, setStatus] = useState(0);
      // Not started = 0
     // started = 1
    // stopped = 2

    const start = () => {
        run();
        setStatus(1);
        setInterv(setInterval(run, 10));
      };

    var updatedMs = time.ms, updatedS = time.s, updatedM = time.m, updatedH = time.h;
    const run = () => {
        if(updatedM === 60){
          updatedH++;
          updatedM = 0;
        }
        if(updatedS === 60){
          updatedM++;
          updatedS = 0;
        }
        if(updatedMs === 100){
          updatedS++;
          updatedMs = 0;
        }
        updatedMs++;
        return setTime({ms:updatedMs, s:updatedS, m:updatedM, h:updatedH});
      };

      const stop = () => {
        clearInterval(interv);
        setStatus(2);
      };
    
      const reset = () => {
        clearInterval(interv);
        setStatus(0);
        setTime({ms:0, s:0, m:0, h:0})
      };
    
      const resume = () => start();   
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
      setEvents({
        userId: d,
        eventTitle: "",
        eventDetails: "",
        eventDate: "",            
        eventType: 1,
        eventChecked: false,
        synced: 3
      });
      deleteEvents(event);
      console.log(event);         
  };

    function deleteEvents(event1){
      console.log(event1._id);
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
          console.log(res.data);
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
      setEvents({
        userId: d,
        eventTitle: "",
        eventDetails: "",
        eventDate: "",            
        eventType: 1,
        eventChecked: false,
        synced: 2
      });
      updateEvent(event);
      // console.log(event);         
  };

  function updateEvent(event1){
      // console.log(event1._id);
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
                    <div className="container">
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
                            <input onChange={event => {setSearchTerm(event.target.value)}} type="text" placeholder="Search..." class="form-control searchNotes"></input>
                        </div>  
                        <h4>Event</h4>                    
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
                          </>))}  
                          </div>

                          <div className={toggleState === 2 ? "content  active-content" : "content"}>
                            <div>
                              <input onChange={event => {setSearchTerm(event.target.value)}} type="text" placeholder="Search..." class="form-control searchNotes"></input>
                            </div>  
                            <h4>Reminder</h4>                    
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
                                        <button onClick={() => deleteEvents(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                        <p>{item.eventTitle}</p>   
                                        <p>{item.eventDate}</p> 
                                  </div>
                                </div>               
                          </>))}  
                          </div>

                          <div className={toggleState === 3 ? "content  active-content" : "content"}>
                            <div>
                              <input onChange={event => {setSearchTerm(event.target.value)}} type="text" placeholder="Search..." class="form-control searchNotes"></input>
                            </div>  
                            <h4>TODO</h4>                    
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
                                        <button onClick={() => deleteEvents(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                        <p>{item.eventTitle}</p>   
                                        <p>{item.eventDate}</p> 
                                  </div>
                                </div>                  
                              </>))}  
                              </div>
                              <div className={toggleState === 4 ? "content  active-content" : "content"}>
                                <div>
                                  <input onChange={event => {setSearchTerm(event.target.value)}} type="text" placeholder="Search..." class="form-control searchNotes"></input>
                                </div>  
                                <h4>All</h4>                    
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
                                        <button onClick={() => deleteEvents(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
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

                                {/* KALENDAR  */}
                    <div className="col-md-5 kal">  
                    <ShadowWrapper> 
                        <TitleCalendarComponent></TitleCalendarComponent>
                        <MonitorCalendar 
                            today={today}
                            prevHandler={prevHandler}
                            todayHandler={todayHandler}
                            nextHandler={nextHandler}
                            items={items}>
                        </MonitorCalendar>
                        <CalendarGridComponent startDay={startDay} today={today} items={items} refreshPage={refreshPage} ></CalendarGridComponent>
                    </ShadowWrapper> 
                    </div>
                              
                    <div className="col-md-3 todo">            
                    <div className="main-section">
                        <div className="clock-holder">
                            <div className="stopwatch">
                                <DisplayTimerComponent time={time}></DisplayTimerComponent>
                                <BtnTimerComponent  status={status} resume={resume} reset={reset} stop={stop} start={start}></BtnTimerComponent>
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