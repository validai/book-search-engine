export interface User {
  _id?: string; // Make it optional
  username: string;
  email: string;
  password: string;
  savedBooks?: {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
  }[];
}
