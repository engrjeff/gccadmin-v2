export function Footer() {
  return (
    <footer className="mt-auto space-y-6 border-t p-4">
      <p className="text-muted-foreground text-sm">
        GCC Admin &copy; {new Date().getFullYear()}
      </p>

      <div className="text-muted-foreground text-sm">
        <p>Got questions?</p>
        <p>
          Contact the developer:{" "}
          <a
            href="mailto:gccsystemph@gmail.com"
            className="font-semibold text-foreground"
          >
            gccsystemph@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
