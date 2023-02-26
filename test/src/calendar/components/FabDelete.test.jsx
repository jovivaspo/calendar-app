import { render, screen } from "@testing-library/react";
import FabDelete from "../../../../src/calendar/components/FabDelete";
import { useCalendarStore } from "../../../../src/hooks/useCalendarStore";

jest.mock("../../../../src/hooks/useCalendarStore");

describe("Pruebas en FabDelete", () => {
  test("Debe de mostrar el componente correctamente", () => {
    useCalendarStore.mockReturnValue({ hasEventSelected: false });
    render(<FabDelete />);
    const btn = screen.getByLabelText("btn-label");
    expect(btn.classList).toContain("btn");
    expect(btn.classList).toContain("btn-danger");
  });
});
