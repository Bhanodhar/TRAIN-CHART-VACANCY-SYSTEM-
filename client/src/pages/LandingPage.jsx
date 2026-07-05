import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-600 px-10 py-4 flex justify-between items-center shadow-md">
        <div className="text-white text-2xl font-bold">🚆 TrainBook</div>
        <div>
          {user ? (
            <button onClick={() => navigate( user.role === "admin" ? "/admin/dashboard": "/user/dashboard")}
              className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg hover:bg-blue-50 transition">
              Go to Dashboard
            </button>
          ) : (
            <button onClick={() => navigate("/admin/login")}
              className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg hover:bg-blue-50 transition" >
              Admin Login
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">
          Book Your Train Tickets
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          Fast, easy and reliable train booking system
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate("/user/register")} className="bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition" >
            Register
          </button>
          <button onClick={() => navigate("/user/login")} className="border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition" >
            Login
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex flex-wrap justify-center gap-6 px-6 pb-16">
        <FeatureCard icon="🎫" title="Easy Booking" description="Book your train tickets in just a few clicks" />
        <FeatureCard icon="🔍" title="Chart Vacancy" description="View seat availability with color coded chart" />
        <FeatureCard icon="❌" title="Easy Cancellation" description="Cancel your tickets anytime with ease" />
      </div>

    </div>
  );
};

// Separate reusable component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 w-64 text-center hover:shadow-lg transition">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
};

export default LandingPage;