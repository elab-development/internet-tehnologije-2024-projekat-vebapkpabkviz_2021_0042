import React, { useState, useEffect } from "react";
import axios from "axios";
import DropDown from "./DropDown";
import { FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";

const Scoreboard = () => {
  const [scores, setScores] = useState();
  const [seasons, setSeasons] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortColumn, setSortColumn] = useState("total_score");

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedOption(selectedId);
    // Fetch scores for the selected season
    fetchScores(selectedId);
  };

  const handleHeaderClick = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  const fetchScores = (seasonId) => {
    axios
      .get(`http://localhost:8000/api/scores/seasons/${seasonId}`)
      .then((response) => {
        setScores(response.data);
      })
      .catch((error) => {
        console.error("Error fetching scores:", error);
      });
  };

  useEffect(() => {
    // Fetch seasons if not already fetched
    if (!seasons) {
      axios.get("http://localhost:8000/api/seasons").then((response) => {
        setSeasons(response.data);
        // Fetch scores based on the initially selected season ID
        const initialSelectedSeason = response.data?.[0]?.id || "1";
        setSelectedOption(initialSelectedSeason);
        fetchScores(initialSelectedSeason);
      });
    }
  }, [seasons]); // Only fetch seasons on initial load

  const sortedScores = scores?.data
    ? Object.values(scores.data).sort((a, b) => {
        if (sortColumn === "team") {
          const teamA = a.team.toLowerCase();
          const teamB = b.team.toLowerCase();
          if (sortOrder === "asc") {
            return teamA.localeCompare(teamB);
          } else {
            return teamB.localeCompare(teamA);
          }
        } else {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
          if (sortOrder === "asc") {
            return valueA - valueB;
          } else {
            return valueB - valueA;
          }
        }
      })
    : [];

  return (
    <div className="flex min-h-[84vh] p-6 bg-slate-300 justify-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {scores && (
          <>
            <div>
              <h2 className="text-4xl font-bold mb-3">Scoreboard</h2>
              <DropDown
                options={seasons?.data}
                handleSelectChange={handleSelectChange}
                selectedOption={selectedOption}
              ></DropDown>
            </div>

            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleHeaderClick("team")}
                    >
                      <div className="flex justify-start items-center">
                        <span className="mr-3">Team Name</span>
                        {sortColumn === "team" &&
                          (sortOrder === "asc" ? (
                            <FaSortAmountDownAlt />
                          ) : (
                            <FaSortAmountDown />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleHeaderClick("total_score")}
                    >
                      <div className="flex justify-center items-center">
                        <span className="mr-3">Total Score</span>
                        {sortColumn === "total_score" &&
                          (sortOrder === "asc" ? (
                            <FaSortAmountDownAlt />
                          ) : (
                            <FaSortAmountDown />
                          ))}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedScores.length > 0 ? (
                    sortedScores.map((team, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-left whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {team.team}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-center text-gray-900">
                            {team.total_score}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-4">
                        No scores available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Scoreboard;
