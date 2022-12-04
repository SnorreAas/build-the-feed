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
  nameId: string;
  posts?: PostResponse[];
  postCount?: string;
  likes?: string[];
  likeCount?: string;
  comments?: string[];
  commentCount?: string;
  bookmarks?: string[];
  bookmarkCount?: string;
  bio?: string;
  followers?: string;
  followerCount?: string;
  following?: string;
  followingCount?: string;
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
  likeCount: string;
  comments?: Comment[];
  commentCount: string;
  bookmarks?: string[];
  bookmarkCount: string;
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
  likeCount: string;
  comments?: Comment[];
  commentCount: string;
  bookmarks?: string[];
  bookmarkCount: string;
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
