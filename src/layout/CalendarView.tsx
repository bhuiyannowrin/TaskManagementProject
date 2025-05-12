import React, { useState, useMemo } from "react";
import "./Calendar.css";
import { FcNext, FcPrevious } from "react-icons/fc";
import { Dot } from "lucide-react";

function CalendarView({ tasks }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(null);

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

  const daysInMonth = getDaysInMonth(
    selectedDate.getMonth() + 1,
    selectedDate.getFullYear()
  );

  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );

  const startingDay = firstDayOfMonth.getDay();

  const days = [];

  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
  }

  const getISODate = (date) => date.toLocaleDateString("en-CA");

  const formatDisplayDate = (date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  const handleDateClick = (date) => {
    setActiveDate(date);
  };

  const tasksForSelectedDay = activeDate
    ? tasks.filter(
        (task) => getISODate(new Date(task.dueDate)) === getISODate(activeDate)
      )
    : [];

  const taskCountsByDate = useMemo(() => {
    const counts = {};
    tasks.forEach((task) => {
      const dateStr = getISODate(new Date(task.dueDate));
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    return counts;
  }, [tasks]);

  const colorMap = useMemo(() => {
    const entries = Object.entries(taskCountsByDate).sort(
      (a, b) => b[1] - a[1]
    );
    const map = {};
    entries.forEach(([date], idx) => {
      if (idx === 0) map[date] = "green";
      else if (idx === 1) map[date] = "blue";
      else map[date] = "red";
    });
    return map;
  }, [taskCountsByDate]);

  const getDayColor = (date) => {
    if (!date) return "";
    const key = getISODate(date);
    return colorMap[key] || "";
  };

  return (
    <div
      className="calendar-container"
      style={{ display: "flex", gap: "2rem" }}
    >
      <div className="calendar-view">
        <div className="calendar-header">
          <button
            onClick={() =>
              setSelectedDate(
                new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth() - 1,
                  1
                )
              )
            }
          >
            <FcPrevious />
          </button>
          <h3>
            {selectedDate.toLocaleString("default", { month: "long" })}{" "}
            {selectedDate.getFullYear()}
          </h3>
          <button
            onClick={() =>
              setSelectedDate(
                new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth() + 1,
                  1
                )
              )
            }
          >
            <FcNext />
          </button>
        </div>

        <div
          className="calendar-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            marginTop: "10px",
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} style={{ fontWeight: "bold", textAlign: "center" }}>
              {day}
            </div>
          ))}

          {days.map((date, index) => {
            const isSelected =
              activeDate &&
              date &&
              date.toDateString() === activeDate.toDateString();
            const isToday =
              date && date.toDateString() === new Date().toDateString();
            const color = getDayColor(date);

            return (
              <div
                key={index}
                className={`calendar-day ${date ? "" : "empty"} 
                p-2 text-center rounded-md relative
                ${
                date ? "border border-gray-300 cursor-pointer" : "border-0 cursor-default"
               }
            ${
              isSelected
                ? "bg-green-200 text-white font-bold"
                : isToday
                ? "bg-cyan-100 text-black"
                : "bg-white text-black"
            }
          `}
                onClick={() => date && handleDateClick(date)}
              >
                {date ? date.getDate() : ""}

                {color && (
                  <span
                    className={` absolute bottom-[6px] left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full 
                    ${
                      color === "green"
                        ? "bg-green-600"
                        : color === "blue"
                        ? "bg-blue-600"
                        : "bg-red-600"
                    }
                  `}
                  ></span>
                )}
              </div>
            );
          })}
        </div>

        <div
        className=" flex items-center mt-4 text-center text-sm"
        >
          <span className="flex items-center text-green-600 mr-2">
          ● Most Tasks
          </span>
          <span className="flex items-center text-blue-600 mr-2">
            ● Second Most Tasks
          </span>
          <span className="flex items-center text-red-600 mr-2">● Has Tasks</span>
        </div>
      </div>

      <div className="task-sidebar">
        {activeDate ? (
          <>
            {tasksForSelectedDay.length > 0 ? (
              <ul>
                {tasksForSelectedDay.map((task) => (
                  <React.Fragment key={task.id}>
                    <li style={{ marginBottom: "1rem" }}>
                      <div>
                        <strong>
                          {formatDisplayDate(new Date(task.dueDate))}
                        </strong>
                      </div>
                    </li>
                    <div>
                      <strong>{task.title}</strong>
                    </div>
                    <p>{task.description}</p>
                  </React.Fragment>
                ))}
              </ul>
            ) : (
              <p>
                {formatDisplayDate(activeDate)}
                <br />
                No tasks due on this date.
              </p>
            )}
          </>
        ) : (
          <p>Select a date to view tasks.</p>
        )}
      </div>
    </div>
  );
}

export default CalendarView;
