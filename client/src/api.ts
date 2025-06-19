/**
 * Pings the API
 */
export const ping = async () => {
  try {
    const response = await fetch("/api/ping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "ping" }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error("Ping failed with error: ", error);
  }
};
