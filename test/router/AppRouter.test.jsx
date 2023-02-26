import { render, screen } from "@testing-library/react";
import AppRouter from "../../src/router/AppRouter";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../src/hooks/useAuthStore");

jest.mock("../../src/calendar/pages/CalendarPage", () => () => {
  return <h1>CalendarPage</h1>;
});

describe("Pruebas en approuter", () => {
  const mockCheckAuthToken = jest.fn();

  beforeAll(() => jest.clearAllMocks());

  test("Debe mostrar la pantalla de carga al llamar checkAuthToken", () => {
    useAuthStore.mockReturnValue({
      status: "checking",
      checkAuthToken: mockCheckAuthToken,
    });
    render(<AppRouter />);
    expect(screen.getByText("Cargando..."));
    expect(mockCheckAuthToken).toHaveBeenCalled();
  });

  test("Debe mostrar el login cuando no esté authenticado", () => {
    useAuthStore.mockReturnValue({
      status: "not-authenticated",
      checkAuthToken: mockCheckAuthToken,
    });
    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("Ingreso"));
  });

  test("Debe mostrar el calendar cuando esté authenticado", () => {
    useAuthStore.mockReturnValue({
      status: "authenticated",
      checkAuthToken: mockCheckAuthToken,
    });
    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );
    screen.debug();
    expect(screen.getByText("CalendarPage"));
  });
});
