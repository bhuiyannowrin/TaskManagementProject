import { BsThreeDotsVertical } from "react-icons/bs";
import { threeDotsOptions2, priorityColors } from "./Types";

export default function ListView({ 
  filteredTasks,
  handleThreeDotsClick, 
  handleThreeDotsOptionClick, 
  openTaskMenuId,
  setSelectedTask,
  
})

{
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
          {filteredTasks.map((task) => (
            <tr key={task.id}
              onClick={() => setSelectedTask(task)}
              style={{ cursor: "pointer" }}>
              <td>{task.description}</td>

              <td>
                <button
                  className="priority-button"
                  style={{ backgroundColor: priorityColors[task.priority.toLowerCase()] }}
                >
                  {task.priority} Priority
                </button>
              </td>
              <td><small>{task.status}</small></td>
              <td><small>{task.dueDate}</small></td>
              <td><small>{task.assignee}</small></td>
              <td><small>{task.progress}</small></td>
              <td>
                <div className="dropdown-wrapper" onClick={(e)=>e.stopPropagation()}>
                  <button className="tab" onClick={() => handleThreeDotsClick(task.id)}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
