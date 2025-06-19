import { ping } from "./api";
import { useEventStream } from "./hooks";

function App() {
  const pongStream = useEventStream("pong");

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-200 p-4">
      <div className="flex flex-col items-center gap-6">
        <button
          className="rounded-full px-4 py-2 text-sm font-semibold border-2 cursor-pointer bg-white w-48"
          onClick={ping}
        >
          Ping
        </button>
        <div className="flex flex-col gap-2">
          {pongStream.map((event) => {
            const receivedTs = new Date(event.receivedAt).toISOString();

            return (
              <p key={receivedTs} className="font-semibold">
                {receivedTs} {event.data}
              </p>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default App;
