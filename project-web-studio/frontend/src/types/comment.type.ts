import { ActionType } from "./action.type";

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
      isLikedByUser: boolean; // Параметр для отслеживания реакции лайка
      isDislikedByUser: boolean; // Параметр для отслеживания реакции дизлайка
      isAction?: boolean;
      reaction: ActionType; // Добавляем свойство reaction для хранения реакции пользователя
      reactedBy: string | null; // Добавляем новое свойство для идентификации пользователя, который реагировал на комментарий
  }[];
}

