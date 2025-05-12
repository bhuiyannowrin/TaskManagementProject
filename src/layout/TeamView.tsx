import React from 'react';
import './TeamView.css';

const teamMembers = [
  {
    id: "user1",
    name: "Alex Johnson",
    avatar: 'https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif'
  },
  {
    id: "user2",
    name: "Sam Taylor",
    avatar: 'https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif'
  },
  {
    id: "user3",
    name: "Jamie Smith",
    avatar: 'https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif'
  },
];

const TeamView = () => {
  return (
    <div className="team-view-container">
      {teamMembers.map(member => (
        <div key={member.id} className="team-card">
          <div className="avatar-container">
            <img src={member.avatar} alt={member.name} className="avatar" />
          </div>
          <div className="member-info">
            <h1><strong> {member.name} </strong></h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamView;