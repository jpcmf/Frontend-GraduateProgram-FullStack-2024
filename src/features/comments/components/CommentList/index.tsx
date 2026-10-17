"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  useToast
} from "@chakra-ui/react";

import { useAuth } from "@/shared/hooks/useAuth";
import { useColors } from "@/shared/hooks/useColors";
import { Muted } from "@/shared/ui/New/Muted";

import { useComments } from "../../hooks/useComments";
import { useCreateComment } from "../../hooks/useCreateComment";
import { useDeleteComment } from "../../hooks/useDeleteComment";
import { useUpdateComment } from "../../hooks/useUpdateComment";
import { type UpsertReactionInput, useUpsertReaction } from "../../hooks/useUpsertReaction";
import type { Comment } from "../../types/comments";
import { CommentCard } from "../CommentCard";
import { CommentForm } from "../CommentForm";

type SortOrder = "newest" | "oldest";

type CommentListProps = {
  spotId: string | number;
};

export function CommentList({ spotId }: CommentListProps) {
  const toast = useToast();
  const { textSecondary } = useColors();
  const { user } = useAuth();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [sort, setSort] = useState<SortOrder>("newest");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [reactingCommentId, setReactingCommentId] = useState<number | null>(null);
  const [highlightedCommentId, setHighlightedCommentId] = useState<number | null>(null);

  const currentUserId = user?.id ?? null;

  const commentsQuery = useComments(spotId);
  const createCommentMutation = useCreateComment(spotId);
  const reactionMutation = useUpsertReaction(spotId);
  const updateCommentMutation = useUpdateComment(spotId);
  const deleteCommentMutation = useDeleteComment(spotId);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#comment-")) return;

    const id = Number(hash.replace("#comment-", ""));
    if (Number.isNaN(id)) return;

    const timeout = setTimeout(() => {
      const el = document.getElementById(`comment-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedCommentId(id);
        setTimeout(() => setHighlightedCommentId(null), 3000);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [commentsQuery.data]);

  const comments = useMemo(() => {
    const list = [...(commentsQuery.data?.data ?? [])];
    if (list.length < 2) return list;

    const byDate = (a: Comment, b: Comment) =>
      new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime();

    return sort === "newest" ? list.sort(byDate) : list.sort((a, b) => byDate(b, a));
  }, [commentsQuery.data, sort]);

  function toggleReaction(commentId: number) {
    if (currentUserId == null || reactingCommentId != null) return;
    const input: UpsertReactionInput = { commentId, currentUserId };
    setReactingCommentId(commentId);
    void reactionMutation.mutate(input, {
      onSettled: () => setReactingCommentId(null)
    });
  }

  return (
    <Box w="full">
      {user && (
        <CommentForm
          submitLabel="Comentar"
          isSubmitting={createCommentMutation.isPending}
          onSubmit={async payload => {
            try {
              await createCommentMutation.mutateAsync({
                text: payload.text,
                spot: Number(spotId),
                images: payload.images
              });
              toast({ title: "Comentário enviado", status: "success" });
            } catch {
              toast({ title: "Não foi possível enviar o comentário. Tente novamente.", status: "error" });
            }
          }}
        />
      )}

      {commentsQuery.isLoading && (
        <Flex justify="center" py={8}>
          <Spinner />
        </Flex>
      )}

      {!commentsQuery.isLoading && comments.length === 0 && (
        <Muted size="sm">Nenhum comentário ainda. Seja o primeiro.</Muted>
      )}

      {comments.length > 0 && (
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="sm" color={textSecondary}>
            {comments.length} comentário{comments.length === 1 ? "" : "s"}
          </Text>
          <Flex gap={2}>
            <Button
              size="xs"
              variant={sort === "newest" ? "solid" : "ghost"}
              colorScheme={sort === "newest" ? "green" : "gray"}
              onClick={() => setSort("newest")}
            >
              Mais recentes
            </Button>
            <Button
              size="xs"
              variant={sort === "oldest" ? "solid" : "ghost"}
              colorScheme={sort === "oldest" ? "green" : "gray"}
              onClick={() => setSort("oldest")}
            >
              Mais antigos
            </Button>
          </Flex>
        </Flex>
      )}

      {comments.map(comment => (
        <Box key={comment.id} borderBottomWidth="1px" py={4} _last={{ borderBottomWidth: 0 }}>
          {editingCommentId === comment.id ? (
            <CommentForm
              submitLabel="Salvar"
              isSubmitting={updateCommentMutation.isPending}
              initialImages={comment.attributes.images?.data ?? []}
              onCancel={() => setEditingCommentId(null)}
              onSubmit={async payload => {
                try {
                  await updateCommentMutation.mutateAsync({
                    commentId: comment.id,
                    input: {
                      text: payload.text,
                      images: payload.images
                    }
                  });
                  setEditingCommentId(null);
                  toast({ title: "Comentário atualizado", status: "success" });
                } catch {
                  toast({ title: "Não foi possível atualizar o comentário. Tente novamente.", status: "error" });
                }
              }}
            />
          ) : (
            <CommentCard
              comment={comment}
              currentUserId={currentUserId}
              isReacting={reactingCommentId === comment.id}
              isHighlighted={highlightedCommentId === comment.id}
              onToggleReaction={toggleReaction}
              onEdit={setEditingCommentId}
              onDelete={setDeletingCommentId}
            />
          )}
        </Box>
      ))}

      <AlertDialog
        isOpen={deletingCommentId !== null}
        leastDestructiveRef={cancelRef}
        onClose={() => setDeletingCommentId(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="lg" shadow="lg">
            <AlertDialogHeader fontWeight="bold">Excluir comentário</AlertDialogHeader>
            <AlertDialogBody>Esta ação não pode ser desfeita.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeletingCommentId(null)}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                isLoading={deleteCommentMutation.isPending}
                onClick={async () => {
                  if (deletingCommentId == null) return;
                  try {
                    await deleteCommentMutation.mutateAsync(deletingCommentId);
                    setDeletingCommentId(null);
                    toast({ title: "Comentário excluído", status: "success" });
                  } catch {
                    toast({ title: "Não foi possível excluir o comentário. Tente novamente.", status: "error" });
                  }
                }}
              >
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
