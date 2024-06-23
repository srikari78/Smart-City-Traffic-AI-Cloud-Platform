import { React, useEffect, useState } from "react";
import IOTMap from "../components/IOTMap";
import ADD from "../medias/plus.png";
import view from "../medias/view.svg";
import ButtonCRUD from "../components/ButtonCRUD";
import { districts } from "../utils/mapDistrictCoordinates";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import Toast from "../components/Toast";


const container_height = "65vh";
const container_width = "55vw";


function SpeedChart({speeds}) {
  if (!speeds) {
    return <p>No data available</p>;
  }
  // Transform speeds into an array of objects for Recharts
  const data = speeds.map((speed, index) => ({
    hour: index, speed
  }));

  // Determine the color of each bar based on the speed value
  const getColor = (speed) => {
    if (speed > 60) return '#4CAF50'; // green
    if (speed >= 40) return '#FFEB3B'; // yellow
    return '#F44336'; // red
  };

  return (
    <BarChart width={730} height={250} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="hour" />
      <YAxis label={{ value: 'Speed (mph)', angle: -90, position: 'insideLeft' }} />
      <Tooltip />
      <Legend />
      <Bar dataKey="speed" fill="#8884d8">
        {
          data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.speed)} />
          ))
        }
      </Bar>
    </BarChart>
  );
}


