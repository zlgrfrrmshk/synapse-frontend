import React, { useEffect, useState } from "react";
import User from "../components/User";
import axios from "axios";
import Button from "../components/Button";
import Post from "../components/Post";

const Search = () => {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    axios
      .get("/api/auth/subscriptions", { withCredentials: true })
      .then((res) => setIds(res.data))
      .catch(() => setIds([]));
  }, []);

  const [query, setQuery] = useState("");
  const [searchUsers, setSearchUsers] = useState<string[]>([]);
  const [searchPosts, setSearchPosts] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    axios
      .get("/api/auth/subscriptions", { withCredentials: true })
      .then((res) => setIds(res.data))
      .catch(() => setIds([]));
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const res = await axios.get(`/api/search?q=${query}`);
    setSearchUsers(res.data.users);
    setSearchPosts(res.data.posts);
    setSearched(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Поиск"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border-primary border-4 p-4 rounded-2xl w-full h-full"
        />
        <button onClick={handleSearch}>
          <Button text="" icon="search" top={false} />
        </button>
      </div>

      {searched ? (
        <>
          <div className="roboto-bold text-3xl">Результаты поиска</div>
          <div className="flex flex-col gap-4">
            {searchUsers.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 w-full gap-4">
                  {searchUsers.map((id) => (
                    <User key={id} id={id} />
                  ))}
                </div>
              </div>
            )}
            {searchPosts.length > 0 && (
              <div className="flex flex-col gap-4">
                {searchPosts.map((id) => (
                  <Post key={id} id={id} />
                ))}
              </div>
            )}
            {searchUsers.length === 0 && searchPosts.length === 0 && (
              <div className="text-gray-400">Ничего не найдено.</div>
            )}
          </div>
        </>
      ) : (
        <div>
          {ids.length != 0 && (
            <div className="flex flex-col gap-2">
              <div className="roboto-bold text-2xl">Ваши подписки</div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 w-full h-full sm:gap-8 gap-4">
                {ids.map((id) => (
                  <User key={id} id={id} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
