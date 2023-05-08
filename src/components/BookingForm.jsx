import { useState } from "react";
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ru from 'dayjs/locale/ru';
import { ruRU } from '@mui/x-date-pickers/locales';

import "../styles/BookingForm.css"

export default function BookingForm() {

    const initialState = {
        tower: "",
        floorNumber: null,
        roomNumber: null,
        date: null,
        timeStart: null,
        timeEnd: null,
        comment: "",
    };

    const [formState, setFormState] = useState(initialState);

    const dataToSend = {
        tower: formState.tower,
        floorNumber: formState.floorNumber,
        roomNumber: formState.roomNumber,

        dateTimeStart: (formState.date && formState.timeStart) 
                        ? 
                        dayjs(formState.timeStart).date(dayjs(formState.date).date())
                            .month(dayjs(formState.date).month())
                            .year(dayjs(formState.date).year())
                            .day(dayjs(formState.date).day())

                            .toDate()
                        : null,

        dateTimeEnd:    (formState.date && formState.timeEnd) 
                        ? 
                        dayjs(formState.timeEnd).date(dayjs(formState.date).date())
                            .month(dayjs(formState.date).month())
                            .year(dayjs(formState.date).year())
                            .day(dayjs(formState.date).day())
                            .toDate()
                        : null,

        comment: formState.comment,
    };

    const handleSendData = (event) => {
        event.preventDefault();
        console.log(dataToSend);
    }
    
    const handleClearForm = (event) => {
        event.preventDefault();
        setFormState(initialState);
    }

    const floors = Array.from({length: 27 - 3 + 1}, (element, index) => 3 + index);

    const rooms = Array.from({length: 10}, (element, index) => 1 + index);
    

    return (
        <>
        <LocalizationProvider 
            dateAdapter={AdapterDayjs}
            adapterLocale={'ru'}
            localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
        >
            <form onSubmit={handleSendData} onReset={handleClearForm}>
                <h1>Форма бронирования переговорной</h1>
                <label className="choose-tower">
                    Выберите башню:
                    <select
                        value={formState.tower}
                        onChange={event => setFormState({...formState, tower: event.target.value})}
                    >
                        <option value={""}></option>
                        <option value={"А"}>А</option>
                        <option value={"Б"}>Б</option>
                    </select>
                </label>

                <label className="choose-floor">
                    Выберите этаж:
                    <select
                        value={formState.floorNumber || ""}
                        onChange={event => setFormState({...formState, floorNumber: Number(event.target.value) || null})}
                    >
                        <option value={""}></option>
                        {
                            floors.map((floor) =>
                                <option key={floor} value={floor}>{floor}</option> 
                            )
                        }
                    </select>
                </label>

                <label>
                    Выберите переговорку:
                    <select
                        value={formState.roomNumber || ""}
                        onChange={event => setFormState({...formState, roomNumber: Number(event.target.value) || null})}
                    >
                        <option value={""}></option>
                        {
                            rooms.map((room) => 
                                <option key={room} value={room}>{room}</option>
                            )
                        }
                    </select>
                </label>

                <DatePicker
                    label="Выберите дату"
                    value={formState.date}
                    onChange={
                        (newValue, context) => {
                            if (context.validationError === null) {
                                setFormState({...formState, date: dayjs(newValue).toDate()})
                            }
                        }
                    }
                    disablePast
                />
                
                {
                    formState.date 
                    ? 
                        <TimePicker
                            label="Выберите время начала" 
                            value={formState.timeStart}
                            onChange={
                                (newValue, context) => {
                                    if (context.validationError === null) {
                                        const newTimeStart = dayjs(newValue).toDate();
                                        setFormState({
                                            ...formState, 
                                            timeStart: newTimeStart
                                        });
                                    }
                                }
                            }
                            maxTime={formState.timeEnd && dayjs(formState.timeEnd).subtract(1,'minute')}
                        />
                    :
                    false
                }
                
                {
                    formState.date && formState.timeStart 
                    ? 
                    <TimePicker 
                        label="Выберите время окончания"
                        value={formState.dateTimeEnd}
                        onChange={
                            (newValue, context) => {
                                if (context.validationError === null) {
                                    const newTimeEnd = dayjs(newValue).toDate();
                                    setFormState({
                                        ...formState, 
                                        timeEnd: newTimeEnd
                                    });
                                }
                            }
                        }
                        minTime={formState.timeStart && dayjs(formState.timeStart).add(1,'minute')}
                    />
                    : 
                    false
                }

                <label>
                    <textarea 
                        value={formState.comment}
                        placeholder="Комментарий..."
                        onChange={event => setFormState({...formState, comment: event.target.value})}
                    />
                </label>

                <label>
                    <input className="form-button" type="submit" value={"Отправить"} />
                </label>

                <label>
                    <input className="form-button" type="reset" value={"Очистить"} />
                </label>
            </form>
        </LocalizationProvider>
        </>
    );
}