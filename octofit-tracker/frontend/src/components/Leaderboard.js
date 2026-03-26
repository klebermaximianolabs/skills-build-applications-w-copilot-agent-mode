import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const apiUrl = codespace === 'localhost:8000' 
          ? 'http://localhost:8000/api/leaderboard/'
          : `https://${codespace}-8000.app.github.dev/api/leaderboard/`;

        console.log('Fetching Leaderboard from:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Leaderboard API Response:', data);

        // Handle both paginated and plain array responses
        const leaderboardData = data.results ? data.results : Array.isArray(data) ? data : [];
        console.log('Processed Leaderboard Data:', leaderboardData);

        setLeaderboard(leaderboardData);
        setError(null);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="container mt-5"><p>Loading leaderboard...</p></div>;
  if (error) return <div className="container mt-5"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>No leaderboard data found</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.id || index}>
                <td>{index + 1}</td>
                <td>{entry.user_name || entry.username || entry.name}</td>
                <td>{entry.score || entry.points || 0}</td>
                <td>{entry.points || entry.score || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
