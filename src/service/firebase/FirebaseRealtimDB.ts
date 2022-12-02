import type { Attempt, AttemptEntry, Attempts, Run } from "./domain";
import { child, get, push, remove, set, update } from "firebase/database";
import {
  getAttemptRef,
  getLeaderboardRef,
  getPostBookmarksIdRef,
  getPostBookmarksRef,
  getPostIdRef,
  getPostLikesIdRef,
  getPostLikesRef,
  getPostsRef,
  getUserBookmarksIdRef,
  getUserBookmarksRef,
  getUserLikesIdRef,
  getUserLikesRef,
  getUserPostsRef,
  getUserRef,
} from "./databaseRefs";

import { Logger } from "../logger";
import { User } from "firebase/auth";
import {
  Post,
  PostFormRequest,
  PostResponse,
  UserResponse,
} from "../../components/PostListing/types";
import { auth } from "./FirebaseAuth";
import { createUserIdFromName } from "../../components/PostListing/helpers";

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let currentDate = `${day}-${month}-${year}`;

function readingTime(content: string) {
  const wpm = 225;
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time.toString();
}

const createPostIdFromTitle = (title: string) => {
  return title.split(" ").join("-").toLowerCase();
};

const getAuthorValue = async (author: string) => {
  const authorResponse = await get(getUserRef(author));
  return authorResponse.val();
};

const logger = new Logger("FirebaseRealtimeDB");
class FirebaseRealtimeDB {
  async saveUserToDatabase(userData: User | null) {
    if (userData) {
      logger.trace(`Initializing storage for [user=${userData.uid}]`);

      logger.debug(
        `Attempting to store user in realtime database with [payload=${userData}]`
      );
      const snapshot = await get(getUserRef(userData.uid));
      const user = snapshot.exists();
      const nameId = createUserIdFromName(userData.displayName);
      if (!user) {
        await set(getUserRef(userData.uid), {
          uid: userData.uid,
          nameId,
          displayName: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL,
          createdAt: currentDate,
        });
        logger.info(`Successfully saved user with [uid=${userData.uid}]`);
      } else {
        logger.info(
          `User is already stored in database [user=${userData.uid}]`
        );
      }
    } else {
      logger.trace(`Failed to store user - userData is undefined`);
    }
  }

  async getUserById(uid: string) {
    logger.trace(`Fetch attempt for [user=${uid}]`);

    logger.debug(
      `Attempting to fetch user in realtime database with [payload=${uid}]`
    );

    const snapshot = await get(getUserRef(uid));
    if (snapshot.exists()) {
      logger.info(`Successfully fetched [user=${snapshot.val()}]`);
      return snapshot.val() as UserResponse;
    } else {
      logger.info(`Failed to fetch [user=${uid}]`);
    }
  }

  async publishPost(payload: PostFormRequest) {
    logger.trace(`Publish attempt for [post=${payload.title}]`);

    logger.debug(
      `Attempting to store post in realtime database with [payload=${JSON.stringify(
        payload
      )}]`
    );
    const postId = createPostIdFromTitle(payload.title);
    const user = auth.getUser();
    if (user) {
      const data = {
        ...payload,
        id: postId,
        createdAt: currentDate,
        readTime: readingTime(payload.content),
        author: payload.author,
      };
      await set(getPostIdRef(postId), data);
      logger.info(`Successfully stored post on [id=${postId}]`);
      await update(getUserPostsRef(user.uid), { [postId]: true });
      logger.info(`Successfully registered like`);
    }
  }

  async getAllPosts() {
    logger.trace(`Fetching posts..`);

    logger.debug(`Attempting to fetch all posts in realtime database with`);

    const snapshot = await get(getPostsRef());
    if (snapshot.exists()) {
      const data = snapshot.val() as Post[];
      const entries = Object.entries(data);
      return Promise.all(
        entries.map(async ([key, value]) => ({
          ...value,
          author: await getAuthorValue(value.author).then((result) => result),
          id: key,
        }))
      );
    }
  }

  async getPostById(id: string) {
    logger.trace(`Fetch attempt for [user=${id}]`);

    logger.debug(
      `Attempting to fetch user in realtime database with [payload=${id}]`
    );

    const snapshot = await get(getPostIdRef(id));
    if (snapshot.exists()) {
      logger.info(`Successfully fetched [post=${snapshot.val()}]`);
      const post = snapshot.val();
      const authorResponse = await get(getUserRef(post.author));
      const author = authorResponse.val() as User;
      return { ...post, author };
    } else {
      logger.info(`Failed to fetch [post=${id}]`);
    }
  }

