import { useContext } from "react";

import { Box } from "@chakra-ui/react";
import { parseCookies } from "nookies";

import { TitleSection } from "@/components/TitleSection";
import { AuthContext } from "@/contexts/AuthContext";
import { Dashboard } from "@/features/dashboard";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Box>Loading...</Box>;
  }

  return (
    <>
      <TitleSection title="Painel do criador" />
      <Box flex="1" borderRadius={8} mb={8}>
        <Dashboard user={user} />
      </Box>
    </>
  );
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
