import {
  Auth,
  User,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { Firebase } from "./Firebase";
import { FirebaseApp } from "firebase/app";
import { Logger } from "../logger";
import { database } from "./FirebaseRealtimDB";

const logger = new Logger("FirebaseAuth");

class FirebaseAuth {
  private auth: Auth;
  private user: User | null = null;
  private google: GoogleAuthProvider;

  private subscribers: Array<(user: User | null) => void> = [];

  constructor(firebase: FirebaseApp) {
    this.auth = getAuth(firebase);
    this.google = new GoogleAuthProvider();
    this.auth.onAuthStateChanged((user: User | null) =>
      this.onAuthStateChange(user)
    );
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  async signInWithGoogle(): Promise<User> {
    logger.trace(`Attempting to sign in [googleId=${this.google.providerId}]`);

    try {
      const credentials = await signInWithPopup(this.auth, this.google);
      database.saveUserToDatabase(credentials.user);
      logger.debug(`Successfully authenticated [uid=${credentials.user.uid}]`);
      return credentials.user;
    } catch (err) {
      logger.error(`Failed to authenticate user due to [err=${err}]`);
      throw new Error("Failed to authenticate user");
    }
  }

  async signOut(): Promise<void> {
    logger.trace(`Attempting to sign out [user=${this.user?.uid}]`);
    return this.auth.signOut();
  }

  getUser(): User | null {
    return this.user ?? null;
  }

  subscribe(callback: (user: User | null) => void): void {
    this.subscribers.push(callback);
    callback(this.user);
  }

  unsubscribe(callback: (user: User | null) => void): void {
    this.subscribers = this.subscribers.filter(
      (subscription) => subscription !== callback
    );
  }

  private onAuthStateChange(user: User | null): void {
    logger.debug(
      `Auth state change handler was invoked with [user=${user?.uid}]`
    );
    this.notifySubscribers(user);
    this.user = user;
  }

  private notifySubscribers(user: User | null) {
    this.subscribers.forEach((callback) => callback(user));
  }
}

export const auth = new FirebaseAuth(Firebase);