  async registerLikeOrDislike(id: string, uid: string) {
    logger.trace(`Register like for [user=${uid}]`);

    logger.debug(
      `Attempting to register like in realtime database with [payload=${id}]`
    );
    const snapshot = await get(getPostLikesRef(id));
    if (snapshot.exists() && snapshot.hasChild(uid)) {
      await remove(getPostLikesIdRef(id, uid));
      await remove(getUserLikesIdRef(uid, id));
      logger.info(`Successfully removed like`);
    } else {
      await update(getPostLikesRef(id), { [uid]: true });
      await update(getUserLikesRef(uid), { [id]: true });
      logger.info(`Successfully registered like`);
    }
  }

  async getPostLikeCount(id: string) {
    logger.trace(`Fetching like for [post=${id}]`);

    logger.debug(
      `Attempting to fetch like in realtime database with [payload=${id}]`
    );

    const snapshot = await get(getPostLikesRef(id));
    if (snapshot.exists()) {
      logger.info(`Successfully fetched [post=${id}]`);
      return snapshot.size.toString();
    } else {
      logger.info(`Failed to fetch [post=${id}]`);
    }
  }

  async registerBookmarkOrUnmark(id: string, uid: string) {
    logger.trace(`Register bookmark for [user=${uid}]`);

    logger.debug(
      `Attempting to register like in realtime database with [payload=${id}]`
    );
    const snapshot = await get(getPostBookmarksRef(id));
    if (snapshot.exists() && snapshot.hasChild(uid)) {
      await remove(getPostBookmarksIdRef(id, uid));
      await remove(getUserBookmarksIdRef(uid, id));
      logger.info(`Successfully removed bookmark`);
    } else {
      await update(getPostBookmarksRef(id), { [uid]: true });
      await update(getUserBookmarksRef(uid), { [id]: true });
      logger.info(`Successfully registered bookmark`);
    }
  }

  async getBookmarkCount(id: string) {
    logger.trace(`Fetching bookmarks for [post=${id}]`);

    logger.debug(
      `Attempting to fetch bookmarks in realtime database with [payload=${id}]`
    );

    const snapshot = await get(getPostBookmarksRef(id));
    if (snapshot.exists()) {
      logger.info(`Successfully fetched [post=${id}]`);
      return snapshot.size.toString();
    } else {
      logger.info(`Failed to fetch [post=${id}]`);
    }
  }

  async checkIfUserHasBookmarkedPost(id: string, uid: string) {
    logger.trace(`Fetching bookmarks for [post=${id}]`);

    logger.debug(
      `Attempting to fetch bookmarks in realtime database with [payload=${id}]`
    );

    const snapshot = await get(getPostBookmarksIdRef(id, uid));
    if (snapshot.exists()) {
      logger.info(`Post is bookmarked for [user=${uid}]`);
      return true;
    } else {
      logger.info(`Post is not bookmarked for [user=${uid}]`);
      return false;
    }
  }

  async checkIfUserHasLikedPost(id: string, uid: string) {
    logger.trace(`Fetching bookmarks for [post=${id}]`);

    logger.debug(
      `Attempting to fetch bookmarks in realtime database with [payload=${id}]`
    );

    const snapshot = await get(getPostLikesIdRef(id, uid));
    if (snapshot.exists()) {
      logger.info(`Post is liked for [user=${uid}]`);
      return true;
    } else {
      logger.info(`Post is not liked for [user=${uid}]`);
      return false;
    }
  }

  async registerAttempt(payload: Attempt) {
    logger.trace(`Registering attempt for [user=${payload.username}]`);

    logger.debug(
      `Attempting to store attempt in realtime database with [payload=${JSON.stringify(
        payload
      )}]`
    );

    const { key } = await push(getAttemptRef(), payload);
    logger.info(`Successfully stored attempt on [key=${key}]`);
  }

  async getAttempts(): Promise<Array<AttemptEntry>> {
    logger.trace("Retrieving attempts for today");

    const snapshot = await get(getAttemptRef());

    if (snapshot.exists()) {
      const data = snapshot.val() as Attempts;
      const entries = Object.entries(data);
      return entries.map(([key, value]) => ({
        key,
        ...value,
      }));
    }

    logger.warn(
      `Unable to read attempts database, most likely because there are no attempts at the moment`
    );
    throw new Error("Unable to read attempts database");
  }

  async registerRun(run: Run): Promise<void> {
    const { key, ...data } = run;
    logger.trace(`Registering run for [key=${run.key}]`);

    try {
      logger.debug(`Writing to leaderboard for attempt [key=${key}]`);
      const leaderboardEntry = await push(getLeaderboardRef(), data);
      logger.info(
        `Successfully registered run with [key=${leaderboardEntry.key}]`
      );

      logger.debug(`Deleting attempt entry for [key=${key}]`);
      const ref = child(getAttemptRef(), `/${key}`);
      await remove(ref);
      logger.info(`Successfully cleaned up attempt entry [key=${key}]`);
    } catch (err) {
      logger.error(`Failed to register run due to [err=${err}]`);
      throw new Error("Failed to register run");
    }
  }
}

export const database = new FirebaseRealtimeDB();
