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
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

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
      /************** DELETEE TODO ********************** */

      const [event, setEvents] = useState({
        userId: d,
        eventTitle: "",
        eventDetails: "",
        eventDate: "",            
        eventType: 1,
        eventChecked: false,
        synced: 0
    });

    function deleteEvents(id){
      console.log(id)

      axios.get(`/events/get/${id}`)
      .then(res =>  {
          setItems1(res.data);   
          // console.log(items1.noteTitle);
        })
      axios.put(`/events/put/${id}`,{
          userId: d,
          eventTitle:  "qa",
          eventDetails:  "qa",
          eventDate:  "12",            
          eventType: 1,
          eventChecked: false,
          synced: 3
      })
      .then(res => {
              console.log(res.data);
              setEvents({
                userId: d,
                eventTitle:  items1.eventTitle,
                eventDetails:  items1.eventDetails,
                eventDate:  items1.eventDate,            
                eventType: 1,
                eventChecked: false,
                synced: 3
              })
          }).then(             
            axios.get(`/events/all/${d}`)
            .then(res =>  {
                setItems(res.data)  
            })
          )           
          .catch((err) => {
              console.log(err);
          });
    }
        
    /************ TAB KONTROLE    ******************** */

    const [toggleState, setToggleState] = useState(1);

    const toggleTab = (index) => {
      setToggleState(index);
      // console.log(index);
    };

        if(props.user){   
                
            const prevHandler = () =>  setToday(prev => prev.clone().subtract(1, 'month'));   //this.state.setToday.clone().subtract(1, 'month');    
            const todayHandler = () => setToday(moment());
            const nextHandler = () =>  setToday(prev => prev.clone().add(1, 'month'))
            // console.log(items);   
            return(
                <div className="row mainrow">
                    {/* TODO LISTA */}
                    <div className="todo col-md-3">
                    
                    <div className="container">
                      <div className="tab">
                        <div className="bloc-tabs">
                          <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"}  onClick={() => toggleTab(1)}>Todo</button>
                          <button className={toggleState === 2 ? "tabs active-tabs" : "tabs"}  onClick={() => toggleTab(2)}>Remainder</button>
                          <button className={toggleState === 3 ? "tabs active-tabs" : "tabs"}  onClick={() => toggleTab(3)}>Event</button>
                          <button className={toggleState === 4 ? "tabs active-tabs" : "tabs"}  onClick={() => toggleTab(4)}>All</button>
                        </div>
                      </div>
                      <div className="content-tabs">
                        <div className={toggleState === 1 ? "content  active-content" : "content"}>
                        <h4>Todo</h4>                    
                            {items.filter(item => item.synced !== 3 && item.eventType === 1).map(item => ( 
                            <>
                              <div className="row titlecontent">
                                <div className="titlenote">
                                  <div className="row buttoninnotes">
                                    <button className="btn btn-secondary NotesBtn"><FontAwesomeIcon icon={faEdit} /></button> 
                                    <button onClick={() => deleteEvents(item._id)} className="btn btn-danger NotesBtn">
                                      <FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                    <p>{item.eventTitle}</p>
                              {(<span>{item.eventDetails}</span>)}
                              </div>
                            </div>
               
                          </>))}  
                          </div>

                          <div className={toggleState === 2 ? "content  active-content" : "content"}>
                            <h4>Remainder</h4>                    
                                {items.filter(item => item.synced !== 3 && item.eventType === 2).map(item => ( 
                                <>
                                  <div className="row titlecontent">
                                    <div className="titlenote">
                                      <div className="row buttoninnotes">
                                        <button className="btn btn-secondary NotesBtn"><FontAwesomeIcon icon={faEdit} /></button> 
                                        <button onClick={() => deleteEvents(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                        <p>{item.eventTitle}</p>
                                  {(<span>{item.eventDetails}</span>)}
                                  </div>
                                </div>               
                          </>))}  
                          </div>

                          <div className={toggleState === 3 ? "content  active-content" : "content"}>
                            <h4>Event</h4>                    
                                {items.filter(item => item.synced !== 3 && item.eventType === 3).map(item => ( 
                                <>
                                  <div className="row titlecontent">
                                    <div className="titlenote">
                                      <div className="row buttoninnotes">
                                        <button className="btn btn-secondary NotesBtn"><FontAwesomeIcon icon={faEdit} /></button> 
                                        <button onClick={() => deleteEvents(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                        <p>{item.eventTitle}</p>
                                  {(<span>{item.eventDetails}</span>)}
                                  </div>
                                </div>
                  
                              </>))}  
                              </div>

                              <div className={toggleState === 4 ? "content  active-content" : "content"}>
                            <h4>All</h4>                    
                                {items.filter(item => item.synced !== 3).map(item => ( 
                                <>
                                  <div className="row titlecontent">
                                    <div className="titlenote">
                                      <div className="row buttoninnotes">
                                        <button className="btn btn-secondary NotesBtn"><FontAwesomeIcon icon={faEdit} /></button> 
                                        <button onClick={() => deleteEvents(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                        <p>{item.eventTitle}</p>
                                  {(<span>{item.eventDetails}</span>)}
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
                        <CalendarGridComponent startDay={startDay} today={today} items={items} ></CalendarGridComponent>
                    </ShadowWrapper> 
                    </div>
                              
                    <div className="col-md-3 todo">
                    {/* <h2>Hi {this.props.user.firstName} {this.props.user.lastName}</h2> */}
            
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
            )
        }
        return(
            <div className="auth-inner">
                <h2> You are not logged in! </h2>
            </div>
        )       
    
}
export {Home};