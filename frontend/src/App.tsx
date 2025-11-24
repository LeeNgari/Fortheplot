import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import React from "react";
import Layout from "./components/layout/Layout";
import Admin from "./pages/Admin";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MovieDetails from "./pages/MovieDetails";
import Register from "./pages/Register";
import Room from "./pages/Room";
import Rooms from "./pages/Rooms";
import Search from "./pages/Search";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
                <Route path="/register" element={<Register />} />
                <Route path="/room/:id" element={<Room />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/search" element={<Search />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );s
};

export default App;