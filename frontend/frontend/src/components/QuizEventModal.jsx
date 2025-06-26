import React from "react";
import moment from "moment";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";

const QuizEventModal = ({ event, closeModal, onDelete }) => {
  const formattedStartDate = moment(event.start).format("MMMM Do YYYY, HH:mm");
  const formattedEndDate = moment(event.end).format("MMMM Do YYYY, HH:mm");

  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/quiz-events/${event.id}`, {
        headers: {
          Authorization:
            "Bearer " + window.sessionStorage.getItem("auth_token"),
        },
      })
      .then(() => {
        onDelete(event.id);
        closeModal();
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-slate-300 border rounded-md overflow-hidden shadow-md max-w-xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-3 bg-slate-400">
          <h2 className="text-lg font-bold">Details</h2>
          <div className="flex items-center">
            {window.sessionStorage.getItem("role") === "moderator" && (
              <MdDeleteForever
                className="cursor-pointer text-red-900 text-3xl ml-2"
                style={{ transition: "transform 0.2s" }}
                onClick={handleDelete}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
            )}
            <IoMdClose
              className="cursor-pointer text-3xl ml-2"
              onClick={closeModal}
              style={{ transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            ></IoMdClose>
          </div>
        </div>
        <div className="p-6 px-6 py-3 flex flex-col gap-3">
          <h2 className="text-lg font-bold">{event.title}</h2>
          <p>
            {formattedStartDate} until {formattedEndDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizEventModal;
