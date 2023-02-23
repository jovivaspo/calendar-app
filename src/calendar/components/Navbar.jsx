import { useAuthStore } from "../../hooks/useAuthStore";
import { useCalendarStore } from "../../hooks/useCalendarStore";

const Navbar = () => {
  const { startLogOut, user } = useAuthStore();
  const { logOutCalendar } = useCalendarStore();

  return (
    <div className="navbar navbar-dark bg-dark mb-4 px-4">
      <span className="navbar-brand">
        <i className="fas fa-calendar-alt"></i>
        &nbsp; {user?.name}
      </span>
      <button
        className="btn btn-outline-danger"
        onClick={() => {
          startLogOut();
          logOutCalendar();
        }}
      >
        <i className="fas fa-sign-out-alt"></i>
        <span>Salir</span>
      </button>
    </div>
  );
};

export default Navbar;
