import React, { Component } from 'react';

import classes from './DatePane.module.css';

class DatePane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: new Date().toLocaleTimeString('de-De', {hour: '2-digit', minute: '2-digit'}),
            currentTimeUtc: new Date().toLocaleTimeString('de-De', {timeZone: 'UTC', hour: '2-digit', minute: '2-digit'})
            
        }        

        const today = new Date();
        this.currentDay = today.getDate();
        this.currentDayName = today.toLocaleString("en-GB", { weekday: "long" });
        this.currentDate = today.toLocaleDateString("de-De", { year: 'numeric', month: 'numeric', day: 'numeric' });
        // this.currentTime = today.toLocaleTimeString();
        this.currentTimeUtc = today.toUTCString();

    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                currentTime: new Date().toLocaleTimeString('de-De', {hour: '2-digit', minute: '2-digit'}),
                currentTimeUtc: new Date().toLocaleTimeString('de-De', {timeZone: 'UTC', hour: '2-digit', minute: '2-digit'})
            })
        }, 60000);
    }

    render() {
        return (
            <div className={classes.DatePane}>
                <span className={classes.CurrentDay}>{this.currentDay}</span>
                <br />
                <span>{this.currentDate}</span>
                <br />
                <span>{this.state.currentTime}</span>
                <br />
                <span>UTC: {this.state.currentTimeUtc}</span>
                <br />
                <span>{this.currentDayName}</span>

            </div>
        );
    };
};

export default DatePane;