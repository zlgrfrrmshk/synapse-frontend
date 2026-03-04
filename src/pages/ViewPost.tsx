import React from "react";
import { useLocation } from "react-router-dom";
import Post from "../components/Post";

const ViewPost = () => {
  const id = useLocation().pathname.split("/")[2];
  return <Post id={id} />;
};

export default ViewPost;
