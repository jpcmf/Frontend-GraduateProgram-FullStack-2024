import { useContext } from "react";
import { parseCookies } from "nookies";
import { AuthContext } from "@/contexts/AuthContext";
import { Dashboard } from "@/features/dashboard";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  return <Dashboard user={user} />;
}

export const getServerSideProps = async (ctx: any) => {
  const { ["auth.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }
  return {
    props: {}
  };
};
