export interface Post {
  id: number;
  title: string;
  image: string[];
  description: string;
  category: string;
  author: string;
  date: string;
  tags: string[],
  content: {
    intro: string;
    tips?: string[];
    body: string;
    head: string;
    conclusion: string;
  };
}
