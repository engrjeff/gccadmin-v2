export function Footer() {
  return (
    <footer className="border-t p-4 mt-auto space-y-6">
      <p className="text-sm text-muted-foreground">
        GCC Admin &copy; {new Date().getFullYear()}
      </p>

      <div className="text-sm text-muted-foreground">
        <p>Got questions?</p>
        <p>
          Contact the developer @{" "}
          <a
            href="mailto:gccsystemph@gmail.com"
            className="text-foreground font-semibold"
          >
            gccsystemph@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
