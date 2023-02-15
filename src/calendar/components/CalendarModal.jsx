import { addHours, differenceInSeconds } from "date-fns";
import React, { useMemo, useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import es from "date-fns/locale/es";
import { useUiStore } from "../../hooks/useUiStore";
import { useCalendarStore } from "../../hooks/useCalendarStore";
registerLocale("es", es);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const initialForm = {
  title: "",
  notes: "",
  start: new Date(),
  end: addHours(new Date(), 2),
};

const CalendarModal = () => {
  const { isDateModalOpen, closeDateModal } = useUiStore();
  const { activeEvent, startSavingEvent } = useCalendarStore();

  const [form, setForm] = useState(initialForm);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const titleClass = useMemo(() => {
    if (!formSubmitted) return "";
    return form.title.length > 0 ? "" : "is-invalid";
  }, [form.title, formSubmitted]);

  useEffect(() => {
    if (activeEvent !== null) {
      setForm({ ...activeEvent });
    }
  }, [activeEvent]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onDateChange = (event, changing) => {
    setForm({
      ...form,
      [changing]: event,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const difference = differenceInSeconds(form.end, form.start);

    if (isNaN(difference) || difference <= 0) {
      Swal.fire("Fechas incorrectas", "Revise las fechas", "error");
      return;
    }
    if (form.title.length <= 0) {
      Swal.fire("No exite título", "Complete el campo", "error");
      return;
    }

    console.log(form);

    await startSavingEvent(form);

    onCloseModal();

    setForm(initialForm);

    setFormSubmitted(false);
  };

  const onCloseModal = () => {
    closeDateModal();
  };

  return (
    <Modal
      className="modal"
      isOpen={isDateModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      contentLabel="Example Modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h1> Nuevo evento </h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>
        <div className="form-group mb-2">
          <label>Fecha y hora inicio</label>
          <DatePicker
            className="form-control"
            selected={form.start}
            onChange={(event) => onDateChange(event, "start")}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>

        <div className="form-group mb-2">
          <label>Fecha y hora fin</label>
          <DatePicker
            minDate={form.start}
            className="form-control"
            selected={form.end}
            onChange={(event) => onDateChange(event, "end")}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${titleClass}`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={form.title}
            onChange={onChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={form.notes}
            onChange={onChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};

export default CalendarModal;