import { RoutesCore } from "../types/routes.types";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RoutesCore { }
  }
}
