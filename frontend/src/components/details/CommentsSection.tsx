import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
}

interface CommentsSectionProps {
  contentId: string;
  contentType: 'movie' | 'tvshow';
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ contentId, contentType }) => {
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ['comments', contentType, contentId],
    queryFn: () => apiClient.get(`/comments/${contentType}/${contentId}`).then(res => res),
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => {
      return apiClient.post('/comments', {
        content,
        [contentType === 'movie' ? 'movieId' : 'tvShowId']: contentId,
      });
    },
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', contentType, contentId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-white mb-6">Comments</h3>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="bg-white/5 border-white/10 text-white mb-2"
        />
        <Button 
          type="submit" 
          disabled={!newComment.trim() || addCommentMutation.isPending}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>

      <div className="space-y-6">
        {isLoading ? (
          <p className="text-gray-400">Loading comments...</p>
        ) : comments?.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments?.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{comment.username}</span>
                  <span className="text-xs text-gray-400">
                    {comment.createdAt && !isNaN(new Date(comment.createdAt).getTime()) 
                      ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                      : 'Just now'}
                  </span>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
