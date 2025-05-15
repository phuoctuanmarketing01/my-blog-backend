import { useState, useEffect } from "react";
import "./App.css";
import { toast } from "react-toastify";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "https://my-blog-backend.onrender.com/api/posts"
      );
      const data = await response.json();
      setPosts(data);
      localStorage.setItem("posts", JSON.stringify(data));
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Tiêu đề và nội dung không được để trống!");
      return;
    }
    try {
      const response = await fetch(
        "https://my-blog-backend.onrender.com/api/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        }
      );
      if (response.ok) {
        toast.success("Bài viết đã được đăng!");
        setTitle("");
        setContent("");
        fetchPosts();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Lỗi khi đăng bài");
      }
    } catch (error) {
      toast.error("Lỗi kết nối: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa bài viết này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://my-blog-backend.onrender.com/api/posts/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast.success("Bài viết đã được xóa!");
        fetchPosts();
      } else {
        toast.error("Lỗi khi xóa bài");
      }
    } catch (error) {
      toast.error("Lỗi kết nối: " + error.message);
    }
  };

  const handleEdit = (post) => {
    setEditId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Tiêu đề và nội dung không được để trống!");
      return;
    }
    try {
      const response = await fetch(
        `https://my-blog-backend.onrender.com/api/posts/${editId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editTitle, content: editContent }),
        }
      );
      if (response.ok) {
        toast.success("Bài viết đã được cập nhật!");
        setEditId(null);
        setEditTitle("");
        setEditContent("");
        fetchPosts();
      } else {
        toast.error("Lỗi khi cập nhật bài");
      }
    } catch (error) {
      toast.error("Lỗi kết nối: " + error.message);
    }
  };

  return (
    <div className="App">
      <h1>Đăng bài viết</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tiêu đề: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Nội dung: </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Đăng bài</button>
      </form>

      <h2>Danh sách bài viết</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {editId === post.id ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setEditId(null)}>
                  Hủy
                </button>
              </form>
            ) : (
              <>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <button className="edit" onClick={() => handleEdit(post)}>
                  Chỉnh sửa
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(post.id)}
                >
                  Xóa
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
