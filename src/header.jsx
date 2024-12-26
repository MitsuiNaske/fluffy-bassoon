import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="flex justify-between items-center bg-blue-500 py-5 px-24 text-white">
            <div>
                <img src="./src/assets/DM.svg" alt="" />
            </div>

            <nav className="">
                <ul className="flex gap-10 text-xl">
                    <li>
                        <button onClick={() => navigate("/chat")}>Chat</button>
                    </li>
                    <li>
                        <button onClick={() => navigate("/login")}>Login</button>
                    </li>
                    <li>
                        <button onClick={() => navigate("/register")}>Register</button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;