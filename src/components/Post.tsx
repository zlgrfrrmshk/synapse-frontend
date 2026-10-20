import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DefaultAvatar from "../assets/default-user-avatar.png";
import Button from "./Button";
import { createPortal } from "react-dom";

const Post = ({ id }: { id: string }) => {
  const [post, setPost] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [postLikes, setPostLikes] = useState<any>(null);
  const [myId, setMyId] = useState<string | null>(null);

  const navigate = useNavigate();

  const [error, setError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setError(true), 15000);

    Promise.all([
      axios.get(`/api/post/get/${id}`),
      axios.get(`/api/post/isliked/${id}`, { withCredentials: true }),
      axios
        .get("/api/auth/me", { withCredentials: true })
        .catch(() => ({ data: null })),
    ])
      .then(([postRes, likedRes, meRes]) => {
        clearTimeout(timeout);
        setPost(postRes.data);
        setPostLikes(Number(postRes.data.likes));
        setLiked(likedRes.data.liked);
        setMyId(meRes.data?.id || null);
      })
      .catch(() => {
        clearTimeout(timeout);
        setPost(null);
        setError(true);
      });
  }, [id]);

  const handleLike = async () => {
    if (liked) {
      await axios.post(`/api/post/unlike/${id}`, {}, { withCredentials: true });
      setLiked(false);
      setPostLikes((prev: number) => prev - 1);
    } else {
      await axios.post(`/api/post/like/${id}`, {}, { withCredentials: true });
      setLiked(true);
      setPostLikes((prev: number) => prev + 1);
    }
  };

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const handleCopyPostLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    setIsCopied(true);
  };

  const handleDelete = async () => {
    const res = await axios.delete(`/api/post/delete/${id}`, {
      withCredentials: true,
    });
    if (res.data.ok) {
      setConfirmDeletePopup(false);
      navigate("/");
    }
  };

  const [confirmDeletePopup, setConfirmDeletePopup] = useState<boolean>(false);

  const askForDeleting = () => {
    setConfirmDeletePopup(true);
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    const intervals = [
      { label: ["год", "года", "лет"], seconds: 31536000 },
      { label: ["месяц", "месяца", "месяцев"], seconds: 2592000 },
      { label: ["день", "дня", "дней"], seconds: 86400 },
      { label: ["час", "часа", "часов"], seconds: 3600 },
      { label: ["минуту", "минуты", "минут"], seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        const [one, few, many] = interval.label;
        const label = count === 1 ? one : count < 5 ? few : many;
        return `${count} ${label} назад`;
      }
    }
    return "только что";
  };

  const [photoPreview, setPhotoPreview] = useState<boolean>(false);
  useEffect(() => {
    if (photoPreview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [photoPreview]);

  if (error) return <div className="text-red-500">Что-то пошло не так...</div>;
  if (!post) return null;

  return (
    <div className="flex flex-col gap-2 w-full sm:max-w-160 glass-container">
      <div className="flex flex-row gap-2 items-center">
        <Link
          to={`/user/${post.user_id}`}
          className="cursor-pointer flex flex-row items-center gap-2"
        >
          <img
            src={
              post.avatar ? `/storage/avatars/${post.avatar}` : DefaultAvatar
            }
            alt={post.name}
            className="border-primary border-2 size-8 rounded-full"
          />
          <div className="roboto-semibold">{post.name}</div>
        </Link>
        <button
          className={`cursor-pointer hover:text-black ${isCopied ? "text-green-700" : "text-black/50"}`}
          onClick={handleCopyPostLink}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12M16 6L12 2M12 2L8 6M12 2V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {myId == post.user_id && (
          <button
            className={`cursor-pointer text-black/50 hover:text-red-500`}
            onClick={askForDeleting}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6H5M5 6H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {confirmDeletePopup && (createPortal(<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
              <div className="roboto-bold text-xl">Удалить пост?</div>
              <div className="text-black/50">Это действие нельзя отменить.</div>
              <div className="flex flex-row gap-2">
                <button onClick={handleDelete} className="w-fit">
                  <Button text="Удалить" icon="" top={false} />
                </button>
                <button
                  onClick={() => setConfirmDeletePopup(false)}
                  className="w-fit"
                >
                  <Button text="Отмена" icon="" top={false} />
                </button>
              </div>
            </div>
          </div>, document.body)
        )}
        <div className="roboto-regular">{timeAgo(post.created_at)}</div>

        {isCopied && (
          <div className="text-green-700 roboto-black">Ссылка скопирована</div>
        )}
      </div>
      {post.photo && (
        <img
          src={`/storage/photos/${post.photo}`}
          onClick={() => setPhotoPreview(true)}
          alt={`Фото к посту ${post.caption}`}
          className="w-full sm:w-auto post-image rounded-xl cursor-pointer "
        />
      )}
      <div className="roboto-medium break-words max-w-96">{post.caption}</div>
      <button onClick={handleLike} className="w-fit">
        <Button
          text={postLikes > 0 ? String(postLikes) : liked ? "1" : "Нравится"}
          top={false}
          icon={liked ? "liked" : "like"}
        />
      </button>

      {photoPreview && (
        <div
          className="madeby-animation fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setPhotoPreview(false)}
        >
          <img
            src={`/storage/photos/${post.photo}`}
            className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white cursor-pointer"
            onClick={() => setPhotoPreview(false)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;
