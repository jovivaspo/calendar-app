import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { useUiStore } from "../../src/hooks/useUiStore";
import { uiSlice } from "../../src/store/ui/uiSlice";

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer,
    },
    preloadedState: {
      ui: { ...initialState },
    },
  });
};

describe("Pruebas en useUiStore", () => {
  test("Debe regresar los valores por defecto", () => {
    const store = getMockStore({ isDateModalOpen: false });
    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toEqual({
      isDateModalOpen: false,
      openDateModal: expect.any(Function),
      closeDateModal: expect.any(Function),
    });
  });

  test("openDateModal debe colocar true en el isDateModalOpen", () => {
    const store = getMockStore({ isDateModalOpen: false });
    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    const { openDateModal } = result.current;

    act(() => {
      openDateModal();
    });

    expect(result.current.isDateModalOpen).toBeTruthy();
  });

  test("closeDateModal debe colocar true en el isDateModalOpen", () => {
    const store = getMockStore({ isDateModalOpen: true });
    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    const { closeDateModal } = result.current;

    act(() => {
      closeDateModal();
    });

    expect(result.current.isDateModalOpen).toBeFalsy();
  });
});
