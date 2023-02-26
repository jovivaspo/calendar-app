import {
  calendarSlice,
  onAddNewEvent,
  onDeleteEvent,
  onLogOutCalendar,
  onSetActiveEvent,
  onUpdateEvent,
} from "../../../src/store/calendar/calendarSlice";
import {
  calendarWithEventsState,
  events,
  initialState,
} from "../../fixtures/calendarState";

describe("Pruebas en calendarSlice", () => {
  test("debe regresar el estado por defecto", () => {
    const state = calendarSlice.getInitialState();
    expect(state).toEqual(initialState);
  });

  test("onSetActiveEvent debe activar el evento", () => {
    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onSetActiveEvent(events[0])
    );
    expect(state.activeEvent).toEqual(events[0]);
  });
  test("onAddNewEvent debe agregar un nuevo evento", () => {
    const numEventos = calendarWithEventsState.events.length;
    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onAddNewEvent(events[0])
    );

    expect(state.events.length).toBe(numEventos + 1);
  });
  test("onUpdateEvent debe actualizar un nuevo evento", () => {
    const eventToUpdated = { ...events[0] };
    eventToUpdated["title"] = "New title";
    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onUpdateEvent(eventToUpdated)
    );

    expect(state.events[0]).toEqual(eventToUpdated);
  });

  test("onDeleteEvent debe borrar un evento", () => {
    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onSetActiveEvent(events[0])
    );
    const newState = calendarSlice.reducer(state, onDeleteEvent);
    expect(newState.events).toEqual(expect.not.arrayContaining([events[0]]));
  });
  test("OnLogOutCalendar debe reiniciar el estado ", () => {
    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onLogOutCalendar()
    );
    expect(state).toEqual(initialState);
  });
});
