import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('http://localhost:4000/api/authRoutes/projects', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleNewProject = () => {
    // Handle new project creation logic here
    alert('New project button clicked');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>{project.name}</li>
        ))}
      </ul>
      <button onClick={handleNewProject}>New Project</button>
    </div>
  );
};

export default Dashboard;