import { TopArticleType } from "./top-articles.type";

export type ArticleResponseType = {
    count: number,
    pages: number,
    items: TopArticleType[];
  }