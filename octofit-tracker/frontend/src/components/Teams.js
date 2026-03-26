import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const apiUrl = codespace === 'localhost:8000' 
          ? 'http://localhost:8000/api/teams/'
          : `https://${codespace}-8000.app.github.dev/api/teams/`;

        console.log('Fetching Teams from:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Teams API Response:', data);

        // Handle both paginated and plain array responses
        const teamsData = data.results ? data.results : Array.isArray(data) ? data : [];
        console.log('Processed Teams Data:', teamsData);

        setTeams(teamsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError(error.message);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) return <div className="container mt-5"><p>Loading teams...</p></div>;
  if (error) return <div className="container mt-5"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Teams</h2>
      {teams.length === 0 ? (
        <p>No teams found</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Members</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td>{team.name}</td>
                <td>{team.description}</td>
                <td>{team.member_count || team.members?.length || 0}</td>
                <td>{team.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Teams;
