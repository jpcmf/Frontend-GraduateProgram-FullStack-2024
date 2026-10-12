"use client";

import { Avatar as ChakraAvatar, AvatarProps as ChakraAvatarProps } from "@chakra-ui/react";

import type { UserBasics } from "@/features/user";

/**
 * Minimal user shape the avatar needs — satisfied by both `User` and `UserBasics`.
 * `null`/`undefined` is allowed so the component is safe when no one is signed in.
 */
type AvatarUser = Pick<UserBasics, "name" | "avatar">;

interface AvatarProps extends Omit<ChakraAvatarProps, "name" | "src"> {
  user?: AvatarUser | null;
  /** Wrap the avatar in the brand gradient ring (used by the sidebar). */
  withRing?: boolean;
}

/**
 * Reusable circular user avatar.
 *
 * Renders the user's uploaded photo when available (Strapi `formats.thumbnail.url`,
 * falling back to the full `url`) and Chakra's initials fallback (derived from `name`)
 * otherwise. Styling matches the card avatar in `New/User/Card`.
 *
 * Every other Chakra `Avatar` prop (`size`, `width`/`height`, `onClick`, …) is passed
 * through and can override the defaults below.
 */
export const SkaterAvatar = ({ user, withRing = false, ...rest }: AvatarProps) => {
  const src = user?.avatar?.formats?.thumbnail?.url ?? user?.avatar?.url;

  const avatar = (
    <ChakraAvatar name={user?.name} src={src} p="2px" borderWidth="2px" borderColor="green.400" {...rest} />
  );

  if (!withRing) return avatar;

  return avatar;
};
