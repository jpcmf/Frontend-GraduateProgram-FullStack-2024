# Feature Backlog — Dashboard Card 3

Collected during the Spots feature session (April 2026).
Context: the "Painel do criador" has a 4th quick-action card (card 3, currently labelled "Em breve") that needs a feature assigned.

## Candidates

### 1. Criar uma postagem ⭐ recommended

A freeform text/photo feed post — the most common social feature missing from the current feature set.
Complements Stories well: stories = ephemeral, posts = permanent.
High expected value, medium implementation effort.

### 2. Adicionar vídeo

Link or upload a skate clip associated with a spot or the user's profile.
Could integrate with existing Spot detail page (video tab).

### 3. Criar um evento

Local skate sessions, contests, or meetups at a specific spot.
Adds the most unique value to a skate community specifically.
Requires a new Strapi content type.

### 4. Criar uma lista de spots

Curated "spot guides" (e.g. "Best spots in Porto Alegre").
Already mentioned as a future feature in `specs/spots.md` (Out of Scope: SpotList).
Lower effort since the Spot infrastructure is already in place.

## Notes

- Card 3 currently uses the `RiBookOpenLine` icon — update the icon when the feature is decided.
- Card 3 `href` is currently `/` (placeholder) — wire it up once the route exists.
