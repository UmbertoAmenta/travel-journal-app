import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DefaultLayout from "../src/layouts/DefaultLayout.jsx";
import PostList from "./components/Postlist/PostList.jsx";
import Post from "./components/Post/Post.jsx";
import NewPostForm from "./components/NewPostForm/NewPostForm.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<Navigate to={"/travels"} />} />
          <Route path="/travels" element={<PostList />} />
          <Route path="/travels/:id" element={<Post />} />
          <Route path="/admin" element={<NewPostForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
