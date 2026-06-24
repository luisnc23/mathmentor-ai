import { useState } from "react";
import LandingScreen from "./screens/LandingScreen";
import AppScreen from "./screens/AppScreen";

export default function App() {
  const [screen, setScreen] = useState("landing");

  return screen === "landing" ? (
    <LandingScreen onStart={() => setScreen("app")} />
  ) : (
    <AppScreen onBack={() => setScreen("landing")} />
  );
}
