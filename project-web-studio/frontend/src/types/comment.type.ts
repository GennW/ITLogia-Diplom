export type CommentType = {
  allCount: number;
  comments: {
      id: string;
      text: string;
      date: string;
      likesCount: number;
      dislikesCount: number;
      user: {
          id: string;
          name: string;
      };
      reaction: 'like' | 'dislike' | null; // Добавляем свойство reaction для хранения реакции пользователя
      reactedBy: string | null; // Добавляем новое свойство для идентификации пользователя, который реагировал на комментарий
  }[];
}

