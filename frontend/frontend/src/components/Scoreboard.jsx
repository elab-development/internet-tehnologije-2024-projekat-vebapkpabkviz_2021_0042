import React, { useState, useEffect } from "react";
import axios from "axios";
import DropDown from "./DropDown";

const Scoreboard = () => {
  const [scores, setScores] = useState();
  const [seasons, setSeasons] = useState();
  const [selectedOption, setSelectedOption] = useState();

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedOption(selectedId);
    // Fetch scores for the selected season
    fetchScores(selectedId);
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

  return (
    <div className="flex min-h-[84vh] p-6 bg-[#1C3144] justify-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {scores && (
          <>
            <div>
              <h2 className="text-4xl font-bold mb-3 text-[#C3D898]">Scoreboard</h2>
              <DropDown
                options={seasons?.data}
                handleSelectChange={handleSelectChange}
                selectedOption={selectedOption}
              ></DropDown>
            </div>

            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full divide-y divide-[#596F62]">
                <thead className="bg-[#596F62]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#C3D898] uppercase tracking-wider">
                      Team Name
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-[#C3D898] uppercase tracking-wider">
                      Total Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#1C3144] divide-y divide-[#596F62]">
                  {Object.values(scores.data)
                    .sort((a, b) => b.total_score - a.total_score)
                    .map((team, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-left whitespace-nowrap">
                          <div className="text-sm font-medium text-[#C3D898]">
                            {team.team}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-center text-[#C3D898]">
                            {team.total_score}
                          </div>
                        </td>
                      </tr>
                    ))}
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