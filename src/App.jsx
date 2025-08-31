import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DefaultLayout from "../src/layouts/DefaultLayout.jsx";
import PostList from "./components/Postlist/PostList.jsx";
import Post from "./components/Post/Post.jsx";
import NewPostPage from "./components/NewPostPage/NewPostPage.jsx";
import EditPostPage from "./components/EditPostPage/EditPostPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<Navigate to={"/travels"} />} />
          <Route path="/travels" element={<PostList />} />
          <Route path="/travels/:id" element={<Post />} />
          <Route path="/travels/new" element={<NewPostPage />} />
          <Route path="/travels/:id/edit" element={<EditPostPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
