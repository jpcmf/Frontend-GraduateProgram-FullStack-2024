import { useContext } from "react";

import { Box } from "@chakra-ui/react";

import { TitleSection } from "@/components/TitleSection";
// import { parseCookies } from "nookies";
import { AuthContext } from "@/contexts/AuthContext";
import { Dashboard } from "@/features/dashboard";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <TitleSection title="Dashboard" />
      <Box flex="1" borderRadius={8} mb={8}>
        <Dashboard user={user} />
      </Box>
    </>
  );
}

// export const getServerSideProps = async (ctx: any) => {
//   const { ["auth.token"]: token } = parseCookies(ctx);

//   if (!token) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false
//       }
//     };
//   }
//   return {
//     props: {}
//   };
// };
