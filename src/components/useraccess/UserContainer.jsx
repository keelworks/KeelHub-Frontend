import React from "react";
import User from "./User";

const UserContainer = ({ users }) => {
  return (
    <tbody>
      {users.map((user) => {
        return <User key={user.id} user={user} />;
      })}
    </tbody>
  );
};

export default UserContainer;
