# SkateHub Frontend — Glossary

Terms specific to this codebase's domain and conventions. Vocabulary must stay aligned with the Strapi backend glossary (`skatehub-strapi/CONTEXT.md`). Implementation details belong in plan/spec docs, not here.

## Comment

A piece of text (with optional links/images) a `User` leaves on a `Spot`. Flat — no threading/replies.

## Reaction

A heart placed by a `User` on a `Comment`. The `type` enum currently allows only `"heart"`, deliberately left extensible for future reaction types. A user has at most one `Reaction` per `Comment` — enforced by the backend upsert logic.

## Report

A user-submitted message about a `Comment` (a reason for reporting it). A **user action** — distinct from `Flagged`. The API endpoint is not yet implemented; the UI for reporting is deferred until the backend endpoint exists.
_Avoid_: Flag, flagging, report button (as a user action)

## Flagged

An admin-set moderation state on a `Comment` (`flagged: true` with `flagged_reason`). Only settable through the Strapi admin panel, not through the public REST API. The comment stays visible — flagging does not hide content.
_Avoid_: Flagging (as a user action)

## Activity Feed

The community-wide feed of recent `Comment`s shown on the home page (`/`), newest first, each linking to its `Spot`. Read-only — reacting and editing happen on the spot detail page. Rendered with the same client-hook pattern as `StoriesHome`.
_Avoid_: Recent Activity (dashboard placeholder), user activity feed, my comments

## Ownership

The rule that only the `User` who created a record may update or delete it. On the frontend, enforced by comparing `user.id` with the record's `author.id` to show/hide edit and delete controls.

## Spot

A skateboarding location (a "pico") that `User`s share. The anchor resource for `Comment` and `Reaction`.
