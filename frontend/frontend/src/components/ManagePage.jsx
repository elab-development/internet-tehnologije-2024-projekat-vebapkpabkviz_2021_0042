import React, { useState, useEffect } from "react";
import axios from "axios";
import InputField from "./InputField";
import Button from "./Button";

const ManagePage = () => {
  const [quizEvents, setQuizEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [teamSearchTerm, setTeamSearchTerm] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventCurrentPage, setEventCurrentPage] = useState(1);
  const [eventLastPage, setEventLastPage] = useState(1);
  const [teamCurrentPage, setTeamCurrentPage] = useState(1);
  const [teamLastPage, setTeamLastPage] = useState(1);
  const [selectedEventRow, setSelectedEventRow] = useState(null);
  const [selectedTeamRow, setSelectedTeamRow] = useState(null);
  const [scoreData, setScoreData] = useState({
    team_id: "",
    score: "",
    quiz_event_id: "",
  });
  const [score, setScore] = useState(null);

  const handleEventRowClick = async (id) => {
    if (id !== selectedEventRow) {
      setSelectedEventRow(id);
      if (selectedTeamRow) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/scores/quiz-events/${id}/teams/${selectedTeamRow}`
          );
          console.log("Score:", response.data);
          setScore(response.data.score);
          setScoreData((prevScoreData) => ({
            ...prevScoreData,
            quiz_event_id: id,
          }));
          if (
            Array.isArray(response.data.score) &&
            response.data.score.length > 0
          ) {
            setScoreData((prevScoreData) => ({
              ...prevScoreData,
              score: response.data.score[0].pivot.score,
            }));
          } else {
            setScoreData((prevScoreData) => ({
              ...prevScoreData,
              score: "",
            }));
          }
        } catch (error) {
          console.error("Error fetching score:", error);
        }
      }
    }
    console.log("Clicked Event ID:", id);
  };

  const handleTeamRowClick = async (id) => {
    if (id !== selectedTeamRow) {
      setSelectedTeamRow(id);
      if (selectedEventRow) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/scores/quiz-events/${selectedEventRow}/teams/${id}`
          );
          console.log("Score:", response.data);
          setScore(response.data.score);
          setScoreData((prevScoreData) => ({
            ...prevScoreData,
            team_id: id,
          }));
          if (
            Array.isArray(response.data.score) &&
            response.data.score.length > 0
          ) {
            setScoreData((prevScoreData) => ({
              ...prevScoreData,
              score: response.data.score[0].pivot.score,
            }));
          } else {
            setScoreData((prevScoreData) => ({
              ...prevScoreData,
              score: "",
            }));
          }
        } catch (error) {
          console.error("Error fetching score:", error);
        }
      }
    }
    console.log("Clicked Team ID:", id);
  };

  const fetchQuizEvents = async (page) => {
    try {
      const params = {};
      if (eventSearchTerm) params.name = eventSearchTerm;
      if (eventStartDate) params.start_date = eventStartDate;
      if (eventEndDate) params.end_date = eventEndDate;
      if (page) params.page = page;

      const response = await axios.get(
        "http://127.0.0.1:8000/api/search/quiz-events",
        {
          params,
        }
      );

      console.log(response.data);
      setQuizEvents(response.data.quiz_events);
      setEventCurrentPage(response.data.current_page);
      setEventLastPage(response.data.last_page);
    } catch (error) {
      setQuizEvents([]);
      console.error("Error fetching quiz events:", error);
    }
  };

  const fetchTeams = async (page) => {
    try {
      const params = {};
      if (teamSearchTerm) params.name = teamSearchTerm;
      if (page) params.page = page;

      const response = await axios.get(
        "http://127.0.0.1:8000/api/search/teams",
        {
          params,
        }
      );

      console.log(response.data);
      setTeams(response.data.teams);
      setTeamCurrentPage(response.data.current_page);
      setTeamLastPage(response.data.last_page);
    } catch (error) {
      setTeams([]);
      console.error("Error fetching teams:", error);
    }
  };

  const handleEventSearch = () => {
    fetchQuizEvents(1);
  };

  const handleTeamSearch = () => {
    fetchTeams(1);
  };

  const handleEventPagination = (page) => {
    fetchQuizEvents(page);
  };

  const handleTeamPagination = (page) => {
    fetchTeams(page);
  };

  useEffect(() => {
    fetchQuizEvents(1);
    fetchTeams(1);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScoreData({
      ...scoreData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(scoreData);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/scores",
        scoreData,
        {
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        }
      );
      console.log(response);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateScore = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/scores/teams/${selectedTeamRow}/quiz-events/${selectedEventRow}`,
        scoreData,
        {
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  return (
    <div className="min-h-[84vh] xl:px-60 2xl:px-80 p-6 bg-gray-300 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:basis-1/2">
          <h2 className="text-4xl font-bold mb-3">Quiz events</h2>
          <div className="flex flex-col lg:gap-3 lg:flex-row justify-between">
            <div className="basis-1/3">
              <InputField
                label="Name"
                type="text"
                name="name"
                value={eventSearchTerm}
                onChange={(e) => setEventSearchTerm(e.target.value)}
              />
            </div>
            <div className="basis-1/3">
              <InputField
                label="Start Date"
                type="date"
                name="start_date"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
              />
            </div>
            <div className="basis-1/3">
              <InputField
                label="End Date"
                type="date"
                name="end_date"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleEventSearch} text={"Search Events"} />

          {quizEvents.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-lg mt-3">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-2/12 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="w-6/12 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="w-6/12 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date and time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quizEvents.map((event) => (
                      <tr
                        key={event.id}
                        onClick={() => handleEventRowClick(event.id)}
                        className={
                          selectedEventRow === event.id
                            ? "bg-gray-200 cursor-pointer"
                            : "cursor-pointer"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-center text-gray-900">
                            {event.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-left text-gray-900">
                            {event.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-left text-gray-900">
                            {event.start_date_time}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col items-start justify-center mt-3">
                <div className="flex space-x-4">
                  {Array.from(
                    { length: eventLastPage },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handleEventPagination(pageNumber)}
                      disabled={pageNumber === eventCurrentPage}
                      className={`px-3 py-1 text-center text-white bg-sky-700 rounded ${
                        pageNumber === eventCurrentPage
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-lg">No records found for quiz events.</p>
          )}
        </div>
        <div className="lg:basis-1/2">
          <h2 className="text-4xl font-bold mb-3">Teams</h2>
          <div className="flex items-center lg:gap-3 lg:flex-row justify-between">
            <div className="w-full">
              <InputField
                label="Name"
                type="text"
                name="teamName"
                value={teamSearchTerm}
                onChange={(e) => setTeamSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleTeamSearch} text={"Search Teams"} />

          {teams.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-lg mt-3">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-6/12 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="w-6/12 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teams.map((team) => (
                      <tr
                        key={team.id}
                        onClick={() => handleTeamRowClick(team.id)}
                        className={
                          selectedTeamRow === team.id
                            ? "bg-gray-200 cursor-pointer"
                            : "cursor-pointer"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-center text-gray-900">
                            {team.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-left text-gray-900">
                            {team.name}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col items-start justify-center mt-3">
                <div className="flex space-x-4">
                  {Array.from(
                    { length: teamLastPage },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handleTeamPagination(pageNumber)}
                      disabled={pageNumber === teamCurrentPage}
                      className={`px-3 py-1 text-center text-white bg-sky-700 rounded ${
                        pageNumber === teamCurrentPage
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-lg">No teams found.</p>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-4xl font-bold mb-3">Score</h2>
        <div>
          <form onSubmit={handleSubmit}>
            <InputField
              label=""
              type="number"
              name="score"
              value={scoreData.score}
              onChange={handleInputChange}
            />

            {selectedEventRow !== null && selectedTeamRow !== null && score && (
              <>
                { Array.isArray(score) && score.length > 0 ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleUpdateScore}
                      text="Update score"
                    />
                  </>
                ) : (
                  <Button type="submit" text="Add score" />
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManagePage;
