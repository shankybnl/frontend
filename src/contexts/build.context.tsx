import React from "react";
import { Build } from "../types";
import { buildsService } from "../services";

interface IRequestAction {
  type: "request";
  payload?: undefined;
}

interface IGetAction {
  type: "get";
  payload: Build[];
}

interface ISelectAction {
  type: "select";
  payload: string;
}

interface IDeleteAction {
  type: "delete";
  payload: string;
}

interface IAddAction {
  type: "add";
  payload: Build;
}

interface IUpdateAction {
  type: "update";
  payload: Build;
}

type IAction =
  | IRequestAction
  | IGetAction
  | IDeleteAction
  | IAddAction
  | IUpdateAction
  | ISelectAction;

type Dispatch = (action: IAction) => void;
type State = {
  selectedBuildId: string | undefined;
  buildList: Build[];
  loading: boolean;
};

type BuildProviderProps = { children: React.ReactNode };

const BuildStateContext = React.createContext<State | undefined>(undefined);
const BuildDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
);

const initialState: State = {
  selectedBuildId: undefined,
  buildList: [],
  loading: false,
};

function buildReducer(state: State, action: IAction): State {
  switch (action.type) {
    case "select":
      return {
        ...state,
        selectedBuildId: action.payload,
      };
    case "request":
      return {
        ...state,
        loading: true,
      };
    case "get":
      return {
        ...state,
        buildList: action.payload,
        loading: false,
      };
    case "delete":
      return {
        ...state,
        buildList: state.buildList.filter((p) => p.id !== action.payload),
      };
    case "add":
      return {
        ...state,
        buildList: [action.payload, ...state.buildList],
      };
    case "update":
      return {
        ...state,
        buildList: state.buildList.map((p) => {
          if (p.id === action.payload.id) {
            return action.payload;
          }
          return p;
        }),
      };
    default:
      return state;
  }
}

function BuildProvider({ children }: BuildProviderProps) {
  const [state, dispatch] = React.useReducer(buildReducer, initialState);

  return (
    <BuildStateContext.Provider value={state}>
      <BuildDispatchContext.Provider value={dispatch}>
        {children}
      </BuildDispatchContext.Provider>
    </BuildStateContext.Provider>
  );
}

function useBuildState() {
  const context = React.useContext(BuildStateContext);
  if (context === undefined) {
    throw new Error("must be used within a BuildProvider");
  }
  return context;
}

function useBuildDispatch() {
  const context = React.useContext(BuildDispatchContext);
  if (context === undefined) {
    throw new Error("must be used within a BuildProvider");
  }
  return context;
}

async function getBuildList(dispatch: Dispatch, id: string) {
  dispatch({ type: "request" });

  return buildsService.getList(id).then((items) => {
    dispatch({ type: "get", payload: items });
  });
}

async function deleteBuild(dispatch: Dispatch, id: string) {
  return buildsService.remove(id).then((build) => {
    dispatch({ type: "delete", payload: id });
    return build;
  });
}

async function stopBuild(dispatch: Dispatch, id: string) {
  return buildsService.stop(id).then((build) => {
    dispatch({ type: "update", payload: build });
    return build;
  });
}

async function selectBuild(dispatch: Dispatch, id: string) {
  dispatch({ type: "select", payload: id });
}

async function addBuild(dispatch: Dispatch, build: Build) {
  dispatch({ type: "add", payload: build });
}

async function updateBuild(dispatch: Dispatch, build: Build) {
  dispatch({ type: "update", payload: build });
}

export {
  BuildProvider,
  useBuildState,
  useBuildDispatch,
  getBuildList,
  deleteBuild,
  selectBuild,
  addBuild,
  updateBuild,
  stopBuild,
};
