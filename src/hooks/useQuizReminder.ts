import { useEffect } from "react";
import { useQuizProgress } from "@/hooks/useQuizProgress";

interface QuizReminderSettings {
  enabled: boolean;
  reminderTime: string;
}

export const useQuizReminder = () => {
  const { hasPlayedToday } = useQuizProgress();

  useEffect(() => {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.log("Browser doesn't support notifications");
      return;
    }

    // Load settings
    const settingsStr = localStorage.getItem("quizReminderSettings");
    if (!settingsStr) return;

    let settings: QuizReminderSettings;
    try {
      settings = JSON.parse(settingsStr);
    } catch (e) {
      console.error("Failed to parse quiz reminder settings", e);
      return;
    }
    
    if (!settings || !settings.enabled) return;

    // Check every minute if it's time to send reminder
    const checkReminder = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      // If it's the reminder time and user hasn't played today
      if (currentTime === settings.reminderTime && !hasPlayedToday()) {
        // Check if we already sent a reminder today
        const lastReminderDate = localStorage.getItem("lastQuizReminderDate");
        const today = new Date().toDateString();

        if (lastReminderDate !== today && Notification.permission === "granted") {
          // Send notification
          new Notification("🎯 Daily Quiz Reminder", {
            body: "আজকের কুইজ এখনও খেলা হয়নি! আপনার স্ট্রিক বজায় রাখুন 🔥",
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: "quiz-reminder",
            requireInteraction: false,
            silent: false,
          });

          // Mark that we sent a reminder today
          localStorage.setItem("lastQuizReminderDate", today);
        }
      }
    };

    // Check immediately
    checkReminder();

    // Then check every minute
    const interval = setInterval(checkReminder, 60000);

    return () => clearInterval(interval);
  }, [hasPlayedToday]);
};
