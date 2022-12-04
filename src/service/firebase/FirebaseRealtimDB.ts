import type { Attempt, AttemptEntry, Attempts, Run } from "./domain";
import { child, get, push, remove, set, update } from "firebase/database";
import {
  getAllUsersRef,
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
  getUserFollowersRef,
  getUserFollowingRef,
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
} from "../../components/types";
import { auth } from "./FirebaseAuth";
import { createUserIdFromName } from "../../components/PostListing/helpers";
import {
  createPostIdFromTitle,
  getCurrentDate,
  getReadingTime,
  upgradeImageQuality,
} from "./helpers";

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
      const highQualityPhotoURL = upgradeImageQuality(userData.photoURL);
      if (!user) {
        await set(getUserRef(userData.uid), {
          uid: userData.uid,
          nameId,
          displayName: userData.displayName,
          email: userData.email,
          photoURL: highQualityPhotoURL,
          createdAt: getCurrentDate(),
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

  async getUserByNameId(nameId: string) {
    logger.trace(`Fetching user..`);

    logger.debug(
      `Attempting to fetch user in realtime database with [nameId=${nameId}]`
    );

    const snapshot = await get(getAllUsersRef());
    if (snapshot.exists()) {
      const data = snapshot.val() as UserResponse[];
      const filteredUser = Object.fromEntries(
        Object.entries(data).filter(([key, values]) => values.nameId === nameId)
      );
      const profile = Object.values(filteredUser);
      let posts: PostResponse[] = [];
      if (profile && profile[0].posts) {
        const postIds = Object.keys(profile[0].posts);
        const postArray = postIds.map(
          async (id) => await database.getPostById(id).then((result) => result)
        );
        posts = await Promise.all(postArray);
      }
      const postCount = !!profile[0].posts
        ? Object.keys(profile[0].posts).length.toString()
        : "0";
      const commentCount = !!profile[0].comments
        ? Object.keys(profile[0].comments).length.toString()
        : "0";
      const followerCount = !!profile[0].followers
        ? Object.keys(profile[0].followers).length.toString()
        : "0";
      return { ...profile[0], postCount, commentCount, followerCount, posts };
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
        createdAt: getCurrentDate(),
        readTime: getReadingTime(payload.content),
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
          commentCount: value.comments
            ? Object.keys(value.comments).length.toString()
            : "0",
          likeCount: value.likes
            ? Object.keys(value.likes).length.toString()
            : "0",
          bookmarkCount: value.bookmarks
            ? Object.keys(value.bookmarks).length.toString()
            : "0",
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
      return {
        ...post,
        author,
        commentCount: post.comments
          ? Object.keys(post.comments).length.toString()
          : "0",
        likeCount: post.likes ? Object.keys(post.likes).length.toString() : "0",
        bookmarkCount: post.bookmarks
          ? Object.keys(post.bookmarks).length.toString()
          : "0",
      };
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

  async registerFollowOrUnFollow(loggedInUser: string, userToFollow: string) {
    logger.trace(`Register follow for [user=${userToFollow}]`);

    logger.debug(
      `Attempting to register follow in realtime database with [payload=${userToFollow}]`
    );
    const snapshot = await get(getUserFollowingRef(loggedInUser));
    if (snapshot.exists() && snapshot.hasChild(userToFollow)) {
      await remove(getUserFollowingRef(loggedInUser));
      await remove(getUserFollowersRef(userToFollow));
      logger.info(`Successfully removed follow`);
    } else {
      await update(getUserFollowingRef(loggedInUser), { [userToFollow]: true });
      await update(getUserFollowersRef(userToFollow), { [loggedInUser]: true });
      logger.info(`Successfully registered follow`);
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

  async getUserFollowerCount(uid: string) {
    logger.trace(`Fetching like for [post=${uid}]`);

    logger.debug(
      `Attempting to fetch like in realtime database with [payload=${uid}]`
    );

    const snapshot = await get(getUserFollowersRef(uid));
    if (snapshot.exists()) {
      logger.info(`Successfully fetched [post=${uid}]`);
      return snapshot.size.toString();
    } else {
      logger.info(`Failed to fetch [post=${uid}]`);
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

  async checkIfUserHasFollowed(loggedInUser: string, userToFollow: string) {
    logger.trace(`Fetching followers for [user=${userToFollow}]`);

    logger.debug(
      `Attempting to fetch followers in realtime database with [payload=${userToFollow}]`
    );

    const snapshot = await get(getUserFollowingRef(loggedInUser));
    if (snapshot.exists() && snapshot.hasChild(userToFollow)) {
      logger.info(`Profile is followed by [user=${loggedInUser}]`);
      return true;
    } else {
      logger.info(`Profile is not followed by [user=${loggedInUser}]`);
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
