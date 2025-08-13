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

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const QuizEvents = () => {
  const localizer = momentLocalizer(moment);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [selectedSeasonExport, setSelectedSeasonExport] = useState("");
  const [seasons, setSeasons] = useState([]);

  const [quizEventData, setQuizEventData] = useState({
    name: "",
    start_date_time: "",
    user_id: Number(window.sessionStorage.getItem("userId")),
    season_id: "",
  });

  const [seasonData, setSeasonData] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  // Fetch seasons
  const fetchSeasons = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/seasons");
      setSeasons(response.data);
    } catch (error) {
      console.error("Error fetching seasons:", error);
    }
  };

  // Fetch quiz events
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/quiz-events");
      const formattedEvents = response.data.data.map((event) => {
        const startDateTime = new Date(event.start_date_time);
        const endDateTime = new Date(startDateTime.getTime() + 3 * 60 * 60 * 1000);
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

  // On mount fetch seasons and events
  useEffect(() => {
    fetchSeasons();
    fetchData();
  }, []);

  // When seasons change, set default IDs if empty
  useEffect(() => {
    const list = seasons?.data || [];
    if (list.length) {
      if (!quizEventData.season_id) {
        setQuizEventData((prev) => ({ ...prev, season_id: String(list[0].id) }));
      }
      if (!selectedSeasonExport) {
        setSelectedSeasonExport(String(list[0].id));
      }
    }
  }, [seasons]);

  const handleSelectEvent = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);
  const handleEventDelete = (eventId) => setEvents(events.filter((event) => event.id !== eventId));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChangeSeason = (e) => {
    const { name, value } = e.target;
    setSeasonData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExportICal = () => {
    axios
      .get(`http://localhost:8000/api/export-ical/${selectedSeasonExport}`, {
        responseType: "blob",
      })
      .then((response) => {
        const fileBlob = new Blob([response.data], { type: "text/calendar" });
        const fileUrl = window.URL.createObjectURL(fileBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.setAttribute("download", "calendar.ics");
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(fileUrl);
      })
      .catch((error) => console.error("Error exporting iCal:", error));
  };

  const handleSelectChange = (e) => {
    const selectedSeasonId = e.target.value;
    setQuizEventData((prev) => ({ ...prev, season_id: selectedSeasonId }));
  };

  const handleSelectChangeExport = (e) => {
    const selectedSeasonId = e.target.value;
    setSelectedSeasonExport(selectedSeasonId);
  };

  const handleDateTimeInputChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const offset = selectedDate.getTimezoneOffset();
    const adjustedDate = new Date(selectedDate.getTime() - offset * 60 * 1000);
    const formattedDateTime = adjustedDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    setQuizEventData((prev) => ({ ...prev, start_date_time: formattedDateTime }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let config = {
      data: quizEventData,
      method: "post",
      url: "http://localhost:8000/api/quiz-events",
      headers: {
        Authorization: "Bearer " + window.sessionStorage.getItem("auth_token"),
      },
    };
    axios
      .request(config)
      .then(() => fetchData())
      .catch((error) => {
        console.log("Error:", error.response?.data || error);
      });
  };

  const handleSubmitSeason = (e) => {
    e.preventDefault();
    let config = {
      data: seasonData,
      method: "post",
      url: "http://localhost:8000/api/seasons",
      headers: {
        Authorization: "Bearer " + window.sessionStorage.getItem("auth_token"),
      },
    };
    axios
      .request(config)
      .then(() => fetchSeasons())
      .catch((error) => {
        console.log("Error:", error.response?.data || error);
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
            <QuizEventModal
              event={selectedEvent}
              closeModal={closeModal}
              onDelete={handleEventDelete}
            />
          )}
        </div>
      </div>

      <div className="flex flex-row gap-3 items-center">
        <div className="basis-2/3">
          <Button type="button" text="Export iCalendar for" onClick={handleExportICal} />
        </div>
        <div className="basis-1/3 mb-1">
          <DropDown
            value={selectedSeasonExport}
            options={seasons.data}
            handleSelectChange={handleSelectChangeExport}
          />
        </div>
      </div>

      {window.sessionStorage.getItem("role") === "moderator" && (
        <>
          <div>
            <h2 className="text-4xl font-bold mb-3">Add new season</h2>
            <form onSubmit={handleSubmitSeason}>
              <div className="flex flex-col lg:gap-3 lg:flex-row justify-between">
                <div className="basis-1/3">
                  <InputField
                    label="Name"
                    type="text"
                    name="name"
                    value={seasonData.name}
                    onChange={handleInputChangeSeason}
                  />
                </div>
                <div className="basis-1/3">
                  <InputField
                    label="Start date"
                    type="date"
                    name="start_date"
                    value={seasonData.start_date}
                    onChange={handleInputChangeSeason}
                  />
                </div>
                <div className="basis-1/3">
                  <InputField
                    label="End date"
                    type="date"
                    name="end_date"
                    value={seasonData.end_date}
                    onChange={handleInputChangeSeason}
                  />
                </div>
              </div>
              <div className="lg:mt-0 mt-6">
                <Button type="submit" text="Add" />
              </div>
            </form>
          </div>

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
                  <label className="block text-sm font-medium text-gray-700">Season</label>
                  <DropDown
                    name="season_id"
                    value={quizEventData.season_id}
                    options={seasons.data}
                    handleSelectChange={handleSelectChange}
                  />
                </div>
              </div>
              <div className="lg:mt-0 mt-6">
                <Button type="submit" text="Add" />
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizEvents;
