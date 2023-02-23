import calendarApi from "../../src/api/calendarAPi";

describe("Pruebas en CalendarApi", () => {
  test("debe tener la configuración por defecto", () => {
    expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
  });
  test("toda petición ddebe contener token en la cabecera", async () => {
    //Añadir token válido
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2M2Y3YTdiNTM0NDRjNTIwNDBmOWM0ZTYiLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNjc3MTc3MTAyLCJleHAiOjE2NzcxODQzMDJ9.UjljDjHAmSsOTAghEufOXdglT_dza0u49XScyjdgBOY";
    localStorage.setItem("token", token);
    const res = await calendarApi.get("/events");
    expect(res.config.headers.Authorization).toBe("bearer " + token);
  });
});
