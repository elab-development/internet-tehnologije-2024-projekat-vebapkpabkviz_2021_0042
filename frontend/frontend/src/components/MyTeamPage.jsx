import React, { useState, useEffect } from "react";
import axios from "axios";

const MyTeamPage = () => {
  const [userData, setUserData] = useState(null);
  const [teamContestants, setTeamContestants] = useState([]);

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

    if (!userData) {
      fetchUserData();
    } else {
      if (userData) {
        if (userData.data && userData.data.team) {
          fetchTeamContestants(userData.data.team.id);
        }
      }
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
    </div>
  );
};

export default MyTeamPage;