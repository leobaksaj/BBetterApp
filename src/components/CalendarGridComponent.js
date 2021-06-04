import React from 'react';
import moment from "moment";
import styled from 'styled-components';

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


const CalendarGridComponent = ({startDay,today}) => {

    const totalDays = 42;
    const day = startDay.clone().subtract(1, 'day');
    const daysArray = [...Array(42)].map(() => day.add(1, 'day').clone());
    // console.log(daysArray);

    const isCurrentDay = (day) => moment().isSame(day, 'day');
    const isSelectedMonth = (day) => today.isSame(day, 'month');
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
            {[...Array(7)].map(() => <CellWrapper isHeader/>)}
            {
                daysArray.map((dayItem) => (
                    <CellWrapper key={dayItem.unix()}
                                 isWeekday={dayItem.day() === 6 || dayItem.day() === 0}
                                 isSelectedMonth={(isSelectedMonth(dayItem))}>
                        <RowInCell justifyContent ={'flex-end'}>
                            <DayWrapper>
                                {!isCurrentDay(dayItem) && dayItem.format('D')}
                                {isCurrentDay(dayItem) && <CurrentDay> {dayItem.format('D')}</CurrentDay>}
                            </DayWrapper>
                        </RowInCell>
                    </CellWrapper>
                ))
            }
        </GridWrapper>
        </>
    );
};

export {CalendarGridComponent};



