import { useEffect, useState } from "react";

const Slidebar = ({ socket }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleNewUser = (data) => {
      setUsers(data);
    };

    socket.emit("newUser", { user: localStorage.getItem("username") });

    socket.on("responseNewUser", handleNewUser);

    socket.emit("requestUsers");

    return () => {
      socket.off("responseNewUser", handleNewUser);
    };
  }, []);

  return (
    <div className="flex flex-col shadow rounded-lg w-1/4 h-full">
      <div className="flex items-center pt-4 pb-5 pl-3 border-b">
        <h1 className="text-xl font-bold">Users</h1>
      </div>
      <div className="bg-gray-100 h-full">
        <ul className="flex flex-col gap-3 text-2xl px-2 overflow-y-auto max-h-full">
          {users.map((user) => (
            <li
              className="pl-2 pr-3 py-2 bg-gray-100 rounded-lg shadow-sm"
              key={user.socketID}
            >
              {user.user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Slidebar;
