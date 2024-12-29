import { useNavigate } from "react-router-dom";

const Header = ({ socket, verifedToken }) => {
  const navigate = useNavigate();

  const toChat = (e) => {
    e.preventDefault();
    const username = localStorage.getItem("username");
    const userid = localStorage.getItem("userid");
    socket.emit("newUser", { username: username, socketID: userid });
    navigate("/chat");
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center bg-blue-500 py-5 px-24 text-white h-18 transition-all">
      <div>
        <img src="./src/assets/DM.svg" alt="Logo" className="h-10" />
      </div>

      <nav>
        <ul className="flex gap-10 text-xl">
          {verifedToken ? (
            <>
              <li>
                <button
                  onClick={toChat}
                  className="hover:text-2xl transition-all duration-400 ease-in-out transform hover:scale-105 focus:outline-none"
                >
                  Chat
                </button>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="hover:text-2xl transition-all duration-400 ease-in-out transform hover:scale-105 focus:outline-none"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  onClick={() => navigate("/login")}
                  className="hover:text-2xl transition-all duration-400 ease-in-out transform hover:scale-105 focus:outline-none"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/register")}
                  className="hover:text-2xl transition-all duration-400 ease-in-out transform hover:scale-105 focus:outline-none"
                >
                  Register
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
