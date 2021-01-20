import React, { useState } from 'react';
import classes from './AbsencePeriod.module.css';

import Aux from '../../hoc/Auxillary/Auxillary';
import { Checkbox, DatePicker, DayOfWeek, Label, Stack, Text } from '@fluentui/react';
import moment from 'moment';
import TimePicker from 'rc-time-picker';


///Style change into to match fluenui Design
/// border-radius: 2px
/// border: 1px solid rgb(96, 94, 92);
import 'rc-time-picker/assets/index.css';
const AbsencePeriod = (props) => {
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [scheduledOOF, setScheduledOOF] = useState(Boolean);



    const DayPickerString = {
        months: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        shortMonths: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Firday', 'Saturday'],
        shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        goToToday: 'Go to today',
        prevMonthAriaLabel: 'Go to previous month',
        nextMonthAriaLabel: 'Go to next month',
        prevYearAriaLabel: 'Go to previous year',
        nextYearAriaLabel: 'Go to next year',
        closeButtonAriaLabel: 'Close date picker',
        monthPickerHeaderAriaLabel: '{0}, select to change the year',
        yearPickerHeaderAriaLabel: '{0}, select to change the month'
    };

    const fromSelectHandler = (fromDate) => {
        setFromDate(fromDate);
        props.fromDateHandler(fromDate);
    }

    const toSelectHandler = (toDate) => {
        setToDate(toDate);
        props.toDateHandler(toDate);
    }

    const onScheduledOOFChange = (ev, checked) => {
        setScheduledOOF(checked);
    }

    const onFromTimeChange =(time) => {
        if(time === null) {
            props.fromTimeHandler(null);
        }else {
            props.fromTimeHandler(moment(time._d, 'HH:mm'));
        }
    }

    const onToTimeChange = (time) => {
        if(time === null) {
            props.toTimeHandler(null);
        }else {
            props.toTimeHandler(moment(time._d, 'HH:mm'));
        }
    }

    return (
        <Aux>
            <Stack >
                <Stack tokens={aligmentsStackLabelTokens}>
                    <Label>Absence period</Label>
                    <Text>Please enter the period of your absence</Text>
                    <Checkbox label="Scheduled Out of Office" checked={scheduledOOF} onChange={onScheduledOOFChange}/>
                </Stack>
                <Stack horizontal tokens={aligmentsStackFromTokens}>
                    <Label>from: </Label>
                    <DatePicker
                        id="fromDatePicker"
                        className={classes.Control}
                        firstDayOfWeek={DayOfWeek.Monday}
                        string={DayPickerString}
                        showWeekNumbers={true}
                        firstWeekOfYear={1}
                        showMonthPickerAsOverlay={true}
                        isRequired={true}
                        value={fromDate}
                        placeholder="Select a date..."
                        ariaLabel="Select a date"
                        onSelectDate={fromSelectHandler}
                    />
                    <TimePicker 
                    defaultValue={moment('08:00', 'HH:mm')} 
                    showSecond={false} minuteStep={15} 
                    disabled={!scheduledOOF}
                    onChange={onFromTimeChange}
                    />
                </Stack>
                <Stack horizontal tokens={aligmentsStackToTokens} style={{paddingLeft: '40px'}}>
                    <Label>to: </Label>
                    <DatePicker
                        id="toDatePicker"
                        className={classes.Control}
                        firstDayOfWeek={DayOfWeek.Monday}
                        string={DayPickerString}
                        showWeekNumbers={true}
                        firstWeekOfYear={1}
                        showMonthPickerAsOverlay={true}
                        isRequired={true}
                        value={toDate}
                        onSelectDate={toSelectHandler}
                        placeholder="Select a date..."
                        ariaLabel="Select a date"
                    />
                    <TimePicker 
                    defaultValue={moment('18:00', 'HH:mm')} 
                    showSecond={false} 
                    minuteStep={15} 
                    disabled={!scheduledOOF}
                    onChange={onToTimeChange}
                    
                    />

                </Stack>
            </Stack>


        </Aux>
    );
}

const aligmentsStackFromTokens = {
    childrenGap: 40,
    padding: 25
}

const aligmentsStackToTokens = {
    childrenGap: 40
}

const aligmentsStackLabelTokens = {
    childrenGap: 20,
    padding: 25
}


export default AbsencePeriod;