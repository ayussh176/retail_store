import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Products from "./pages/customer/Products";
import Cart from "./pages/customer/Cart";
import Orders from "./pages/customer/Orders";
import Profile from "./pages/customer/Profile";
import Inventory from "./pages/retailer/Inventory";
import OrderManagement from "./pages/retailer/OrderManagement";
import Revenue from "./pages/retailer/Revenue";
import RetailerProfile from "./pages/retailer/RetailerProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole?: string }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'customer' ? '/customer/products' : '/retailer/inventory'} />;
  }
  
  return <Layout>{children}</Layout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            
            {/* Customer Routes */}
            <Route path="/customer/products" element={
              <ProtectedRoute allowedRole="customer">
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/customer/cart" element={
              <ProtectedRoute allowedRole="customer">
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/customer/orders" element={
              <ProtectedRoute allowedRole="customer">
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/customer/profile" element={
              <ProtectedRoute allowedRole="customer">
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Retailer Routes */}
            <Route path="/retailer/inventory" element={
              <ProtectedRoute allowedRole="retailer">
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="/retailer/orders" element={
              <ProtectedRoute allowedRole="retailer">
                <OrderManagement />
              </ProtectedRoute>
            } />
            <Route path="/retailer/revenue" element={
              <ProtectedRoute allowedRole="retailer">
                <Revenue />
              </ProtectedRoute>
            } />
            <Route path="/retailer/profile" element={
              <ProtectedRoute allowedRole="retailer">
                <RetailerProfile />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
