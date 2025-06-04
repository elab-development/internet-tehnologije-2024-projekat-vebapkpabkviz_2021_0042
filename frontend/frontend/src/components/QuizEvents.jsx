import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import QuizEventModal from "./QuizEventModal";
import "./rbc.css";
import InputField from "./InputField";
import Button from "./Button";
import DropDown from "./DropDown";

const QuizEvents = () => {
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSeasonExport, setSelectedSeasonExport] = useState("1");

  const [seasons, setSeasons] = useState([]);

  const fetchSeasons = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/seasons");
      console.log(response.data);
      setSeasons(response.data);
    } catch (error) {
      console.error("Error fetching seasons:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/quiz-events");
      const formattedEvents = response.data.data.map((event) => {
        const startDateTime = new Date(event.start_date_time);
        const endDateTime = new Date(
          startDateTime.getTime() + 3 * 60 * 60 * 1000
        ); // Adding 3 hours
        return {
          id: event.id,
          title: event.name,
          start: startDateTime,
          end: endDateTime,
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    console.log(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const [quizEventData, setQuizEventData] = useState({
    name: "",
    start_date_time: "",
    user_id: window.sessionStorage.getItem("userId"),
    season_id: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizEventData({
      ...quizEventData,
      [name]: value,
    });
  };

  const handleExportICal = (e) => {
    console.log(selectedSeasonExport);
    axios
      .get(`http://127.0.0.1:8000/api/export-ical/${selectedSeasonExport}`, {
        responseType: "blob", // Set the response type to 'blob'
      })
      .then((response) => {
        // Create a Blob object from the response data
        const fileBlob = new Blob([response.data], { type: "text/calendar" });

        // Create a temporary URL to the Blob object
        const fileUrl = window.URL.createObjectURL(fileBlob);

        // Create an anchor element to trigger the download
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.setAttribute("download", "calendar.ics"); // Set the desired file name

        // Append the anchor element to the body and trigger the click event
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up: remove the temporary URL and anchor element
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(fileUrl);
      })
      .catch((error) => {
        console.error("Error exporting iCal:", error);
      });
  };

  const handleSelectChange = (e) => {
    const selectedSeasonId = e.target.value;
    setQuizEventData({
      ...quizEventData,
      season_id: selectedSeasonId,
    });
  };

  const handleSelectChangeExport = (e) => {
    const selectedSeasonId = e.target.value;
    setSelectedSeasonExport(selectedSeasonId);
  };

  const handleDateTimeInputChange = (e) => {
    const date = new Date(e.target.value);
    const formattedDateTime = date.toISOString().replace("T", " ").slice(0, 19);
    setQuizEventData({
      ...quizEventData,
      start_date_time:formattedDateTime,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitted data:", quizEventData);
    let config = {
      data: quizEventData,
      method: "post",
      url: "http://127.0.0.1:8000/api/quiz-events",
      headers: {
        Authorization: "Bearer " + window.sessionStorage.getItem("auth_token"),
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="min-h-[84vh] xl:px-60 2xl:px-80 p-6 bg-slate-300 flex flex-col gap-6">
      <div>
        <h2 className="text-4xl font-bold mb-3">Quiz events</h2>
        <div className="p-3 rounded-lg bg-white" style={{ height: "500px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
          />
          {selectedEvent && (
            <QuizEventModal event={selectedEvent} closeModal={closeModal} />
          )}
        </div>
      </div>
      <div className="flex flex-row gap-3 items-center">
        <div className="basis-2/3">
          <Button
            type="button"
            text="Export iCalendar for"
            onClick={handleExportICal}
          />
        </div>
        <div className="basis-1/3 mb-1">
          <DropDown
            options={seasons.data} // Pass seasons data as options
            handleSelectChange={handleSelectChangeExport} // Handle change accordingly
          />
        </div>
      </div>
      {window.sessionStorage.getItem("role") === "moderator" && (
        <div>
          <h2 className="text-4xl font-bold mb-3">Add new event</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:gap-3 lg:flex-row justify-between">
              <div className="basis-1/3">
                <InputField
                  label="Name"
                  type="text"
                  name="name"
                  value={quizEventData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="basis-1/3">
                <InputField
                  label="Start date and time"
                  type="datetime-local"
                  name="start_date_time"
                  value={quizEventData.start_date_time}
                  onChange={handleDateTimeInputChange}
                />
              </div>
              <div className="basis-1/3">
                <label className="block text-sm font-medium text-gray-700">
                  Season
                </label>
                <DropDown
                  options={seasons.data} // Pass seasons data as options
                  handleSelectChange={handleSelectChange} // Handle change accordingly
                />
              </div>
            </div>

            <div className="lg:mt-0 mt-6">
              <Button type="submit" text="Register" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default QuizEvents;