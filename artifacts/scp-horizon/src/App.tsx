import { useEffect, useRef } from 'react';
import { Switch, Route, Router as WouterRouter } from "wouter";
import MainMenu from "./pages/MainMenu";
import GameView from "./pages/GameView";
import EventLog from "./pages/EventLog";
import Journal from "./pages/Journal";
import Dossier from "./pages/Dossier";
import Statistics from "./pages/Statistics";
import Saves from "./pages/Saves";
import Settings from "./pages/Settings";
import Endings from "./pages/Endings";
import { useGameStore } from "./store/gameStore";
import { soundManager, musicEngine } from "./audio";

function Scanlines() {
  const scanlines = useGameStore(s => s.settings.scanlineEffect);
  if (!scanlines) return null;
  return <div className="scanlines pointer-events-none" />;
}

function AudioManager() {
  const settings = useGameStore(s => s.settings);
  const musicStarted = useRef(false);

  // Sync SFX settings to sound manager whenever they change
  useEffect(() => {
    soundManager.setSettings(settings.sfxEnabled, settings.sfxVolume);
  }, [settings.sfxEnabled, settings.sfxVolume]);

  // Sync music settings to music engine whenever they change
  useEffect(() => {
    musicEngine.setSettings(settings.musicEnabled, settings.musicVolume);
  }, [settings.musicEnabled, settings.musicVolume]);

  // Start music on first user interaction (browser autoplay policy)
  useEffect(() => {
    const startMusic = () => {
      if (!musicStarted.current && settings.musicEnabled) {
        musicStarted.current = true;
        musicEngine.start();
      }
    };
    window.addEventListener('click', startMusic, { once: true });
    window.addEventListener('keydown', startMusic, { once: true });
    return () => {
      window.removeEventListener('click', startMusic);
      window.removeEventListener('keydown', startMusic);
    };
  }, [settings.musicEnabled]);

  // Pause music when the tab is hidden; resume when it returns.
  // The typewriter hook handles its own pause via usePageVisibility.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        musicEngine.suspendForTab();
      } else {
        musicEngine.resumeFromTab();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return null;
}

function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground font-mono antialiased relative">
      <Scanlines />
      <AudioManager />
      <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
        <Switch>
          <Route path="/" component={MainMenu} />
          <Route path="/game" component={GameView} />
          <Route path="/log" component={EventLog} />
          <Route path="/journal" component={Journal} />
          <Route path="/dossier" component={Dossier} />
          <Route path="/statistics" component={Statistics} />
          <Route path="/saves" component={Saves} />
          <Route path="/settings" component={Settings} />
          <Route path="/endings" component={Endings} />
          <Route>
            <div className="min-h-screen flex items-center justify-center text-destructive p-8 text-center font-mono">
              <div>
                <div className="text-2xl mb-4 tracking-widest">[ ERROR 404 ]</div>
                <div className="text-sm text-muted-foreground mb-6">ROUTE NOT FOUND — RECORD DOES NOT EXIST</div>
                <a href="/" className="text-primary hover:underline tracking-widest">&gt; RETURN TO MAIN MENU</a>
              </div>
            </div>
          </Route>
        </Switch>
      </WouterRouter>
    </div>
  );
}

export default App;
