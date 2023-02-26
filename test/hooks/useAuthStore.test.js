import { authSlice } from "../../src/store/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import {
  authenticatedState,
  initialState,
  notAuthenticatedState,
} from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";
import calendarApi from "../../src/api/calendarAPi";

describe("Pruebas en useAuthStore", () => {
  const getMockStore = (initialState) => {
    return configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      preloadedState: {
        auth: { ...initialState },
      },
    });
  };
  test("useAuthStore debe devolver los valores por defecto", () => {
    const store = getMockStore(initialState);
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    console.log(result);
    expect(result.current).toEqual({
      status: "checking",
      user: {},
      errorMessage: undefined,
      startLogin: expect.any(Function),
      startRegister: expect.any(Function),
      checkAuthToken: expect.any(Function),
      startLogOut: expect.any(Function),
    });
  });

  test("startLogin debe realizar el login correctamente", async () => {
    localStorage.clear();
    const store = getMockStore(notAuthenticatedState);
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await act(async () => {
      await result.current.startLogin(testUserCredentials);
    });

    const { errorMessage, status, user } = result.current;
    expect({ errorMessage, status, user }).toEqual({
      status: "authenticated",
      user: { name: "Test User", uid: "63f7a7b53444c52040f9c4e6" },
      errorMessage: undefined,
    });

    expect(localStorage.getItem("token")).toEqual(expect.any(String));
    expect(localStorage.getItem("token-init-date")).toEqual(expect.any(String));
  });

  test("startLogin debe de fallar la autenticación", async () => {
    localStorage.clear();
    const store = getMockStore(notAuthenticatedState);
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await act(async () => {
      await result.current.startLogin({
        email: "userfortest@hotmail.co",
        password: "testing",
      });
    });

    const { errorMessage, status, user } = result.current;
    expect({ errorMessage, status, user }).toEqual({
      status: "not-authenticated",
      user: {},
      errorMessage: "Email no registrado",
    });

    expect(localStorage.getItem("token")).toBe(null);

    waitFor(() => expect(result.current.errorMessage).toBe(undefined));
  });

  test("Debe de crear un nuevo usuario", async () => {
    localStorage.clear();
    const store = getMockStore(notAuthenticatedState);
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    /*Esto será nuestra respuestaa del backend*/
    const spy = jest.spyOn(calendarApi, "post").mockReturnValue({
      data: {
        uid: "id",
        name: "name",
        token: "token",
      },
    });

    await act(async () => {
      await result.current.startRegister({
        name: "Test",
        email: "userfortest@hotmail.co",
        password: "testing",
      });

      const { errorMessage, status, user } = result.current;

      console.log(status, user);
      //Haay que esperar porque primero hace un cheecking
      waitFor(() =>
        expect(result.current).toEqual({
          errorMessage: undefined,
          status: "authenticated",
          user: expect.any(Object),
          startLogin: expect.anay(Function),
          startRegister: expect.anay(Function),
          checkAuthToken: expect.anay(Function),
          startLogOut: expect.anay(Function),
        })
      );

      spy.mockRestore();
    });
  });

  test("Debe de fallar al crear un usuario existente", async () => {
    localStorage.clear();
    const store = getMockStore(notAuthenticatedState);
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await act(async () => {
      await result.current.startRegister({
        name: "Pepe",
        email: "pepe@hotmail.com",
        password: "testing",
      });

      const { errorMessage, status, user } = result.current;

      console.log(status, user);

      //Haay que esperar porque primero hace un cheecking
      waitFor(() =>
        expect(result.current).toEqual({
          errorMessage: expect.any(String),
          status: "not-authenticated",
          user: expect.any(Object),
          startLogin: expect.anay(Function),
          startRegister: expect.anay(Function),
          checkAuthToken: expect.anay(Function),
          startLogOut: expect.anay(Function),
        })
      );
    });
  });

  test("CheckAuthToken debe hacer logout si no hay token", async () => {
    localStorage.clear();
    const store = getMockStore(initialState);
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      ...notAuthenticatedState,
    });
  });

  test("CheckAuthToken debe autenticar si hay un token", async () => {
    const { data } = await calendarApi.post("/auth", {
      email: "userfortest@hotmail.com",
      password: "testing",
    });

    localStorage.setItem("token", data.token);

    const store = getMockStore(initialState);
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: "authenticated",
      user: expect.any(Object),
    });
  });
});
