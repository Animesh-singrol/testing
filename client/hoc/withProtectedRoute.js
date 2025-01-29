"use client";
// hoc/withProtectedRoute.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const withProtectedRoute = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();

    // Select authentication state and loading state from Redux
    const isAuthenticated = useSelector(
      (state) => state?.user?.isAuthenticated
    );
    const isLoading = useSelector((state) => state?.user?.isLoading);

    // Local state to handle delay before rendering or redirecting
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // Add a 1-second delay to determine the final state
      const timer = setTimeout(() => {
        if (!isLoading) {
          if (!isAuthenticated) {
            router.push("/signin"); // Redirect unauthenticated users
          } else {
            setIsReady(true); // Mark as ready to render the component
          }
        }
      }, 1000); // 1-second delay

      return () => clearTimeout(timer); // Clean up timer on component unmount
    }, [isAuthenticated, isLoading, router]);

    // Show a loading screen during the delay
    if (!isReady && (isLoading || !isAuthenticated)) {
      return (
        <div className="flex flex-col items-center justify-center space-y-2 h-screen">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ); // Optional: Replace with a spinner or skeleton
    }

    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `WithProtectedRoute(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return Wrapper;
};

export default withProtectedRoute;
