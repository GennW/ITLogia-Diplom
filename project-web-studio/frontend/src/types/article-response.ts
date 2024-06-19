import { ArticleType } from "./top-articles.type";

export type ArticleResponseType = {
    count: number,
    pages: number,
    items: ArticleType[];
  }