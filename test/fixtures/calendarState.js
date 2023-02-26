export const events = [
  {
    id: "1",
    start: new Date("2023-02-24 16:00:00"),
    end: new Date("2023-02-25 16:00:00"),
    title: "Test",
    notes: "test",
  },
  {
    id: "2",
    start: new Date("2023-02-24 16:00:00"),
    end: new Date("2023-02-25 16:00:00"),
    title: "Test-2",
    notes: "test",
  },
];

export const initialState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null,
};

export const calendarWithEventsState = {
  isLoadingEvents: false,
  events,
  activeEvent: null,
};

export const calendarWithActiveEventState = {
  isLoadingEvents: false,
  events,
  activeEvent: { ...events[0] },
};
