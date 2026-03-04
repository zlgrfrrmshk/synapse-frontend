import Button from "./components/Button";
import Post from "./components/Post";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/Home";
import AccountPage from "./pages/Account";
import axios from "axios";
import { useEffect, useState } from "react";
import UserPage from "./pages/User";
import NewPostPage from "./pages/NewPost";
import SearchPage from "./pages/Search";
import ViewPostPage from "./pages/ViewPost";
import DefaultAvatar from "../src/assets/default-user-avatar.png";

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);
  const location = useLocation();
  return (
    <div className="w-full sm:p-10 p-5 flex flex-col gap-4 ">
      {/* desktop menu bar */}
      <div className="hidden sm:flex w-full flex-row items-center justify-between relative">
        <Link
          to={`/`}
          className="roboto-bold text-4xl mainheader nonselectable"
        >
          Synapse
        </Link>

        <Link
          to={`/search/`}
          className="nonselectable flex items-center justify-center absolute left-1/2 -translate-x-1/2 bg-search-bar roboto-regular text-text-light h-full sm:w-48 md:w-84 lg:w-128 rounded-full anim cursor-pointer"
        >
          <div>Поиск</div>
        </Link>

        <div className="flex flex-row gap-2">
          {user ? (
            <>
              <Link to={`/new/`} className="h-full">
                <Button text="Новый пост" icon="plus" top={false} />
              </Link>
              <Link to="/account/" className="h-full">
                <Button text="" icon="google" top={false} />
              </Link>
            </>
          ) : (
            <>
              <Link to="/account/">
                <Button text="Войти" icon="google" top={false} />
              </Link>
            </>
          )}
        </div>
      </div>
      {/* mobile menu bar */}
      <div className="flex sm:hidden w-full flex-row gap-2 items-center justify-between relative h-10">
        {user && (
          <Link className="inline-block flex-shrink-0" to={`/user/${user.id}`}>
            <img
              src={
                user.avatar == ""
                  ? DefaultAvatar
                  : `/storage/avatars/${user.avatar}`
              }
              alt=""
              className="size-10 rounded-full anim border-primary border-2"
            />
          </Link>
        )}

        <Link
          to={`/search/`}
          className="nonselectable flex items-center justify-center bg-search-bar roboto-regular text-text-light h-full w-full rounded-full anim cursor-pointer"
        >
          <div>Поиск</div>
        </Link>

        {user ? (
          <Link
            to={`/new/`}
            className="min-w-10 max-w-10 min-h-10 max-h-10 overflow-hidden flex items-center justify-center"
          >
            <Button text="" icon="plus" top={true} />
          </Link>
        ) : (
          <Link
            to={`/account/`}
            className="min-w-10 max-w-10 min-h-10 max-h-10 overflow-hidden flex items-center justify-center"
          >
            <Button text="" icon="google" top={true} />
          </Link>
        )}
      </div>

      <div className="wrapper ">
        <div key={location.key}>
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="new" element={<NewPostPage />} />
              <Route path="user">
                <Route path=":userid" element={<UserPage />} />
              </Route>
            </Route>
            <Route path="post">
              <Route path=":postId" element={<ViewPostPage />} />
            </Route>
            <Route path="search" element={<SearchPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
