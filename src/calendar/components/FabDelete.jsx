import React from "react";
import { useCalendarStore } from "../../hooks/useCalendarStore";

const FabDelete = () => {
  const { deleteEvent } = useCalendarStore();

  const handleDelete = () => {
    deleteEvent();
  };

  return (
    <button
      className="btn btn-danger fab-danger"
      aria-label="btn-label"
      onClick={handleDelete}
    >
      <i className="fas fa-trash-alt"></i>
    </button>
  );
};

export default FabDelete;
