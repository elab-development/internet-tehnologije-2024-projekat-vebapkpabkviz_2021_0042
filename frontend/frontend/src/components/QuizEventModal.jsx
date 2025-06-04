import React from "react";
import moment from "moment";
import { IoMdClose } from "react-icons/io";

const QuizEventModal = ({ event, closeModal }) => {
  const formattedStartDate = moment(event.start).format("MMMM Do YYYY, HH:mm");
  const formattedEndDate = moment(event.end).format("MMMM Do YYYY, HH:mm");

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-slate-300 border p-4 rounded-md shadow-md w-96 flex flex-col">
        <IoMdClose className="cursor-pointer" onClick={closeModal}></IoMdClose>
        <h2 className="text-lg font-bold my-2">{event.title}</h2>
        <p>
          {formattedStartDate} until {formattedEndDate}
        </p>
        {/* Add more event details as needed */}
      </div>
    </div>
  );
};

export default QuizEventModal;
