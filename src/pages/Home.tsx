// import React from 'react'

import { useEffect, useState } from "react";
import Post from "../components/Post";
import axios from "axios";
import User from "../components/User";

const Home = () => {
  const [feed, setFeed] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("/api/feed", { withCredentials: true })
      .then((res) => setFeed(res.data))
      .catch(() => setFeed([]));
  }, []);
  return (
    <div className="flex flex-col gap-4">
      {feed.map((id) => (
        <Post key={id} id={id} />
      ))}
      <div className="text-black/50 w-full flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="square"
          className="lucide lucide-loader size-8 animate-spin"
          role="status"
          aria-label="Loading"
        >
          <path d="M12 2v4"></path>
          <path d="m16.2 7.8 2.9-2.9"></path>
          <path d="M18 12h4"></path>
          <path d="m16.2 16.2 2.9 2.9"></path>
          <path d="M12 18v4"></path>
          <path d="m4.9 19.1 2.9-2.9"></path>
          <path d="M2 12h4"></path>
          <path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    </div>
  );
};

export default Home;
