export type Attempt = {
  username: string;
  start: number;
  finish: number;
};

export type Attempts = {
  [key: string]: Attempt;
};

export type AttemptEntry = {
  key: string;
} & Attempt;

export type Run = {
  key: string;
  name: string;
  phonenumber: string;
  email: string;
  consent: boolean;
} & Attempt;
