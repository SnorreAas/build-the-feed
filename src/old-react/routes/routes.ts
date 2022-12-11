import { Article } from "./Article";
import { NewArticle } from "./auth/NewArticle";
import { Home } from "../../pages";
import { Profile } from "./Profile";

interface RouteType {
  path: string;
  component: any;
  name: string;
  protected: boolean;
}

export enum Paths {
  FOUR_O_FOUR = "*",
  HOME = "/",
  ARTICLE = "/:user/:slug",
  LOGIN = "/login",
  PROFILE = "/:user",
  NEW = "/new",
}

const routes: RouteType[] = [
  {
    path: `${Paths.FOUR_O_FOUR}`,
    component: Home,
    name: "404",
    protected: false,
  },
  {
    path: "",
    component: Home,
    name: Paths.HOME,
    protected: false,
  },
  {
    path: `${Paths.ARTICLE}`,
    component: Article,
    name: "Article",
    protected: false,
  },
  {
    path: Paths.LOGIN,
    component: Home,
    name: "Login",
    protected: false,
  },
  {
    path: `${Paths.PROFILE}`,
    component: Profile,
    name: "Profile",
    protected: false,
  },
  {
    path: `${Paths.NEW}`,
    component: NewArticle,
    name: "NewArticle",
    protected: true,
  },
];

export default routes;
