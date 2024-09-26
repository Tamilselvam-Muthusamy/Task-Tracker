import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth_context";

function Protected({ children }: any) {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // checks if the user is authenticated
    if (!authContext?.isUserAuthenticated()) {
      navigate("/login", { replace: true });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Please wait . . .
      </div>
    );
  }
  return children;
}
export default Protected;
