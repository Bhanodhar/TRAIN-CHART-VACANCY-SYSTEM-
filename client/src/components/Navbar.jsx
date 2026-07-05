import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 px-10 py-4 flex justify-between items-center shadow-md">
      <div
        className="text-white text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        🚆 TrainBook
      </div>

      <div className="flex items-center gap-4">
        <span className="text-white text-sm font-medium">
          👤 {user?.name}
        </span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg hover:bg-blue-50 transition text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;