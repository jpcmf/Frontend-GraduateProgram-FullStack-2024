# Feature: AI Assistant — RAG (Retrieval-Augmented Generation)

**Status:** planned
**Priority:** high (post-MVP)
**Affects:** AI Assistant backend, data layer, knowledge ingestion pipeline

## Problem Statement

The current AI Assistant relies only on general model knowledge, which can lead to generic or inconsistent answers.

To provide accurate, contextual, and domain-specific responses about skateboarding, the system must incorporate a structured knowledge base.

---

## Goal

Enhance the AI Assistant with Retrieval-Augmented Generation (RAG), enabling it to:

- Retrieve relevant skateboarding knowledge
- Provide more precise and grounded answers
- Reduce hallucinations

---

## High-Level Architecture

User → AI Assistant → Retrieval Layer → Context Injection → LLM → Response

---

## Data Sources (initial)

- Curated skateboarding guides (manual content)
- FAQs
- Platform content (future):
  - Spot descriptions
  - Community-generated content

---

## Data Processing Pipeline

### Ingestion

- Collect content (manual + platform data)
- Normalize text (clean, structured format)

---

### Chunking

- Split content into smaller segments (e.g., 300–800 tokens)

---

### Embeddings

- Convert chunks into vector representations using embedding model

---

### Storage

- Store vectors in a vector database

---

## Retrieval Flow

1. User sends question
2. Convert query into embedding
3. Retrieve top-k similar chunks
4. Inject retrieved context into prompt
5. Send to LLM
6. Return structured response

---

## API Changes

### `/api/ai/chat`

- Now includes retrieval step before LLM call

---

### Internal steps

- `embedQuery(question)`
- `searchSimilarChunks(vector)`
- `buildContext(chunks)`
- `generateAnswer(context + question)`

---

## Prompt Changes

- Include retrieved context before user question
- Explicit instruction:
  - Use provided context
  - Do not invent information outside context when possible

---

## Component & File Plan

### New files

| File                           | Purpose                             |
| ------------------------------ | ----------------------------------- |
| `src/services/embeddings.ts`   | Generate embeddings                 |
| `src/services/vectorSearch.ts` | Query vector database               |
| `src/services/ragPipeline.ts`  | Orchestrates retrieval + generation |

---

## Acceptance Criteria

- [ ] AI Assistant uses retrieved context in responses
- [ ] Answers are more specific and less generic
- [ ] Reduced hallucination compared to baseline
- [ ] Retrieval step executes within acceptable latency
- [ ] System handles empty or low-confidence retrieval gracefully

---

## Performance Considerations

- Limit number of retrieved chunks (top-k)
- Optimize embedding and query latency
- Cache frequent queries (optional)

---

## Out of Scope (initial RAG)

- Real-time indexing of new user content
- Personalized retrieval per user
- Multi-language support
- Feedback loop / ranking improvements
- Hybrid search (keyword + vector)
