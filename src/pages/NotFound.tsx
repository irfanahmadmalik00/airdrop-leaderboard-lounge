
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-crypto-black">
      <div className="text-center glass-panel p-10 rounded-xl animate-fadeIn">
        <div className="w-24 h-24 bg-crypto-gray/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-6xl font-bold text-crypto-green">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">Page Not Found</h1>
        <p className="text-xl text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="crypto-btn-primary">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
