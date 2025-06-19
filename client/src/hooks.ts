import { useEffect, useState } from "react";
import { socket } from "./socket";

type ReceivedEvent = {
  data: string;
  receivedAt: Date;
};

/**
 * Convenient hook for subscribing to a particular event stream
 *
 * @param {String} eventName - The name of the event to subscribe to.
 *
 * @returns {ReceivedEvent[]} - Event stream
 */
export const useEventStream = (eventName: string) => {
  const [events, setEvents] = useState<ReceivedEvent[]>([]);

  useEffect(() => {
    const handleEvent = (value: string) => {
      setEvents((previous) => [
        ...previous,
        { data: value, receivedAt: new Date() },
      ]);
    };

    socket.on(eventName, handleEvent);

    return () => {
      socket.off(eventName, handleEvent);
    };
  }, [eventName]);

  return events;
};
