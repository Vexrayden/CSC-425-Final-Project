import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('/api/tasks')
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title}
            {/* Add buttons for updating and deleting tasks */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;