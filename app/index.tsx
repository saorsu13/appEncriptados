import { Redirect } from "expo-router";
import { useAuth } from "@/context/auth";

export default function TabOneScreen() {
  const { isLoggedIn, isLoading, getSignInRoute } = useAuth();

  if (isLoading) {
    //return null;
  }

  return <Redirect href={"/home"} />;
}
