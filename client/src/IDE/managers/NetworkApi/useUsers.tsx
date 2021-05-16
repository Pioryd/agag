import React from "react";

export interface Users {
  [key: string]: { name: string };
}

export default function useUsers() {
  const [users, setUsers] = React.useState<Users>({});

  const setUnreadMessages = (name: string, state: boolean) => {
    if (users[name]) {
      users[name].name = name;
      setUsers({ ...users });
    }
  };

  const clear = () => setUsers({});

  const update = (usersNames: string[]) => {
    const newUsers: Users = { ...users };

    for (const name of Object.keys(newUsers))
      if (!usersNames.includes(name)) delete newUsers[name];

    setUsers(newUsers);
  };

  return { users, update, clear, setUnreadMessages };
}
