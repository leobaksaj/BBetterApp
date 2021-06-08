import axios from 'axios';
import React,{useEffect,useState} from 'react';
import moment from 'moment';
import { TitleCalendarComponent } from './TitleCalendar';
import { MonitorCalendar } from './MonitorCalendar';
import { CalendarGridComponent } from './CalendarGridComponent';
import BtnTimerComponent from './BtnTimerComponent';
import DisplayTimerComponent from './DisplayTimerComponent';
import styled from "styled-components";

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

    ////////// KALENDAR ////////////////
    const [items, setItems] = useState([]); 
                
        window.moment =  moment;     
        moment.updateLocale('en', {week:{dow:1}}); 
        const [today, setToday] = useState(moment());
        const startDay = today.clone().startOf('month').startOf('week'); 

        useEffect(() => {
            let d = localStorage.getItem('data');
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
                        <h4>TODO List</h4>                    
                            {items.map(item => ( <div className="row titlecontent"><div className="titlenote"> {item.eventTitle}<br></br> 
                            {(<span>{item.eventDetails}</span>)}</div></div> ))}          
                                                      
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