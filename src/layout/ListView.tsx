import { BsThreeDotsVertical } from "react-icons/bs";
import { threeDotsOptions2, priorityColors } from "./Types";

export default function ListView({ 
  filteredTasks,
  handleThreeDotsClick, 
  handleThreeDotsOptionClick, 
  openTaskMenuId,
  setSelectedTask,
  updateTask
}) {
  return (
    <div className="list-view">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Assignee</th>
            <th>Progress</th>
            <th></th>
          </tr>
        </thead>
        
        <tbody>
          {filteredTasks.map((task) => {
            let displayStatus = "To Do";
            if (task.progress >= 30 && task.progress < 90) {
              displayStatus = "In Progress";
            } else if (task.progress >= 90 && task.progress < 100) {
              displayStatus = "Review";
            } else if (task.progress === 100) {
              displayStatus = "Done";
            }

            return (
              <tr
                key={task.id}
                onClick={() => setSelectedTask(task)}
                style={{ cursor: "pointer" }}
              >
                <td>{task.description}</td>

                <td>
                  <button
                    className="priority-button"
                    style={{
                      backgroundColor:
                        priorityColors[task.priority.toLowerCase()],
                    }}
                  >
                    {task.priority} Priority
                  </button>
                </td>

                <td style={{ textAlign: "center" }}>
                  <small>{displayStatus}</small>
                </td>

                <td><small>{task.dueDate}</small></td>
                <td><small>{task.assignee}</small></td>

                <td style={{ textAlign: "center" }}>
                  <small>{task.progress || 0} %</small>
                </td>

                <td>
                  <div
                    className="dropdown-wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="tab"
                      onClick={() => handleThreeDotsClick(task.id)}
                    >
                      <BsThreeDotsVertical />
                    </button>
                    {openTaskMenuId === task.id && (
                      <div className="dropdown-menu">
                        {threeDotsOptions2.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleThreeDotsOptionClick(opt, task.id)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
