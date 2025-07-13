import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const AdminUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { flat: room } = state || {};

  const [formData, setFormData] = useState({
    roomDescription: "",
    floor: "",
    address: "",
    rentPrice: "",
    parking: "",
    contactNo: "",
    bathroom: "",
    location: { type: "Point", coordinates: [85.324, 27.7172] }, // Default: Kathmandu
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (room) {
      setFormData({
        roomDescription: room.roomDescription || "",
        floor: room.floor || "",
        address: room.address || "",
        rentPrice: room.rentPrice || "",
        parking: room.parking || "",
        contactNo: room.contactNo || "",
        bathroom: room.bathroom || "",
        location: room.location || { type: "Point", coordinates: [85.324, 27.7172] },
      });
      setLoading(false);
    } else {
      fetch(`http://localhost:3000/api/rooms/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            roomDescription: data.roomDescription || "",
            floor: data.floor || "",
            address: data.address || "",
            rentPrice: data.rentPrice || "",
            parking: data.parking || "",
            contactNo: data.contactNo || "",
            bathroom: data.bathroom || "",
            location: data.location || { type: "Point", coordinates: [85.324, 27.7172] },
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching room details:", error);
          setLoading(false);
        });
    }
  }, [room, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        coordinates:
          name === "latitude"
            ? [formData.location.coordinates[0], Number(value)]
            : [Number(value), formData.location.coordinates[1]],
      },
    });
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData({
          ...formData,
          location: {
            type: "Point",
            coordinates: [e.latlng.lng, e.latlng.lat],
          },
        });
      },
    });
    return (
      <Marker
        position={[formData.location.coordinates[1], formData.location.coordinates[0]]}
      />
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("roomDescription", formData.roomDescription);
    formDataToSend.append("floor", formData.floor);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("rentPrice", formData.rentPrice);
    formDataToSend.append("parking", formData.parking);
    formDataToSend.append("contactNo", formData.contactNo);
    formDataToSend.append("bathroom", formData.bathroom);
    formDataToSend.append("location", JSON.stringify(formData.location));
    if (selectedImage) {
      formDataToSend.append("roomImage", selectedImage);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/rooms/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Room updated successfully");
        navigate("/adminDash");
      } else {
        alert("Failed to update room");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Error updating room");
    }
  };

  return (
    <div className="flex">
      {/* Left Menu Bar */}
      <div className="bg-gray-800 text-white w-64 p-6 flex flex-col justify-between min-h-screen">
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Admin Dashboard
          </h2>
          <ul className="space-y-4 mt-4">
            <li>
              <button
                onClick={() => navigate("/adminDash")}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
              >
                <FaHome className="mr-2" /> Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/addRooms")}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Rooms
              </button>
            </li>
          </ul>
        </div>
        <div className="flex justify-between mt-auto space-x-2">
          <button
            onClick={() => navigate("/")}
            className="w-full text-left px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-600 text-white font-bold"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("isAdmin");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="w-full text-left px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Update Room Form */}
      <div className="flex-1 p-6 overflow-auto bg-gray-100">
        <div className="border-4 border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-center">
            {loading ? "Loading Room Details..." : "Update Room Details"}
          </h3>
          {loading ? (
            <div className="text-center text-gray-600">
              Please wait while we load the room details...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Room Image Upload */}
              <div>
                <label className="block text-gray-600">Room Image</label>
                <input
                  type="file"
                  name="roomImage"
                  onChange={handleImageChange}
                  className="w-full p-1 border rounded mt-1 text-sm"
                  accept="image/*"
                />
                {formData.roomImage && (
                  <img
                    src={selectedImage ? URL.createObjectURL(selectedImage) : `http://localhost:3000/${formData.roomImage}`}
                    alt="Room Preview"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>

              {/* Room Description */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600">Room Description</label>
                <input
                  type="text"
                  name="roomDescription"
                  value={formData.roomDescription}
                  onChange={handleChange}
                  className="w-96 p-2 border rounded mt-1 text-sm"
                />
              </div>

              {/* Floor */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600">Floor</label>
                <select
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-96 p-2 border rounded mt-1 text-sm"
                >
                  <option value="">Select Floor</option>
                  {[1, 2, 3, 4].map((floor) => (
                    <option key={floor} value={floor}>
                      {floor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-96 p-2 border rounded mt-1 text-sm"
                />
              </div>

              {/* Rent Price */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600">Rent Price</label>
                <input
                  type="number"
                  name="rentPrice"
                  value={formData.rentPrice}
                  onChange={handleChange}
                  className="w-96 p-2 border rounded mt-1 text-sm"
                />
              </div>

              {/* Parking */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600">Parking</label>
                <select
                  name="parking"
                  value={formData.parking}
                  onChange={handleChange}
                  className="w-96 p-2 border rounded mt-1 text-sm"
                >
                  <option value="">Select Parking</option>
                  <option value="available">Available</option>
                  <option value="not available">Not Available</option>
                </select>
              </div>

              {/* Contact No */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600">Contact No</label>
                <input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="w-96 p-2 border rounded mt-1 text-sm"
                />
              </div>

              {/* Bathroom */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600">Bathrooms</label>
                <select
                  name="bathroom"
                  value={formData.bathroom}
                  onChange={handleChange}
                  className="w-96 p-2 border rounded mt-1 text-sm"
                >
                  <option value="">Select Bathrooms</option>
                  {[1, 2, 3].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600">Location</label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    name="latitude"
                    value={formData.location.coordinates[1]}
                    onChange={handleCoordinateChange}
                    className="w-48 p-2 border rounded mt-1 text-sm"
                    placeholder="Latitude"
                    step="any"
                  />
                  <input
                    type="number"
                    name="longitude"
                    value={formData.location.coordinates[0]}
                    onChange={handleCoordinateChange}
                    className="w-48 p-2 border rounded mt-1 text-sm"
                    placeholder="Longitude"
                    step="any"
                  />
                </div>
                <div className="mt-2">
                  <MapContainer
                    center={[formData.location.coordinates[1], formData.location.coordinates[0]]}
                    zoom={13}
                    style={{ height: "300px", width: "100%" }}
                    className="rounded-lg shadow-md"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker />
                  </MapContainer>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md"
                >
                  Update Room
                </button>
                <button
                  onClick={() => navigate("/adminDash")}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUpdate;