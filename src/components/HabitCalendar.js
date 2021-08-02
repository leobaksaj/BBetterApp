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
    //grid-template-rows: repeat(6, 1fr);
    grid-gap: 1px;
    background-color: #4D4C4D;   
`;

const CellWrapper = styled.div`
	height: ${props => props.isHeader ? 20 : 60}px;
	min-width: 35px;
	background-color: ${props => props.isWeekday ? '#27282A' : '#1E1F21'};
    color: ${props => props.isSelectedMonth ? '#DDDDDD' : '#555759'}
`;

const RowInCell = styled.div`
	display: flex;
	justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
    ${props => props.pr && `padding-right: ${props.pr * 8}px`}
`;

const DayWrapper = styled.div`
	height: 21px;
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

const HabitCalendar = ({startDay,today,items, refreshPage}) => {

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

    const [habit, setHabits] = useState({
        userId: "",
        habitTitle: "",
        start: 2,
        habitDates: [{"date" : ""}],
        intentions: [{"intention" :""}]
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
        console.log(items);      
        // handleShow();  
        axios.patch(`/habits/date/${items}`,{
            date: date11,                     
        })
        .then(res =>{
            setHabits({
                date: "31.06.2021",  
            });
            // handleClose();
            refreshPage();
        })
        .catch(e => {
            setError({
            err: "Something is wrong. Try again!"
        })
        // console.log(err);
        })           
    }

    // const validate = () => {
    //     let titleError = "";
    //     let eventError = "";
    //     let timeError = "";
    
    //     if (!event.eventTitle) {
    //       titleError = "Title cannot be blank!";
    //     }    
    //     if (!event.eventType) {
    //         eventError = "Please select an event type!";
    //     }
    //     if (!event.eventDate) {
    //         timeError = "Please select time!";
    //     }
    
    //     if (titleError || eventError || timeError) {
    //       setEvents({ titleError, eventError, timeError });
    //       return false;
    //     }    
    //     return true;
    //   };

     function submit(e){      
    //     e.preventDefault();
    //     const isValid = validate();
    //     if (isValid) {
    //         axios.post('/events/new',{
    //             userId: d,
    //             habitTitle: event.eventTitle,
    //             start: 2,
    //             habitDates: [{date: "30.06.2021"}], 
    //             intentions: [{intention: "30.06.2021"}],           
    //         })
    //         .then(res =>{
    //             setEvents({
    //                 userId: d,
    //                 habitTitle: event.eventTitle,
    //                 start: 2,
    //                 habitDates: [{date: "30.06.2021"}], 
    //                 intentions: [{intention: "30.06.2021"}],           
    //             });
    //             handleClose();
    //             refreshPage();
    //         })
    //         .catch(e => {
    //             setError({
    //             err: "Something is wrong. Try again!"
    //         })
    //         // console.log(err);
    //         })           
    //     }
                    
     };

     function handle(e){
    //     const newevent = {...event };
    //     newevent[e.target.id] = e.target.value;
    //     setEvents(newevent);
     }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

     function handleShow(){    
    //     setShow(true);  
    //     let titleError = "";
    //     let eventError = "";
    //     let timeError = "";
    //     setEvents({ titleError, eventError, timeError });
     };
  
    const isCurrentDay = (day) => moment().isSame(day, 'day');
    const isSelectedMonth = (day) => today.isSame(day, 'month');  
    let numrow =0;

    // function refreshCalGrid(dayItem){
    //    return  <p className={items.filter(item => (item.synced !== 3) && (item.eventChecked === false)
    //         && (parseDateYYYYMMDD(item.eventDate) === getDateFromCell(dayItem.unix()+10000))).length == 0 ? "counter0" : "counter" }>
    //         {items.filter(item => (item.synced !== 3) && item.eventChecked === false
    //         && (parseDateYYYYMMDD(item.eventDate) === getDateFromCell(dayItem.unix()+10000))).length}</p>; 
    // }
    
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
            <GridWrapper>
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
                                {/* {refreshCalGrid(dayItem)}      */}
                    </CellWrapper>
                ))
            }
        </GridWrapper>         

        </>
    );
};

export {HabitCalendar};