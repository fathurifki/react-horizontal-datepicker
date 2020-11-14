/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "./DatePicker.module.css"
import {
    addDays,
    addMonths,
    differenceInMonths,
    format,
    isSameDay,
    lastDayOfMonth,
    startOfMonth,
    isWeekend
} from "date-fns";

export default function DatePicker({ endDate, selectDate, getSelectedDay, color, labelFormat }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [status, setStatus] = useState(true)
    const firstSection = { marginLeft: '40px' };
    const startDate = new Date();
    const lastDate = addDays(startDate, endDate || 90);
    // const primaryColor = color || 'rgb(54, 105, 238)';
    const selectedStyle = { fontWeight: "bold", width: "45px", height: "45px", borderRadius: "50%", border: `2px solid #424749`, color: '#ffff', backgroundColor: `#424749` };
    const selectedStyleWeekend = { width: "45px", height: "45px", borderRadius: "50%", color: '#6e7679', opacity: "25%" };
    // const buttonColor = { background: primaryColor };
    // const labelColor = { color: primaryColor };

    const getStyles = (day) => {
        if (isSameDay(day, selectedDate)) {
            return (selectedStyle);
        } else if (isWeekend(day)) {
            return (selectedStyleWeekend)
        }
        return null
    };

    const getId = (day) => {
        if (isSameDay(day, selectedDate)) {
            return ('selected')
        } else {
            return ("")
        }
    };

    function renderDays() {
        const dayFormat = "E";
        const dateFormat = "d";
        const months = [];
        let days = [];
        for (let i = 0; i <= differenceInMonths(lastDate, startDate); i++) {
            let start, end;
            const month = startOfMonth(addMonths(startDate, i));
            start = i === 0 ? Number(format(startDate, dateFormat)) - 1 : 0;
            end = i === differenceInMonths(lastDate, startDate) ? Number(format(lastDate, "d")) : Number(format(lastDayOfMonth(month), "d"));
            for (let j = start; j < end; j++) {
                days.push(
                    <div id={`${getId(addDays(startDate, j))}`}
                        className={styles.dateDayItem}
                        style={getStyles(addDays(month, j))}
                        disabled={true}
                        key={addDays(month, j)}
                        onClick={() => onDateClick(addDays(month, j))}
                    >
                        <div className={styles.dayLabel}>
                            {format(addDays(month, j), dayFormat)}
                        </div>
                        <div className={styles.dateLabel}>
                            {format(addDays(month, j), dateFormat)}
                        </div>
                    </div>
                );
            }
            months.push(
                <div className={styles.monthContainer} key={month}>
                    <div className={styles.daysContainer} style={i === 0 ? firstSection : null}>
                        {days}
                    </div>
                </div>
            );
            days = [];
        }
        return <div id={"container"} className={styles.dateListScrollable}>{months}</div>;
    }

    const onDateClick = day => {
        setSelectedDate(day);
        if (getSelectedDay) {
            getSelectedDay(day);
        }
    };

    useEffect(() => {
        if (getSelectedDay) {
            if (selectDate) {
                getSelectedDay(selectDate);
            } else {
                getSelectedDay(startDate);
            }
        }
    }, []);

    useEffect(() => {
        if (selectDate) {
            if (!isSameDay(selectedDate, selectDate)) {
                setSelectedDate(selectDate);
                setTimeout(() => {
                    let view = document.getElementById('selected');
                    if (view) {
                        view.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                    }
                }, 20);
            }
        }
    }, [selectDate]);

    // const nextWeek = () => {
    //     const e = document.getElementById('container');
    //     const width = e ? e.getBoundingClientRect().width : null;
    //     e.scrollLeft += width - 60;
    // };

    // const prevWeek = () => {
    //     const e = document.getElementById('container');
    //     const width = e ? e.getBoundingClientRect().width : null;
    //     e.scrollLeft -= width - 60;
    // };

    return (
        <div className={styles.container}>
            {/* <div className={styles.buttonWrapper}>
                <button className={styles.button} style={buttonColor} onClick={prevWeek}>←</button>
            </div> */}
            {renderDays()}
            {/* <div className={styles.buttonWrapper}>
                <button className={styles.button} style={buttonColor} onClick={nextWeek}>→</button>
            </div> */}
        </div>
    )
}