import React from "react";
import { RecipeListPage } from "./pages/RecipeListPage";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import RecipePage from "./pages/RecipePage";
export const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<RecipeListPage />} />
        <Route path='/recipepage' element={<RecipePage />} />
      </Routes>
    </>
  );
};
