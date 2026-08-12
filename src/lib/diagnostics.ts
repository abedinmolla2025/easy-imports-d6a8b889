import { supabase } from "@/integrations/supabase/client";

/**
 * Log a client-side error to Supabase for debugging.
 */
export async function logAppError(error: Error | string, metadata: Record<string, any> = {}) {
  const message = typeof error === "string" ? error : error.message;
  const stack = typeof error === "string" ? "" : error.stack;
  
  console.error("App Error:", message, metadata);

  try {
    // Best effort logging
    await supabase.from("app_logs" as any).insert({
      level: "error",
      message,
      metadata: {
        ...metadata,
        stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (e) {
    // Silent fail to prevent loops
  }
}

/**
 * Check for common issues like localStorage corruption or SW state.
 */
export function runDiagnostics() {
  const results = {
    userAgent: navigator.userAgent,
    localStorageSize: Object.keys(localStorage).length,
    hasServiceWorker: 'serviceWorker' in navigator,
    swState: 'unknown',
    url: window.location.href,
  };

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      results.swState = reg ? (reg.active ? 'active' : 'installed') : 'none';
    });
  }

  return results;
}
