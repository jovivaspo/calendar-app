import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { getMessages } from "../../helpers/getMessage";
import esEs from "date-fns/locale/es";

import { parse, startOfWeek, getDay, format } from "date-fns";
import CalendarEvent from "../components/CalendarEvent";
import CalendarModal from "../components/CalendarModal";
import { useUiStore } from "../../hooks/useUiStore";
import { useCalendarStore } from "../../hooks/useCalendarStore";
import FabAddNew from "../components/FabAddNew";
import FabDelete from "../components/FabDelete";
import { useAuthStore } from "../../hooks/useAuthStore";

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

const CalendarPage = () => {
  const { user } = useAuthStore();
  const { events, activeEvent, setActiveEvent, startLoadingEvents } =
    useCalendarStore();

  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "week"
  );

  const { openDateModal } = useUiStore();

  const eventStyleGetter = (event, start, end, isSelected) => {
    // console.log(event, start, end, isSelected);

    const isMyEvent = user.uid === event.user_id || user.uid === event.user.uid;

    const style = {
      backgroundColor: isMyEvent ? "blue" : "red",
      borderRadious: "0px",
    };

    return { style };
  };

  const onDoubleClick = (event) => {
    openDateModal();
  };

  const onSelect = (event) => {
    console.log({ click: event });
    setActiveEvent(event);
    openDateModal();
  };

  const onViewChange = (event) => {
    console.log({ viewChanged: event });
    localStorage.setItem("lastView", event);
  };

  useEffect(() => {
    startLoadingEvents();
  }, []);

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
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChange}
      />
      <CalendarModal />
      <FabAddNew />
      {activeEvent && <FabDelete />}
    </>
  );
};

export default CalendarPage;
