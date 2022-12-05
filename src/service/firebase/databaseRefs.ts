import {
  DatabaseReference,
  child,
  getDatabase,
  ref,
  QueryConstraint,
} from "firebase/database";

import { Firebase } from "./Firebase";

const today = new Date().toISOString().split("T")[0];
const db = getDatabase(Firebase);

export function getDatabaseRoot(): DatabaseReference {
  return ref(db);
}

export function getAllUsersRef(): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/users`);
}

export function getUserRef(uid: string): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/users/${uid}`);
}

export function getUserLikesRef(uid: string): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/users/${uid}/likes`);
}

export function getUserLikesIdRef(uid: string, id: string): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/users/${uid}/likes/${id}`);
}

export function getUserPostsRef(uid: string): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/users/${uid}/posts`);
}

export function getUserBookmarksIdRef(
  uid: string,
  id: string
): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/users/${uid}/bookmarks/${id}`);
}

export function getUserFollowersRef(uid: string): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/users/${uid}/followers`);
}

export function getUserFollowingRef(uid: string): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/users/${uid}/following`);
}

export function getPostsRef(): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/posts`);
}

export function getPostIdRef(id: string): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/posts/${id}`);
}

export function getPostLikesRef(id: string): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/posts/${id}/likes`);
}

export function getPostLikesIdRef(id: string, uid: string): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/posts/${id}/likes/${uid}`);
}

export function getPostBookmarksRef(id: string): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/posts/${id}/bookmarks`);
}

export function getPostBookmarksIdRef(
  id: string,
  uid: string
): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/posts/${id}/bookmarks/${uid}`);
}

export function getUserBookmarksRef(uid: string): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/users/${uid}/bookmarks`);
}

export function getLeaderboardRef(): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/${today}/leaderboard`);
}

export function getAttemptRef(): DatabaseReference {
  const root = getDatabaseRoot();
  return child(root, `/${today}/attempts`);
}
