import { useDispatch, useSelector } from "react-redux";
import calendarApi from "../api/calendarAPi";
import { convertEventsToDateEvents } from "../helpers/convertToDateEvents";
import {
  onSetActiveEvent,
  onAddNewEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogOutCalendar,
} from "../store/calendar/calendarSlice";
import Swal from "sweetalert2";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent.id) {
        //Actualizando
        await calendarApi.put("/events/" + calendarEvent.id, calendarEvent);
        dispatch(onUpdateEvent({ ...calendarEvent, user }));
        return;
      }
      //Creando
      const { data } = await calendarApi.post("/events", calendarEvent);
      dispatch(onAddNewEvent({ ...calendarEvent, id: data.id, user }));
    } catch (error) {
      console.log(error);
      Swal.fire("Error al guardar", error.response.data?.message, "error");
    }
  };

  const deleteEvent = async () => {
    try {
      await calendarApi.delete("/events/" + activeEvent.id);
      dispatch(onDeleteEvent());
    } catch (error) {
      Swal.fire("Error al eliminar", error.response.data.message, "error");
      console.log(error);
    }
  };

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get("/events");
      const events = convertEventsToDateEvents(data.events);
      dispatch(onLoadEvents(events));
    } catch (error) {
      console.log("Error cargando eventos");
      console.log(error);
    }
  };

  const logOutCalendar = () => {
    dispatch(onLogOutCalendar());
  };

  return {
    events,
    activeEvent,

    setActiveEvent,
    startSavingEvent,
    deleteEvent,
    startLoadingEvents,
    logOutCalendar,
  };
};
