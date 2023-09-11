// https://hhpendleton.medium.com/useauth-265512bbde3c

import React, {
  useState,
  useContext,
  createContext,
  SetStateAction,
  Dispatch,
} from "react";
import { login, logout, signup_api, getUser } from "./api";

const AuthContext = createContext<useProvideAuth>(undefined!);

export function AuthProvider(props: any) {
  const value = useProvideAuth();

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

interface useProvideAuth {
  user: {
    password: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    children: Array<any>;
    notification_tokens: Array<any>;
  } | null;
  signin: ({ password, email }: { password: string; email: string }) => void;
  signup: ({
    password,
    email,
    phone,
    first_name,
    last_name,
  }: {
    password: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
  }) => void;
  signout: ({ expoPushToken }: { expoPushToken: any }) => void;
  isUser: () => void;
  isLoading: boolean;
  signupError: any;
  setSignupError: Dispatch<SetStateAction<string[]>>;
  signinError: any;
  setSigninError: Dispatch<SetStateAction<string[]>>;
  addChild_auth: ({
    first_name,
    last_name,
    age,
    helmet_id,
  }: {
    first_name: string;
    last_name: string;
    age: number;
    helmet_id: string;
  }) => void;
}

function useProvideAuth(): useProvideAuth {
  const [user, setUser] = useState<useProvideAuth["user"] | null>(null);

  const [signinError, setSigninError] = useState<Array<string>>([]);
  const [signupError, setSignupError] = useState<Array<string>>([]);

  const [isLoading, setIsLoading] = useState(false);

  async function isUser() {
    setIsLoading(true);

    let { data } = await getUser();
    setIsLoading(false);

    setUser(data.user);
  }

  function addChild_auth({
    first_name,
    last_name,
    age,
    helmet_id,
  }: {
    first_name: string;
    last_name: string;
    age: number;
    helmet_id: string;
  }) {
    setUser((prev: useProvideAuth["user"]) => {
      let newUser = prev;
      newUser?.children.push({
        first_name,
        last_name,
        age,
        helmet_id,
      });
      return newUser;
    });
  }

  function signin({ password, email }: { password: string; email: string }) {
    setIsLoading(true);

    if (!email) {
      setIsLoading(false);
      return setSigninError(["An email must be provided"]);
    }

    if (!password) {
      setIsLoading(false);
      return setSigninError(["A password must be provided"]);
    }

    login({ email, password }).then(({ data }: { data: any }) => {
      setIsLoading(false);

      if (!data.error) setUser(data);
      else setSigninError([data.message]);
    });
  }

  function signup({
    password,
    email,
    phone,
    first_name,
    last_name,
  }: {
    password: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
  }) {
    setSignupError([]);
    setIsLoading(true);

    if (!password) {
      setIsLoading(false);
      return setSignupError(["A password must be provided"]);
    }

    if (!email) {
      setIsLoading(false);
      return setSignupError(["An email must be provided"]);
    }

    if (!phone) {
      setIsLoading(false);
      return setSignupError(["A phone number must be provided"]);
    }

    if (!first_name) {
      setIsLoading(false);
      return setSignupError(["A first name must be provided"]);
    }

    if (!last_name) {
      setIsLoading(false);
      return setSignupError(["A last name must be provided"]);
    }

    signup_api({
      password,
      email,
      phone,
      first_name,
      last_name,
    }).then(({ data }: { data: any }) => {
      setIsLoading(false);
      if (!data.error) setUser(data);
      else setSignupError([data.message]);
    });
  }

  function signout({ expoPushToken }: { expoPushToken: any }) {
    // Remove devices push token when they log out
    logout({ expoPushToken }).then(({ data }: { data: any }) => {
      if (data.succuss) setUser(null);
    });
  }

  return {
    isUser,
    user,
    signin,
    signup,
    signout,
    isLoading,
    signupError,
    setSignupError,
    signinError,
    setSigninError,
    addChild_auth,
  };
}
