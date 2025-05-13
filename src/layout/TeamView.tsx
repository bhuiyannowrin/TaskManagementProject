import React from "react";
import "./TeamView.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const teamMembers = [
  {
    id: "user1",
    name: "Alex Johnson",
    avatar:
      "https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif",
    taskno: 2,
  },
  {
    id: "user2",
    name: "Sam Taylor",
    avatar:
      "https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif",
    taskno: 4,
  },
  {
    id: "user3",
    name: "Jamie Smith",
    avatar:
      "https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif",
    taskno: 6,
  },
];

const TeamView = () => {

  return (
    <div className="team-view-container">
      {teamMembers.map((member) => (
        <div className="team-card">
          <div key={member.id} className="flex gap-2">
            <div className="avatar-container">
              <img src={member.avatar} alt={member.name} className="avatar" />
            </div>
            <div className="member-info">
              <h1>
                <strong>{member.name}</strong>
              </h1>
              <p>{member.taskno} Tasks</p>
            </div>
          </div>

          <div className="pt-6">
            <Tabs defaultValue="all" className="w-100">
              <TabsList className="inline-flex gap-0 justify-center p-1">
                <TabsTrigger value="all" className="px-3 py-1 rounded text-gray-800 hover:bg-gray-700">
                    All
                </TabsTrigger>
                <TabsTrigger value="todo" className="px-3 py-1 rounded text-gray-800 hover:bg-gray-700">
                    To do
                </TabsTrigger>
                <TabsTrigger value="inprogress" className="px-3 py-1 rounded text-gray-800 hover:bg-gray-700">
                    In Progress
                </TabsTrigger>
                <TabsTrigger value="done" className="px-3 py-1 rounded text-gray-800 hover:bg-gray-700">
                    Done
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <h2>All tasks for {member.name}</h2>
              </TabsContent>
              <TabsContent value="todo">
                <h2>{member.taskno} Todo tasks</h2>
              </TabsContent>
              <TabsContent value="inprogress">
                <h2>In Progress tasks for {member.name}</h2>
              </TabsContent>
              <TabsContent value="done">
                <h2> Done tasks for {member.name}</h2>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamView;
