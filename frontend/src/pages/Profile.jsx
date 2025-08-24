import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import HistoryModal from "../components/HistoryModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserHistory() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const filteredHistory = history.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (historyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this history item?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`${BASE_URL}/api/queries/${historyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => prev.filter((h) => h.id !== historyId));
      toast.success("History deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting entry");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const goToHome = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchProfileAndHistory = async () => {
      try {
        const profileRes = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileRes.data.user);

        const historyRes = await axios.get(`${BASE_URL}/api/queries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(historyRes.data.data.queries);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading data");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfileAndHistory();
  }, [navigate, token]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white w-full max-w-full relative min-h-[90vh]">
      <div className="bg-white max-w-[968px] mx-auto flex flex-col lg:flex-row relative border border-gray-200 rounded-xl shadow-lg overflow-hidden mt-10">
        {/* Background Blur Effects */}
        <div className="absolute w-full h-full inset-0 overflow-hidden pointer-events-none z-0">
          {/* ...your blur effect divs remain unchanged here */}
        </div>

        {/* Left Panel - Profile Section */}
        <div className="w-full lg:w-1/3 bg-gray-50 z-10 flex flex-col justify-center items-center p-6 border-r border-gray-200">
          <img
            src="/images/user.png"
            alt="User Avatar"
            className="w-24 h-24 rounded-full mb-4 border-4 border-purple-200 shadow-sm"
          />
          <div className="text-left">
            <h1 className="text-xl font-bold mb-1 text-gray-800">
              User Profile
            </h1>
            <p className="text-gray-600">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Joined:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm transition cursor-pointer"
            >
              Logout
            </button>
            <button
              onClick={goToHome}
              className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm transition cursor-pointer"
            >
              Home
            </button>
          </div>
        </div>

        {/* Right Panel - History Section */}
        <div className="w-full lg:w-2/3 p-6 z-10">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search history by question..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <h2 className="text-xl font-semibold mb-4 text-left text-gray-800">
            Search History
          </h2>

          <div className="max-h-[60vh] min-h-[60vh] overflow-y-auto pr-2 space-y-4">
            {filteredHistory.length > 0 ? (
              <ul className="space-y-4">
                {filteredHistory.map((item) => (
                  <li
                    key={item.id}
                    className="bg-gray-100 p-4 rounded-md shadow-sm"
                  >
                    <p className="font-semibold text-gray-800 mb-1 text-left">
                      Q:{" "}
                      {item.question
                        ? item.question.split(" ").slice(0, 8).join(" ")
                        : "No question"}
                      {item.question && item.question.split(" ").length > 8
                        ? "..."
                        : ""}
                    </p>
                    <p className="text-sm text-gray-700 mb-2 text-left">
                      A:{" "}
                      {item.answer
                        ? item.answer.split(" ").slice(0, 10).join(" ")
                        : "No answer"}
                      {item.answer && item.answer.split(" ").length > 10
                        ? "..."
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500 text-left">
                      {new Date(item.createdAt).toLocaleDateString()} at{" "}
                      {new Date(item.createdAt).toLocaleTimeString()}
                      <span
                        onClick={() => setSelectedItem(item)}
                        className="text-blue-600 hover:underline cursor-pointer ml-4"
                      >
                        View
                      </span>
                      <span
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:underline cursor-pointer ml-4"
                      >
                        Delete
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm text-left">
                No history found.
              </p>
            )}
          </div>

          {selectedItem && (
            <HistoryModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
