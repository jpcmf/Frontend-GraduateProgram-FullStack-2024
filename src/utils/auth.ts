import { GetServerSidePropsContext } from "next";

import { parseCookies } from "nookies";

export const redirectIfAuthenticated = (ctx: GetServerSidePropsContext) => {
  const { ["auth.token"]: token } = parseCookies(ctx);

  if (token) {
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
