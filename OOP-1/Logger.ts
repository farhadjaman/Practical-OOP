// Abstraction
interface LogTransport {
  log(message: string): void;
}

// Concrete Implementations
class ConsoleTransport implements LogTransport {
  log(message: string) {
    console.log(message);
  }
}

class FileTransport implements LogTransport {
  constructor(private filePath: string) {}

  log(message: string) {
    // Simulated file write
    console.log(`[File] Writing to ${this.filePath}: ${message}`);
  }
}

// Main Logger Class
class Logger {
  private transports: LogTransport[] = [];
  private logLevel: "info" | "warn" | "error" = "info";

  constructor(private context: string) {}

  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  setLogLevel(level: "info" | "warn" | "error"): void {
    this.logLevel = level;
  }

  private shouldLog(level: string): boolean {
    const levels = ["error", "warn", "info"];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }

  private formatMessage(level: string, message: string): string {
    return `[${new Date().toISOString()}] [${
      this.context
    }] [${level}] ${message}`;
  }

  info(message: string): void {
    if (this.shouldLog("info")) {
      const formatted = this.formatMessage("INFO", message);
      this.transports.forEach((t) => t.log(formatted));
    }
  }

  error(message: string): void {
    if (this.shouldLog("error")) {
      const formatted = this.formatMessage("ERROR", message);
      this.transports.forEach((t) => t.log(formatted));
    }
  }
}

// Usage
const logger = new Logger("AuthService");
logger.addTransport(new ConsoleTransport());
logger.addTransport(new FileTransport("logs.txt"));

logger.setLogLevel("error");
logger.info("User logged in");
logger.error("Invalid credentials");
