import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DefaultUserAvatar from "../assets/default-user-avatar.png";
import Button from "../components/Button";
import Post from "../components/Post";
import DefaultAvatar from "../assets/default-user-avatar.png";

const User = () => {
  const id = useLocation().pathname.split("/")[2];
  const [user, setUser] = useState<any>(null);

  const [subscribed, setSubscribed] = useState<boolean>(false);

  const [myUser, setMyUser] = useState<any>(null);
  const [canSub, setCanSub] = useState<any>(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    Promise.all([
      axios.get(`/api/user/get/${id}`),
      axios
        .get(`/api/auth/issubscribed/${id}`, { withCredentials: true })
        .catch(() => ({ data: { subscribed: false } })),
      axios
        .get("/api/auth/me", { withCredentials: true })
        .catch(() => ({ data: null })),
    ])
      .then(([userRes, subsRes, meRes]) => {
        setUser(userRes.data);
        setSubscribed(subsRes.data.subscribed);
        setMyUser(meRes.data);

        if (meRes.data && userRes.data.id === meRes.data.id) {
          setCanSub(false);
        }
      })
      .catch(() => {
        setUser(null);
        setError(true);
      });
  }, [id]);

  // кнопки
  const handleSubscribe = async () => {
    await axios.post(
      "/api/auth/subscribe",
      { targetId: id },
      { withCredentials: true },
    );
    setSubscribed(true);
  };

  const handleUnsubscribe = async () => {
    await axios.post(
      "/api/auth/unsubscribe",
      { targetId: id },
      { withCredentials: true },
    );
    setSubscribed(false);
  };

  if (error) return <div className="text-red-500">Что-то пошло не так...</div>;
  if (!user) return null;

  return (
    <>
      <>
        <div className="flex flex-col gap-4">
          <div className="w-full flex flex-col lg:flex-row items-center gap-4 justify-between user-back-gradient rounded-2xl p-4">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-16 sm:gap-8 items-center">
              <img
                src={
                  user.avatar == ""
                    ? DefaultAvatar
                    : `/storage/avatars/${user.avatar}`
                }
                alt={`Аватар ${user.name}`}
                className="size-48 rounded-full border-primary border-8"
              />

              <div className="text-5xl roboto-bold text-white">{user.name}</div>
              <div className="text-xl roboto-light text-white">
                Подписчиков: {user.subscribers}
              </div>
            </div>

            {myUser &&
              (canSub ? (
                subscribed ? (
                  <button onClick={handleUnsubscribe}>
                    <Button text="Отписаться" icon="" top={false} />
                  </button>
                ) : (
                  <button onClick={handleSubscribe}>
                    <Button text="Подписаться" icon="" top={false} />
                  </button>
                )
              ) : (
                <Link to={`/account/`}>
                  <Button text="Настроить профиль" icon="" top={false} />
                </Link>
              ))}
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="flex flex-row gap-4 items-center">
              {user.total_likes > 0 && (
                <div className="flex flex-col gap-2 items-center">
                  <div className="text-2xl roboto-bold">{user.total_likes}</div>
                  <div>лайков</div>
                </div>
              )}
              {user.total_likes > 0 && user.posts.length > 0 && (
                <div className="h-8 w-1 bg-gray-300" />
              )}

              {user.posts.length > 0 && (
                <div className="flex flex-col gap-2 items-center">
                  <div className="text-2xl roboto-bold">
                    {user.posts.length}
                  </div>
                  <div>постов</div>
                </div>
              )}
            </div>
          </div>

          {user.posts && user.posts.length > 0 ? (
            <div className="flex flex-col gap-4 ">
              {user.posts.map((postId: string) => (
                <Post key={postId} id={postId} />
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center ">
              <div className="text-gray-400 mt-8">
                Пользователь {user.name} ещё не написал ни одного поста.
              </div>
            </div>
          )}
        </div>
      </>
    </>
  );
};

export default User;
