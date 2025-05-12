import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./AddTask.css";
import { BiTrash } from "react-icons/bi";
import { BsGripVertical } from "react-icons/bs";

interface Subtask {
  id?: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate?: string;
  priority: string;
  subtasks: Subtask[];
}

interface SubtaskItemProps {
  closeModal: () => void;
  addTask: (task: Task) => void;
}

export default function AddTask({ closeModal, addTask }: SubtaskItemProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { title: "", completed: false }]);
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const updated = [...subtasks];
    updated[index].title = value;
    setSubtasks(updated);
  };

  const handleCheckboxChange = (index: number) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);
  };

  const removeSubtask = (index: number) => {
    const updated = [...subtasks];
    updated.splice(index, 1);
    setSubtasks(updated);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(subtasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSubtasks(reordered);
  };

  const handleSubmit = () => {
    const errors = {
      title: title.trim() === "" ? "Title is required." : "",
      description: description.trim() === "" ? "Description is required." : "",
      dueDate: dueDate.trim() === "" ? "Due Date is required." : "",
    };

    setFormErrors(errors);

    const hasError = Object.values(errors).some((msg) => msg !== "");
    if (hasError) return;

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
          <label>
            Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {formErrors.title && <p className="text-red-600 mt-1 text-left">{formErrors.title}</p>}
        </div>

        <div className="form-group">
          <label>
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {formErrors.description && (
            <p className="text-red-600 mt-1 text-left">{formErrors.description}</p>
          )}
        </div>

        <div className="form-group">
          <label>
            Priority <span className="text-red-600">*</span>
          </label>
          <div className="priority-options">
            {["Low", "Medium", "High"].map((p) => (
              <label key={p}>
                <input
                  type="radio"
                  name="priority"
                  checked={priority === p}
                  onChange={() => setPriority(p)}
                />
                {p}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>
            Due Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          {formErrors.dueDate && (
            <p className="text-red-600 mt-1 text-left">{formErrors.dueDate}</p>
          )}
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
                    <p className="text-left text-sm mt-4 text-gray-500">
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
                            <div className="cursor-grab text-muted-foreground">
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
