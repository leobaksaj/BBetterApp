import React from 'react';
import moment from "moment";
import styled from 'styled-components';

const GridWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-gap: 1px;
    background-color: #4D4C4D;
`;
const CellWrapper = styled.div`
	min-height: 80px;
	min-width: 70px;
	background-color: ${props => props.isWeekday ? '#27282A' : '#1E1F21'};
	color: #DDDDDD;
`;

const RowInCell = styled.div`
	display: flex;
	justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
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


const CalendarGridComponent = ({startDay}) => {

    const totalDays = 42;
    const day = startDay.clone().subtract(1, 'day');
    const daysArray = [...Array(42)].map(() => day.add(1, 'day').clone());
    // console.log(daysArray);

    const isCurrentDay = (day) => moment().isSame(day, 'day');
    return(
        <GridWrapper>
            {
                daysArray.map((dayItem) => (
                    <CellWrapper key={dayItem.format('DDMMYYYY')}
                                 isWeekday={dayItem.day() === 6 || dayItem.day() === 0}>
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
    );
};

export {CalendarGridComponent};



