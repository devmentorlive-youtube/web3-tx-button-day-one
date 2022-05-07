export default function Buttton({
  children,
  onClick = () => {},
  busy = false,
}) {
  return (
    <button
      disabled={busy}
      onClick={onClick}
      className={`border-[1px] border-pink-700 bg-pink-600 py-2 px-8  rounded-2xl ${
        busy ? "cursor-not-allowed opacity-80" : ""
      }`}>
      {busy ? <Spinner /> : children}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      class="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
