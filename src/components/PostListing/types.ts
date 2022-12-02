import { User } from "firebase/auth";

export interface comment {
  id: string;
  text: string;
  uid: string;
}

export interface Tag {
  name: string;
}

export interface RegisteredId {
  id: boolean;
}

export interface UserResponse {
  createdAt: string;
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
  likes?: string[];
  comments?: string[];
  bookmarks?: string[];
}

export interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  file: string;
  tags: Tag[];
  readTime: string;
  createdAt: string;
  likes?: string;
  comments?: Comment[];
  commentCount?: string;
  bookmarkCount?: string;
}

export interface PostResponse {
  id: string;
  author: UserResponse;
  title: string;
  content: string;
  file: string;
  tags: Tag[];
  readTime: string;
  createdAt: string;
  likes?: string;
  comments?: Comment[];
  commentCount?: string;
  bookmarkCount?: string;
}

export interface PostForm {
  file: File;
  title: string;
  tags: Tag[];
  content: string;
}

export interface PostFormRequest {
  file: string;
  title: string;
  tags: Tag[];
  content: string;
  author: string;
}
