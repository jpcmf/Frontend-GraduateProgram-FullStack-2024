import { Roboto, Raleway } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: "400"
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["400", "500", "600", "700"]
});

export const fonts = {
  roboto,
  raleway
};
