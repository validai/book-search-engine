export interface User {
  _id: string;
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
