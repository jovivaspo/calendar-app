import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { getMessages } from "../../helpers/getMessage";
import esEs from "date-fns/locale/es";

import { addHours, parse, startOfWeek, getDay, format } from "date-fns";
import CalendarEvent from "../components/CalendarEvent";

const locales = {
  es: esEs,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: "Cumpleaños de Jorge",
    notes: "Hay que preparar la tarta",
    start: new Date(),
    end: addHours(new Date(), 2),
    bgColor: "fafafa",
    user: {
      _id: 123,
      name: "Pepe",
    },
  },
];

const CalendarPage = () => {
  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "week"
  );

  const eventStyleGetter = (event, start, end, isSelected) => {
    // console.log(event, start, end, isSelected);

    const style = {
      backgroundColor: "red",
      borderRadious: "0px",
    };

    return { style };
  };

  const onDoubleClick = (event) => {
    console.log({ doubleClick: event });
  };

  const onSelect = (event) => {
    console.log({ click: event });
  };

  const onViewChange = (event) => {
    console.log({ viewChanged: event });
    localStorage.setItem("lastView", event);
  };

  return (
    <>
      <Navbar />

      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc( 100vh - 80px" }}
        messages={getMessages()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent,
        }}
        onSelectEvent={onSelect}
        onView={onViewChange}
        onDoubleClickEvent={onDoubleClick}
      />
    </>
  );
};

export default CalendarPage;
