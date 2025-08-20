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
  const role = window.sessionStorage.getItem("role");
  const canManage = ["moderator", "admin"].includes(role);
  const isAdmin = role === "admin";

  const [calDate, setCalDate] = useState(new Date());
  const [calView, setCalView] = useState("month");
  const handleNavigate = (newDate) => setCalDate(newDate);
  const handleView = (nextView) => setCalView(nextView);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [seasons, setSeasons] = useState({ data: [] });
  const [selectedSeasonExport, setSelectedSeasonExport] = useState("");

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

  const fetchSeasons = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/seasons");
      setSeasons(res.data ?? { data: [] });
    } catch (err) {
      console.error("Error fetching seasons:", err);
      setSeasons({ data: [] });
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/quiz-events");
      const formatted = res.data.data.map((ev) => {
        const start = new Date(ev.start_date_time);
        const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
        return { id: ev.id, title: ev.name, start, end };
      });
      setEvents(formatted);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchSeasons();
    fetchData();
  }, []);

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
  const handleEventDelete = (eventId) =>
    setEvents((prev) => prev.filter((e) => e.id !== eventId));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChangeSeason = (e) => {
    const { name, value } = e.target;
    setSeasonData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setQuizEventData((prev) => ({ ...prev, season_id: id }));
  };

  const handleSelectChangeExport = (e) => {
    const id = e.target.value;
    setSelectedSeasonExport(id);
  };

  const handleDateTimeInputChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const offset = selectedDate.getTimezoneOffset();
    const adjusted = new Date(selectedDate.getTime() - offset * 60 * 1000);
    const formatted = adjusted.toISOString().slice(0, 19).replace("T", " ");
    setQuizEventData((prev) => ({ ...prev, start_date_time: formatted }));
  };

  const handleExportICal = () => {
    if (!selectedSeasonExport) return;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/quiz-events", quizEventData, {
        headers: {
          Authorization: "Bearer " + window.sessionStorage.getItem("auth_token"),
        },
      })
      .then(() => fetchData())
      .catch((error) => console.log("Error:", error.response?.data || error));
  };

  const handleSubmitSeason = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/seasons", seasonData, {
        headers: {
          Authorization: "Bearer " + window.sessionStorage.getItem("auth_token"),
        },
      })
      .then(() => fetchSeasons())
      .catch((error) => console.log("Error:", error.response?.data || error));
  };

  const handleDeleteSeason = () => {
    if (!selectedSeasonExport) return;
    axios
      .delete(`http://localhost:8000/api/seasons/${selectedSeasonExport}`, {
        headers: {
          Authorization: "Bearer " + window.sessionStorage.getItem("auth_token"),
        },
      })
      .then(() => {
        setSelectedSeasonExport("");
        setQuizEventData((prev) => ({ ...prev, season_id: "" }));
        fetchSeasons();
      })
      .catch((error) => console.log("Error:", error.response?.data || error));
  };

  const selectedSeason =
    (seasons.data || []).find((s) => String(s.id) === String(quizEventData.season_id)) || null;

  const toLocalDateTimeInput = (dateStr, end = false) => {
    if (!dateStr) return undefined;
    const d = new Date(dateStr);
    if (end) d.setHours(23, 59, 59, 0);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  const minDt = selectedSeason ? toLocalDateTimeInput(selectedSeason.start_date) : undefined;
  const maxDt = selectedSeason ? toLocalDateTimeInput(selectedSeason.end_date, true) : undefined;

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
            date={calDate}
            onNavigate={handleNavigate}
            view={calView}
            onView={handleView}
            defaultView="month"
            views={["month", "week", "day", "agenda"]}
            style={{ height: "100%" }}
            onSelectEvent={setSelectedEvent}
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
        <div className="basis-2/3 flex gap-3">
          <Button type="button" text="Export iCalendar for" onClick={handleExportICal} />
          {isAdmin && (
            <Button
              type="button"
              text="Delete selected season"
              onClick={handleDeleteSeason}
              disabled={!selectedSeasonExport}
            />
          )}
        </div>
        <div className="basis-1/3 mb-1">
          <DropDown
            value={selectedSeasonExport}
            options={seasons.data || []}
            handleSelectChange={handleSelectChangeExport}
          />
        </div>
      </div>

      {canManage && (
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
                    min={minDt}
                    max={maxDt}
                    onChange={handleDateTimeInputChange}
                  />
                </div>
                <div className="basis-1/3">
                  <label className="block text-sm font-medium text-gray-700">Season</label>
                  <DropDown
                    name="season_id"
                    value={quizEventData.season_id}
                    options={seasons.data || []}
                    handleSelectChange={handleSelectChange}
                  />
                </div>
              </div>
              <div className="lg:mt-0 mt-6">
                <Button type="submit" text="Add" disabled={!quizEventData.season_id} />
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizEvents;
