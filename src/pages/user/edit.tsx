import { parseCookies } from "nookies";
import { UserEdit } from "@/features/user/edit";

export default function UserEditPage() {
  return <UserEdit />;
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
