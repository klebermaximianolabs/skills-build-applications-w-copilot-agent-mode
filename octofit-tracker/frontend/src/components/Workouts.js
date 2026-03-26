import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const apiUrl = codespace === 'localhost:8000' 
          ? 'http://localhost:8000/api/workouts/'
          : `https://${codespace}-8000.app.github.dev/api/workouts/`;

        console.log('Fetching Workouts from:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Workouts API Response:', data);

        // Handle both paginated and plain array responses
        const workoutsData = data.results ? data.results : Array.isArray(data) ? data : [];
        console.log('Processed Workouts Data:', workoutsData);

        setWorkouts(workoutsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) return <div className="container mt-5"><p>Loading workouts...</p></div>;
  if (error) return <div className="container mt-5"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Workouts</h2>
      {workouts.length === 0 ? (
        <p>No workouts found</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Duration (min)</th>
              <th>Intensity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <tr key={workout.id}>
                <td>{workout.name || workout.workout_type}</td>
                <td>{workout.description}</td>
                <td>{workout.duration}</td>
                <td>{workout.intensity || 'N/A'}</td>
                <td>{workout.date || workout.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Workouts;
