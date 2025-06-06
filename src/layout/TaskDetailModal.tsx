import { useEffect, useState } from "react";

import {
  BiCalendarEvent,
  BiEdit,
  BiFile,
  BiMessage,
  BiCommentDetail,
  BiPaperclip,
  BiUser,
} from "react-icons/bi";

import { FiDownload as Download } from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import "./TaskDetailModal.css";

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (let interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
}

export default function TaskDetailModal({ task, onClose, setEditTaskId }) {
  const [activeTab, setActiveTab] = useState("details");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedInEmail, setLoggedInEmail] = useState("");

  const loginName = loggedInEmail ? loggedInEmail.split("@")[0] : "You";

  useEffect(() => {
    if (task) {
      const savedComments = localStorage.getItem(`comments-${task.id}`);
      const savedFiles = localStorage.getItem(`files-${task.id}`);
      if (savedComments) setComments(JSON.parse(savedComments));
      if (savedFiles) setUploadedFiles(JSON.parse(savedFiles));
    }

    const stored = localStorage.getItem("logindata");
    if (stored) {
      const loggedInUser = JSON.parse(stored);
      const email = loggedInUser.email;
      setLoggedInEmail(email);

      const newUser = {
        id: email,
        name: email.split("@")[0],
      };

      setUsers((prev) => {
        const exists = prev.some((m) => m.id === email);
        return exists
          ? prev.map((m) => (m.id === email ? newUser : m))
          : [newUser, ...prev];
      });
    }
  }, [task]);

  const saveToLocalStorage = (commentsData, filesData) => {
    localStorage.setItem(`comments-${task.id}`, JSON.stringify(commentsData));
    localStorage.setItem(`files-${task.id}`, JSON.stringify(filesData));
  };

  const handleFileUpload = (files) => {
    const fileArrayPromises = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file: {
              name: file.name,
              type: file.type,
              size: file.size,
              data: e.target.result,
            },
            author: loginName,
            date: new Date().toISOString(),
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileArrayPromises).then((newFiles) => {
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      saveToLocalStorage(comments, updatedFiles);
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newEntry = {
        author: loginName,
        text: newComment,
        date: new Date().toISOString(),
      };
      const updatedComments = [newEntry, ...comments];
      setComments(updatedComments);
      setNewComment("");
      saveToLocalStorage(updatedComments, uploadedFiles);
    }
  };

  const handleEditClick = () => {
    setEditTaskId(task.id);
    onClose();
  };

  const combinedActivities = [
    ...comments.map((c) => ({ ...c, type: "comment" })),
    ...uploadedFiles.map((f) => ({ ...f, type: "file" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <button className="edit-btn" onClick={handleEditClick}>
          <BiEdit />
        </button>

        <div className={`priority-badge ${task.priority.toLowerCase()}`}>
          {task.priority} Priority
        </div>

        <h2 className="task-title">{task.title}</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex gap-2 w-full justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">
              Comments {comments.length > 0 && <span className="tab-badge">{comments.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="files">
              Files {uploadedFiles.length > 0 && <span className="tab-badge">{uploadedFiles.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="activity">
              Activity {combinedActivities.length > 0 && <span className="tab-badge">{combinedActivities.length}</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="meta-info">
              <span><BiCalendarEvent /> Due: {task.dueDate}</span>
              <span><BiUser /> Creator: {task.creator || loginName}</span>
              <span><BiMessage /> ({comments.length}) comments</span>
              <span><BiFile /> {uploadedFiles.length} files</span>
            </div>

            <div className="description">
              <strong>Description</strong>
              <p>{task.description}</p>
            </div>

            <div className="progress-section">
              <strong>Progress</strong>
              <input
                type="range"
                min="0"
                max="100"
                value={task.progress || 0}
                readOnly
                className="progress-slider"
                style={{
                  background: `linear-gradient(to right, #4caf50 ${task.progress}%, #ddd ${task.progress}%)`,
                }}
              />
              <span className="progress-percent">{task.progress || 0}%</span>
            </div>

            <div className="subtask-tags">
              {task.subtasks?.map((subtask, index) => (
                <div key={index} className="tag">
                  {subtask.title}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comments">
            <div className="comment-input-section">
              <textarea
                placeholder="Add a comment... (use @ to mention someone)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-textarea"
              />
              <button className="add-comment-btn" onClick={handleAddComment}>
                Add Comment
              </button>
            </div>
            {comments.map((comment, idx) => (
              <div className="comment" key={idx}>
                <div className="comment-author">{comment.author}</div>
                <div className="comment-date">{timeAgo(comment.date)}</div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="files">
            <div
              className="tab-content file-drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
            >
              <label htmlFor="file-upload" className="upload-label">
                Upload file or drag and drop here
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e.target.files)}
              />

              {uploadedFiles.length > 0 && (
                <>
                  <h5 className="attachment-heading">Attachments ({uploadedFiles.length})</h5>
                  {uploadedFiles.map((entry, index) => (
                    <div className="file-item" key={index}>
                      <span className="file-name">{entry.file.name}</span>
                      <button
                        className="download-btn"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = entry.file.data;
                          link.download = entry.file.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="tab-content">
              {combinedActivities.length === 0 ? (
                <p>No activity yet.</p>
              ) : (
                <ul className="activity-list">
                  {combinedActivities.map((item, idx) => (
                    <li key={idx} className="activity-item">
                      <div className="activity-icon">
                        {item.type === "comment" ? <BiCommentDetail /> : <BiPaperclip />}
                      </div>
                      <div className="activity-details">
                        <div className="avatar-name-row">
                          <div className="avatar-placeholder">
                            <BiUser />
                          </div>
                          <span className="author-name">{item.author}</span>
                        </div>
                        <div className="activity-time">{timeAgo(item.date)}</div>
                        <div className="activity-text">
                          {item.type === "comment"
                            ? `Commented: ${item.text}`
                            : `Attached file: ${item.file.name}`}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
