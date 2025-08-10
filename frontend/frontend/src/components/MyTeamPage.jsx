import React, { useState, useEffect } from "react";
import axios from "axios";
import InputField from "./InputField";
import Button from "./Button";
import DropDown from "./DropDown";

const MyTeamPage = () => {
  const [userData, setUserData] = useState(null);
  const [teamContestants, setTeamContestants] = useState([]);
  const [teamData, setTeamData] = useState({
    name: "",
  });
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [registrationError, setRegistrationError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchTeams = async () => {
      try {
        if (userData) {
          const response = await axios.get("http://127.0.0.1:8000/api/teams");
          setTeams(response.data);
          setSelectedTeamId(response.data.data[0].id);
          if (userData.data && userData.data.team) {
            fetchTeamContestants(userData.data.team.id);
          }
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    if (!userData) {
      fetchUserData();
    } else {
      fetchTeams();
    }
  }, [userData]);

  const fetchTeamContestants = async (teamId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/teams/${teamId}/users`,
        {
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        }
      );
      setTeamContestants(response.data.data);
    } catch (error) {
      console.error(`Error fetching contestants for team ${teamId}:`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData({
      ...teamData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/teams",
        teamData,
        {
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        }
      );

      // Update the user data after adding the team
      const updatedUserData = { ...userData };
      updatedUserData.data.team = {
        id: response.data.data.id,
        name: teamData.name,
      };
      setUserData(updatedUserData);

      // Clear the input field after submission
      setTeamData({ name: "" });

      // Reset any previous registration errors
      setRegistrationError(null);
    } catch (error) {
      console.error("Error registering team:", error);

      if (error.response && error.response.data && error.response.data.name) {
        setRegistrationError(error.response.data.name);
      }
    }
  };

  const handleJoinTeam = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/join/teams/${selectedTeamId}`,
        {},
        {
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        }
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  const handleSelectChange = (e) => {
    setSelectedTeamId(e.target.value);
  };

  return (
    <div className="min-h-[84vh] xl:px-60 2xl:px-80 p-6 bg-slate-300 flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-4xl font-bold mb-3">Contestant details</h2>
        {userData ? (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/5 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="w-1/5 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="w-1/5 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full name
                  </th>
                  <th className="w-1/5 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="w-1/5 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr key={userData.data.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-left text-gray-900">
                      {userData.data.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-left text-gray-900">
                      {userData.data.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-left text-gray-900">
                      {userData.data.full_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-left text-gray-900">
                      {userData.data.role}
                    </div>
                  </td>
                  {userData.data.team ? (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-left text-gray-900">
                        {userData.data.team.name}
                      </div>
                    </td>
                  ) : (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-left text-gray-900">
                        No team assigned yet
                      </div>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      <div className="flex flex-col">
        <h2 className="text-4xl font-bold mb-3">Team members</h2>
        {userData ? (
          <>
            {userData.data.team ? (
              <>
                {teamContestants.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-1/3 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Username
                          </th>
                          <th className="w-1/3 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="w-1/3 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Full name
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {teamContestants.map((member) => (
                          <tr key={member.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-left text-gray-900">
                                {member.username}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-left text-gray-900">
                                {member.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-left text-gray-900">
                                {member.full_name}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-lg">No team members available.</p>
                )}
              </>
            ) : (
              <p className="text-lg">No team assigned yet.</p>
            )}
          </>
        ) : (
          <p>Loading team data...</p>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col basis-1/2">
          <h2 className="text-4xl font-bold mb-3">Register team</h2>
          {registrationError && (
            <p className="text-red-500 mb-3">{registrationError}</p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <InputField
              label="Team name"
              type="text"
              name="name"
              value={teamData.name}
              onChange={handleInputChange}
            />
            <Button type="submit" text="Register" />
          </form>
        </div>

        <div className="flex flex-col basis-1/2">
          <h2 className="text-4xl font-bold mb-3">Join team</h2>
          <label className="block text-sm font-medium text-gray-700">
            Team
          </label>
          <DropDown
            options={teams.data}
            handleSelectChange={handleSelectChange}
          />
          <span className="mb-4"></span>
          <Button onClick={handleJoinTeam} text="Join Team" />
        </div>
      </div>
    </div>
  );
};

export default MyTeamPage;