export default function Dashboard() {
  //----------------------states-------------------------------------------------------------
  const [selectLat, setSelectLat] = useState(null);
  const [selectLng, setSelectLng] = useState(null);

  const [toast, setToast] = useState({ message: '', type: '' });

  const getMapCoordinates = (lat, lng) => {
    setSelectLat(lat);
    setSelectLng(lng);
  };

  //==================For View Button============================
  //these are the map center states
  const [mapCenterLat, setMapCenterLat] = useState(districts[0].lat);
  const [mapCenterLng, setMapCenterLng] = useState(districts[0].lng);

  //this is the map center call back function
  const updateMapCoordinates = (lat, lng) => {
    setMapCenterLat(lat);
    setMapCenterLng(lng);
  };

  //this is the map zoom state
  const [mapZoom, setMapZoom] = useState(6);
  //this is the map zoom call back function
  const updateMapZoomOnView = () => {
    setMapZoom(15);
  };

  //this is the map selected marker state
  const [selectedMarker, setSelectedMarker] = useState("");
  //this is the map selected marker call back function
  const updateSelectedMarker = (marker) => {
    setSelectedMarker(marker);
  };
  //==============================================================

  const [updateUI, setUpdateUI] = useState(false);
  const [Devices, setDevices] = useState([]);
  const [searched_data, setSearchedData] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  //----------------------variables-------------------------------------------------------------
  let device = Devices.filter(
    (item) => item.id === selectedDevice
  )[0];
  let status = device ? device.status : "N/A";
  let location = device ? `(${device.latitude}, ${device.longitude})` : "N/A";
  let dist_id = device ? device.dist_id : "N/A";
  let address = device ? device.address : "N/A";
  let agent = localStorage.getItem("is_agent");

  //----------------------API Request-------------------------------------------------------------
  //callback function to disable the device
  const callback_switch_status = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_IOT_SERVER_URL}/api/DisableDevice/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index: id }),
      });
      const data = await response.json();
      // Set toast message
      console.log('should see Toast here')
      setToast({ message: `Device ${id} status updated`, type: 'success' });
      console.log("data", data);
      setUpdateUI(!updateUI);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //callback function to delete the device
  const callback2_delete_device = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_IOT_SERVER_URL}/api/DeleteDevice?id=${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      setToast({ message: `Device ${id} deleted`, type: 'success' });
      setUpdateUI(!updateUI);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //callback3 function to add the device
  const callback3_add_device = async (id) => {
    try {

      const response = await fetch(
        `${process.env.REACT_APP_IOT_SERVER_URL}/api/AddDevice/`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "id": id
          })
        }
      );
      const res = await response.json();
      console.log("res", res);
      setToast({ message: `Device ${id} status added`, type: 'success' });

      setUpdateUI(!updateUI);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //callback4 function to show real time searched results devices from backend
  const callback4_search_results = async (search_term) => {
    if (search_term === "") {
      setSearchedData([]);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_IOT_SERVER_URL}/api/SearchedDevice?search=${search_term}`,
        {
          method: "GET",
        }
      );
      const res = await response.json();

      setSearchedData(res);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  //get the devices data from backend
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_IOT_SERVER_URL}/api/GetAllDevices/`,
          { method: "GET" }
        );
        const data = await response.json();
        console.log(data)
        // Only update the state if the data has changed
        if (JSON.stringify(data) !== JSON.stringify(Devices)) {
          setDevices(data);
          console.log(Devices)
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDevices();
  }, [updateUI, mapCenterLat, mapCenterLng, mapZoom, selectedMarker]);

  const handleSearchSubmit = async (mapCenterLatInput, mapCenterLngInput, id) => {
    if (id !== "") {
      id = parseInt(id);
      let marker = Devices.filter((device) => device.id === id)[0];
      setMapCenterLat(parseFloat(marker.latitude));
      setMapCenterLng(parseFloat(marker.longitude));
      setMapZoom(15);
      setSelectedMarker(marker);
      setSelectLat(marker.latitude);
      setSelectLng(marker.longitude);
      return;
    }

    setMapCenterLat(parseFloat(mapCenterLatInput));
    setMapCenterLng(parseFloat(mapCenterLngInput));
    let marker = Devices.find(
      (device) =>
        parseFloat(device.latitude) === parseFloat(mapCenterLatInput) &&
        parseFloat(device.longitude) === parseFloat(mapCenterLngInput)
    );

    setMapZoom(15);
    setSelectedMarker(marker);
    setSelectLat(mapCenterLatInput);
    setSelectLng(mapCenterLngInput);
  };

  //----------------------functions-------------------------------------------------------------
  const Selected = async (id) => {
    setSelectedDevice(id);
    setUpdateUI(!updateUI);
  };

  //----------------------return-------------------------------------------------------------
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex mb-4 justify-between">
        {agent !== '0' && (
          <>
            <ButtonCRUD
              text="Add"
              imgSrc={ADD}
              altText="IoT Device Add"
              data={searched_data}
              callback3={callback3_add_device}
              callback4={callback4_search_results}
            />
            <ButtonCRUD
              text="Delete"
              imgSrc="https://upload.wikimedia.org/wikipedia/commons/5/5e/Flat_minus_icon_-_red.svg"
              altText="IoT Device Delete"
              data={Devices}
              type="iot"
              callback_switch_status={callback_switch_status}
              callback_delete_device={callback2_delete_device}
            />
            <ButtonCRUD
              text="Update"
              imgSrc="https://upload.wikimedia.org/wikipedia/commons/6/62/Eo_circle_orange_repeat.svg"
              altText="IoT Device Update"
              data={Devices}
              type="iot"
              callback_switch_status={callback_switch_status}
              callback_delete_device={callback2_delete_device}
            />
          </>
        )}

        <ButtonCRUD
          text="View"
          imgSrc={view}
          altText="IoT Device View"
          data={Devices}
          callback_view_device={handleSearchSubmit}
        />
        <Toast message={toast.message} type={toast.type} />
      </div>
      <div className="flex w-auto h-3/4">
        <IOTMap
          centerLatState={mapCenterLat}
          centerLngState={mapCenterLng}
          mapZoomState={mapZoom}
          selectedMarkerState={selectedMarker}
          updateSelectedMarkerCallback={updateSelectedMarker}
          updateMapCoordinatesCallback={updateMapCoordinates}
          updateMapZoomCallback={updateMapZoomOnView}
          getMapCoordinates={getMapCoordinates}
          deviceData={Devices}
          container_height={container_height}
          container_width={container_width}
          Selected={Selected}
        />
        <div className="flex ml-5 flex-col ">
          <div className="flex flex-col w-96 h-96 bg-white shadow-lg mb-6">
            <div className="flex flex-col p-2">
              <h2 className="text-lg font-bold text-center">Status</h2>
              <h3 className="text-lg">
                <strong>Device ID: </strong>
                {selectedMarker.id}
              </h3>
              <h3 className="text-lg">
                <strong>Device Status: </strong>
                {selectedMarker.enabled ? "Enabled" : "Disabled"}
              </h3>
              <h3 className="text-lg">
                <strong>Location: </strong>
                {selectedMarker.latitude ? `(${selectedMarker.latitude}, ${selectedMarker.longitude})` : "N/A"}
              </h3>
              <h3 className="text-lg">
                <strong>Dist ID: </strong>
                {selectedMarker.district}
              </h3>
              <h3 className="text-lg">
                <strong>Address: </strong>
                {selectedMarker.address}
              </h3>
            </div>
          </div>
          <div className="flex flex-col w-96 h-96 bg-white shadow-lg">
            <div className="flex justify-between p-2">
              <h2 className="text-lg font-bold">Hourly Speed</h2>
            </div>
            <div className="flex justify-center px-2 h-full">
              <SpeedChart speeds={selectedMarker.hourlySpeed} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}