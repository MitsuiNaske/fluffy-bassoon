import { useNavigate } from "react-router-dom";

const Header = ({socket, verifedToken}) => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        const username = localStorage.getItem("username")
        const userid = localStorage.getItem("userid")
        socket.emit("newUser", { username: username, socketID: userid })
        navigate("/chat")
      }

    return (
        <header className="flex justify-between items-center bg-blue-500 py-5 px-24 text-white">
            <div>
                <img src="./src/assets/DM.svg" alt="" />
            </div>

            <nav className="">
                <ul className="flex gap-10 text-xl">
                    {verifedToken ? (
                        <li>
                            <button onClick={handleSubmit}>Chat</button>
                        </li>
                    ) : (
                        <>
                            <li>
                                <button onClick={() => navigate("/login")}>Login</button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/register")}>Register</button>
                            </li>
                        </>
                    )}
                    
                    
                </ul>
            </nav>
        </header>
    );
}

export default Header;