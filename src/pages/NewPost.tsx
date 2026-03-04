import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";

const NewPost = () => {
  const [caption, setCaption] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("caption", caption);
    if (photo) formData.append("photo", photo);
    const res = await axios.post("/api/post/create", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data) navigate(`/user/${res.data.user_id}`);
    setLoading(false);
  };

  const [user, setUser] = useState<any>(null);

  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

  const canSubmit = caption.trim() || photo;
  if (loadingUser)
    return (
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
    );
  if (!user) return null;
  return (
    <>
      {user ? (
        <div className="flex flex-col gap-2">
          <div className="roboto-bold text-2xl">Новый пост</div>

          {preview && (
            <div className="relative w-fit">
              <img src={preview} className="max-h-64 rounded-2xl" />
              <button
                onClick={removePhoto}
                className="cursor-pointer absolute top-2 right-2 bg-black/50 size-fit p-2 text-white rounded-full"
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

          <textarea
            className="bg-search-bar p-4 rounded-2xl w-full max-w-160 min-h-32"
            placeholder="Текст публикации"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handlePhoto}
            className="hidden"
          />

          <div className="flex flex-row gap-2">
            {canSubmit && (
              <button
                className="flex-shrink-0 w-fit"
                onClick={handleSubmit}
                disabled={loading}
              >
                <Button
                  text={loading ? "Создание..." : "Создать"}
                  icon="plus"
                  top={false}
                />
              </button>
            )}
            <button
              className="flex-shrink-0 w-fit"
              onClick={() => fileRef.current?.click()}
            >
              <Button text="Добавить фото" icon="camera" top={false} />
            </button>
          </div>
        </div>
      ) : (
        <Link to={`/account/`}>
          <Button icon="" top={false} text="Войдите, чтобы написать пост" />
        </Link>
      )}
    </>
  );
};

export default NewPost;
