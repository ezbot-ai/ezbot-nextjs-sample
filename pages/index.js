"use strict";
"use client";
import {
  initEzbot,
  startActivityTracking,
  trackPageView,
  trackRewardEvent,
  makeVisualChanges,
} from "@ezbot-ai/javascript-sdk";
import {createContext, useContext, useState, useEffect, useRef} from "react";
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const defaultState = {
  predictions: null,
};

const EzbotContext = createContext(defaultState)

export default function Home() {
  const ezbotInit = useRef(false);
  const [currentEzbot, setCurrentEzbot] = useState(null);

  useEffect(() => {
    async function ezbotInitFn() {
      if (ezbotInit.current) {
        return;
      }
      try {
        await initEzbot(0); // Replace 0 with your project ID
        startActivityTracking({
          minimumVisitLength: 2,
          heartbeatDelay: 2,
        });
        trackPageView();
        makeVisualChanges();
        ezbotInit.current = true;
        setCurrentEzbot({predictions: window.ezbot.predictions})
        console.log("Ezbot initialized successfully");
      } catch (error) {
        console.error("Error initializing Ezbot:", error);
      }
    }
    ezbotInitFn();
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <EzbotContext.Provider value={{currentEzbot, setCurrentEzbot}}>
        <EzbotTestComponent></EzbotTestComponent>
        </EzbotContext.Provider>
      </main>
    </div>
  );
};

export function EzbotTestComponent() {
  const currentEzbot = useContext(EzbotContext);

  if (currentEzbot !== null) {
    return <p>Predictions: {currentEzbot.predictions}.</p>;
  }

  return <p>No Predictions.</p>;
}