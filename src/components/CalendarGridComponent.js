import React,{useState} from 'react';
import moment from "moment";
import axios from 'axios';
import styled from 'styled-components';
import {Modal} from 'react-bootstrap';

const GridWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
    // grid-template-rows: repeat(6, 1fr);
    grid-gap: 1px;
    background-color: #4D4C4D;
   
`;
const CellWrapper = styled.div`
	min-height: ${props => props.isHeader ? 4 : 80}px;
	min-width: 50px;
	background-color: ${props => props.isWeekday ? '#27282A' : '#1E1F21'};
    color: ${props => props.isSelectedMonth ? '#DDDDDD' : '#555759'}
`;

const RowInCell = styled.div`
	display: flex;
	justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
    ${props => props.pr && `padding-right: ${props.pr * 8}px`}
`;

const DayWrapper = styled.div`
	height: 31px;
	width: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px;`
;

const CurrentDay = styled('div')`
  height: 100%;
  width: 100%;
  background: #f00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CalendarGridComponent = ({startDay,today,items, refreshPage}) => {

    let d = localStorage.getItem('data'); 
    const day = startDay.clone().subtract(1, 'day');
    const daysArray = [...Array(42)].map(() => day.add(1, 'day').clone());   

    function getDateFromCell(key){
        const date11 = new Date(key * 1000).toISOString().slice(0,19).replace('T', ''); 
        const date12 = date11.substring(0,10);      
        return date12;
    }

    function parseDateYYYYMMDD(key){ 
        const date = key.substring(0,10);    
        const yyyy = date.substring(6,10);
        const mm = date.substring(3,5);
        const dd = date.substring(0,2);
        const date11 = yyyy +"-"+mm+"-"+dd;  
        return date11;
    }
    const [err, setError] = useState();    

    const [event, setEvents] = useState({
        userId: d,
        eventTitle: "",
        eventDetails: "",
        eventDate: "",            
        eventType: 0,
        eventChecked: false,
        synced: 0,
        titleError: "",
        eventError: "",
        timeError: "",
    });
 
    const [curdate, setCurrDate] = useState();

    const clickCell = (key) =>{
        const date = new Date(key * 1000).toISOString().slice(0,19).replace('T', ''); 
        const date12 = date.substring(0,10);   
        const yyyy = date12.substring(0,4);
        const mm = date12.substring(5,7);
        const dd = date12.substring(8,10);
        const date11 = dd +"."+mm+"."+yyyy ;     
        setCurrDate(date11);        
        handleShow();             
    }

    const validate = () => {
        let titleError = "";
        let eventError = "";
        let timeError = "";
    
        if (!event.eventTitle) {
          titleError = "Title cannot be blank!";
        }    
        if (!event.eventType) {
            eventError = "Please select an event type!";
        }
        if (!event.eventDate) {
            timeError = "Please select time!";
        }    
        if (titleError || eventError || timeError) {
          setEvents({ titleError, eventError, timeError });
          return false;
        }    
        return true;
      };

    function submit(e){      
        e.preventDefault();
        const isValid = validate();
        if (isValid) {
        axios.post(`/events/new/${d}`,{
            userId: d,
            eventTitle: event.eventTitle,
            eventDetails: "event.eventDetails",
            eventDate: curdate +" at "+ event.eventDate,            
            eventType: event.eventType,
            eventChecked: false,
            synced: 0
        })
        .then(res =>{
            setEvents({
                userId: d,
                eventTitle: "",
                eventDetails: "event.eventDetails",
                eventDate: "",            
                eventType: 0,
                eventChecked: false,
                synced: 0
            });
            handleClose();
            refreshPage();
        })
        .catch(e => {
            setError({
            err: "Something is wrong. Try again!"
        })
        // console.log(err);
        })
        }
                    
    };

    function handle(e){
        const newevent = {...event };
        newevent[e.target.id] = e.target.value;
        setEvents(newevent);
    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    function handleShow(){    
        setShow(true);  
        let titleError = "";
        let eventError = "";
        let timeError = "";
        setEvents({ titleError, eventError, timeError });
    };
  
    const isCurrentDay = (day) => moment().isSame(day, 'day');
    const isSelectedMonth = (day) => today.isSame(day, 'month');  
   
    function refreshCalGrid(dayItem){
       return  <p className={items.filter(item => (item.synced !== 3) && (item.eventChecked === false)
            && (parseDateYYYYMMDD(item.eventDate) === getDateFromCell(dayItem.unix()+10000))).length == 0 ? "counter0" : "counter" }>
            {items.filter(item => (item.synced !== 3) && item.eventChecked === false
            && (parseDateYYYYMMDD(item.eventDate) === getDateFromCell(dayItem.unix()+10000))).length}</p>; 
    }
    
    return(        
        <>      
        <GridWrapper isHeader>
            {[...Array(7)].map((_,i)=> (
                <CellWrapper isHeader isSelectedMonth>
                    <RowInCell justifyContent ={'flex-end'} pr={1}>
                        {moment().day(i+1).format('ddd')}
                    </RowInCell>
                </CellWrapper>
            ))}
        </GridWrapper>
        <GridWrapper >
            {[...Array(7)].map(() => <CellWrapper  isHeader/>)}
            {
                daysArray.map((dayItem) => ( 
                    <CellWrapper key={dayItem.unix()}   
                    onClick={() => {clickCell(dayItem.unix()+10000)}}                             
                                 isWeekday={dayItem.day() === 6 || dayItem.day() === 0}
                                 isSelectedMonth={(isSelectedMonth(dayItem))}>
                        <RowInCell justifyContent ={'flex-end'}>
                            <DayWrapper>                            
                                {!isCurrentDay(dayItem) && dayItem.format('D') /* svi ostali dani */}
                                {isCurrentDay(dayItem) && <CurrentDay> {dayItem.format('D')}</CurrentDay> /* današnji dan  */}                                                     
                            </DayWrapper>                           
                        </RowInCell>           
                                {refreshCalGrid(dayItem)}     
                    </CellWrapper>
                ))
            }
        </GridWrapper>


        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Save new event</Modal.Title>
        </Modal.Header>
        <Modal.Body>                       
            <form onSubmit={(e)=> submit(e)}>
                <div className="form-group">
                    <label>Title</label>                  
                    <input onChange={(e) => handle(e)} value={event.eventTitle} id="eventTitle" type="text" className="form-control" placeholder="Title"></input>
                    <div style={event.titleError !== "" ? {display: "block" } : {display:"none"}} 
                        className="alert alert-danger hidden" role="alert">{event.titleError}
                    </div>
                </div>   
                {/* <div className="form-group">
                    <label>Content</label>
                    <textarea onChange={(e) => handle(e)} value={event.eventDetails} id="eventDetails" className="form-control" type="text"  rows="3" ></textarea>
                </div>   */}<br></br>
                <div className="form-group">
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

        </>
    );
};

export {CalendarGridComponent};