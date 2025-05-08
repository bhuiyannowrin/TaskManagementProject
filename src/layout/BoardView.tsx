import { BsThreeDotsVertical } from "react-icons/bs";
import { BiCalendarEvent } from "react-icons/bi";
import { threeDotsOptions} from "./Types";
import { FiTag } from "react-icons/fi";

export default function BoardView({
  filteredTasks,
  handleThreeDotsClick,
  handleThreeDotsOptionClick,
  openTaskMenuId,
  setShowCreateModal,
  setSelectedTask,
  updateTask,

}) {
  return (
    <div className="board-view">
      {["Todo", "In Progress", "Review", "Done"].map((status) => (
        <div key={status} className="board-column">
          <div className="flex items-center gap-8">
            <h3 className="m-0 text-var(--text) font-bold" >
              {status} (
              {filteredTasks
                .map((task) => {
                  let computedStatus = task.status;
                  const progress = task.progress || 0;

                  if (progress >= 31 && progress < 90) {
                    computedStatus = "In Progress";
                  } else if (progress >= 90 && progress < 100) {
                    computedStatus = "Review";
                  } else if (progress === 100) {
                    computedStatus = "Done";
                  }

                  return { ...task, computedStatus };
                })
                .filter((task) => task.computedStatus === status).length})
            </h3>
            <button className="text-var(--text) inline-flex justify-center items-center h-24 w-24 border-none cursor-pointer text-2xl"
              onClick={() => setShowCreateModal(true)}
            >
              +
            </button>
          </div>

          {filteredTasks
            .map((task) => {
              let computedStatus = task.status;
              const progress = task.progress || 0;

              if (progress >= 30 && progress < 90) {
                computedStatus = "In Progress";
              } else if (progress >= 90 && progress < 100) {
                computedStatus = "Review";
              } else if (progress === 100) {
                computedStatus = "Done";
              }

              return { ...task, computedStatus };
            })
            .filter((task) => task.computedStatus === status)
            .map((task) => (
              <div
                key={task.id}
                className="task-card"
                onClick={() => setSelectedTask(task)}
                style={{ cursor: "pointer" }}
              >
                <div className="flex items-center gap-20">
                  <button
                    className={`priority-button ${task.priority.toLowerCase()}`}
                  >
                    {task.priority} Priority
                  </button>

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
                        {threeDotsOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() =>
                              handleThreeDotsOptionClick(opt, task.id)
                            }
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <small className="flex items-center gap-1">
                  <BiCalendarEvent /> {task.dueDate}
                </small>

                <div className="progress-section">
                  <strong>Progress</strong>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress || 0}
                    onChange={(e) => {
                      const newProgress = Number(e.target.value);

                      let newStatus = task.status;
                      if (newProgress >= 30 && newProgress < 90) {
                        newStatus = "In Progress";
                      } else if (newProgress >= 90 && newProgress < 100) {
                        newStatus = "Review";
                      } else if (newProgress === 100) {
                        newStatus = "Done";
                      }

                      updateTask({
                        ...task,
                        progress: newProgress,
                        status: newStatus,
                        updatedAt: new Date().toISOString(),
                      });
                    }}
                    className="progress-slider"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: `linear-gradient(to right, #4caf50 ${task.progress}%, #ddd ${task.progress}%)`,
                    }}
                  />
                  <span className="progress-percent">{task.progress || 0}%</span>
                </div>

                <div className="subtasks">
                  {task.subtasks.map((subtask, index) => (
                    <div key={index} className="subtask-card">
                      <FiTag /> {subtask.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
