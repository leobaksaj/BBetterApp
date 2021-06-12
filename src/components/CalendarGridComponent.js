import React,{useEffect,useState} from 'react';
import moment from "moment";
import axios from 'axios';
import styled from 'styled-components';
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

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

const CalendarGridComponent = ({startDay,today,items}) => {

    let d = localStorage.getItem('data'); 
    // const totalDays = 42;
    const day = startDay.clone().subtract(1, 'day');
    const daysArray = [...Array(42)].map(() => day.add(1, 'day').clone());   

    function getDateFromCell(key){
        const date11 = new Date(key * 1000).toISOString().slice(0,19).replace('T', ''); 
        const date12 = date11.substring(0,10);    
        // console.log(date12);  
        return date12;
    }

    function parseDateYYYYMMDD(key){ 
        const date = key.substring(0,10);    
        const yyyy = date.substring(6,10);
        const mm = date.substring(3,5);
        const dd = date.substring(0,2);
        const date11 = yyyy +"-"+mm+"-"+dd;
        // console.log(date11);  
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
        synced: 0
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

    function submit(e){      
        e.preventDefault();
        axios.post('/events/new',{
            userId: d,
            eventTitle: event.eventTitle,
            eventDetails: "event.eventDetails",
            eventDate: curdate +" at "+ event.eventDate,            
            eventType: event.eventType,
            eventChecked: false,
            synced: 0
        })
        .then(res =>{
            console.log(res);
            setEvents({
                userId: d,
                eventTitle: "",
                eventDetails: "event.eventDetails",
                eventDate: "",            
                eventType: 0,
                eventChecked: false,
                synced: 0
            })
            handleClose();
        })
        .catch(e => {
            setError({
            err: "Something is wrong. Try again!"
        })
        console.log(err);
        })
            
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
    };
    const reload=()=>window.location.reload();
  
    const isCurrentDay = (day) => moment().isSame(day, 'day');
    const isSelectedMonth = (day) => today.isSame(day, 'month');

  
    let numrow =0;
    
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
                                {!isCurrentDay(dayItem) && dayItem.format('D')}
                                {isCurrentDay(dayItem) && <CurrentDay> {dayItem.format('D')}</CurrentDay>}                                                    
                                {/* {items.map(item => (<div><br></br><br></br>
                                {parseDateYYYYMMDD(item.eventDate) === getDateFromCell(dayItem.unix()+10000) ? "" : ''}</div>))} */}
                            </DayWrapper>                           
                        </RowInCell>           
                            <p className={items.filter(item => (item.synced !== 3)
                             && (parseDateYYYYMMDD(item.eventDate) === getDateFromCell(dayItem.unix()+10000))).length == 0 ? "counter0" : "counter" }>
                             {items.filter(item => (item.synced !== 3)
                             && (parseDateYYYYMMDD(item.eventDate) === getDateFromCell(dayItem.unix()+10000))).length}</p>             
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
                </div>   
                {/* <div className="form-group">
                    <label>Content</label>
                    <textarea onChange={(e) => handle(e)} value={event.eventDetails} id="eventDetails" className="form-control" type="text"  rows="3" ></textarea>
                </div>   */}<br></br>
                <div className="form-group">
                    <input onChange={(e) => handle(e)} type="checkbox" id="eventType" name="event" value={1}/> <label for="event"> Event</label><br></br>
                    <input onChange={(e) => handle(e)} type="checkbox" id="eventType" name="reminder" value={2}/> <label for="reminder"> Reminder</label><br></br>
                    <input onChange={(e) => handle(e)} type="checkbox" id="eventType" name="todo" value={3}/> <label for="todo"> TODO</label><br></br>
                </div> 
                <div>
                    <input onChange={(e) => handle(e)} value={event.eventDate} type="time"  id="eventDate" name="eventDate" required/>
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