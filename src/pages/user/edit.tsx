import type { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

import { UserEdit } from "@/features/user/edit";

export default function UserEditPage() {
  return <UserEdit />;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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
