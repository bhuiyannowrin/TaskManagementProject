import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./AddTask.css";
import { BiTrash } from "react-icons/bi";
import { BsGripVertical } from "react-icons/bs";

interface SubtaskItemProps {
  closeModal: () => void;
  addTask: (task: any) => void;
}

export default function AddTask({ closeModal, addTask }: SubtaskItemProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [subtasks, setSubtasks] = useState([]);

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { title: "", completed: false }]);
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index].title = value;
    setSubtasks(updated);
  };

  const handleCheckboxChange = (index) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);
  };

  const removeSubtask = (index: number) => {
    const updated = [...subtasks];
    updated.splice(index, 1);
    setSubtasks(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(subtasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSubtasks(reordered);
  };

  const handleSubmit = () => {
    if (!title) return;
    addTask({
      id: Date.now().toString(),
      title,
      description,
      priority,
      dueDate,
      status: "Todo",
      subtasks,
    });
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={closeModal}>
          &times;
        </button>
        <h2 style={{ textAlign: "left" }}>Create New Task</h2>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <div className="priority-options">
            {["Low", "Medium", "High"].map((p) => (
              <label key={p}>
                <input
                  type="radio"
                  name="priority"
                  checked={priority === p}
                  onChange={() => setPriority(p)}
                />{" "}
                {p}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <div style={{ display: "flex", alignItems: "center", gap: "150px" }}>
            <label>Subtasks</label>
            <button className="add-subtask-btn" onClick={handleAddSubtask}>
              + Add Subtask
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="subtasks">
              {(provided) => (
                <div
                  className="subtask-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {subtasks.length === 0 ? (
                    <p
                      style={{
                        textAlign: "left",
                        fontSize: "12px",
                        marginTop: "10px",
                        color: "#666",
                      }}
                    >
                      No subtasks yet. Add one to break down this task.
                    </p>
                  ) : (
                    subtasks.map((subtask, index) => (
                      <Draggable
                        key={index}
                        draggableId={`subtask-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="subtask-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "6px",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div
                              className="cursor-grab text-muted-foreground"
                            >
                              <BsGripVertical className="h-4 w-4" />
                            </div>

                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              onChange={() => handleCheckboxChange(index)}
                            />
                            <input
                              type="text"
                              value={subtask.title}
                              onChange={(e) =>
                                handleSubtaskChange(index, e.target.value)
                              }
                              placeholder="Subtask Title"
                            />

                            <button
                              onClick={() => removeSubtask(index)}
                              className="delete-subtask-btn"
                            >
                              <BiTrash className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={closeModal}>
            Cancel
          </button>
          <button className="create-btn" onClick={handleSubmit}>
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
