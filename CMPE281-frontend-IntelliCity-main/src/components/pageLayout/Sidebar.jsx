import React, { useState } from "react";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import AnimatedButton from "./Animatedbutton";
import ProfilePic from "../../medias/profilePic.jpeg";
import { capitalizeFirstLetter } from "../../utils/utilFunctions.js";

export default function Sidebar() {
  const [selectedPath, setSelectedPath] = useState(window.location.pathname);

  const handleClick = (path) => () => {
    window.location.href = path;
    setSelectedPath(path);
  };

  const isActive = (path) => {
    return path === selectedPath ? "bg-gray-800 text-white" : "text-gray-700";
  };

  return (
    <Card className="h-[calc(100vh-7rem)] w-full max-w-[16rem] p-4 text-xl shadow-xl shadow-blue-gray-900">
      <div className="flex flex-col mb-5 p-4 w-full justify-center items-center">
        <img src={ProfilePic} alt="Icon" className="w-20 h-20 rounded-full" />
        <h1 className="text-2xl font-bold">
          {capitalizeFirstLetter(localStorage.getItem("firstname")) +
            " " +
            capitalizeFirstLetter(localStorage.getItem("lastname"))}
        </h1>
        {parseInt(localStorage.getItem("is_agent")) === 1 ? (
          <h1 className="text-lg text-gray-700 font-semibold">City Traffic Agent</h1>
        ) : (
          <h1 className="text-lg text-gray-700">Public Client</h1>
        )}
      </div>
      <List className="flex flex-col space-y-10">
        <ListItem className={isActive("/")} onClick={handleClick("/")}>
          <ListItemPrefix>
            <span className="material-symbols-outlined text-3xl">
              {"dashboard"}
            </span>
          </ListItemPrefix>
          <AnimatedButton>Dashboard</AnimatedButton>
        </ListItem>

        <ListItem
          className={isActive("/camera")}
          onClick={handleClick("/camera")}
        >
          <ListItemPrefix>
            <span className="material-symbols-outlined text-3xl">
              {"photo_camera"}
            </span>
          </ListItemPrefix>
          <AnimatedButton>Camera Manager</AnimatedButton>
        </ListItem>

        <ListItem className={isActive("/iot")} onClick={handleClick("/iot")}>
          <ListItemPrefix>
            <span className="material-symbols-outlined text-3xl">
              {"sensors"}
            </span>
          </ListItemPrefix>
          <AnimatedButton>IoT Manager</AnimatedButton>
        </ListItem>

        <ListItem
          className={isActive("/drone")}
          onClick={handleClick("/drone")}
        >
          <ListItemPrefix>
            <span className="material-symbols-outlined text-3xl">
              {"flight"}
            </span>
          </ListItemPrefix>
          <AnimatedButton>Drone Manager</AnimatedButton>
        </ListItem>
      </List>
    </Card>
  );
}
