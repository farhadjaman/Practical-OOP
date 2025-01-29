type LogLevel = "debug" | "info" | "warn" | "error";

interface Database {
  url: string;
  name?: string;
  poolSize?: number;
}

interface SecurityConfig {
  jwtSecret: string;
  corsOrigins: string[];
  allowedHosts: string[];
}

interface serverConfig {
  port: number;
  apiUrl: string;
  logLevel: LogLevel;
}

interface AppConfigOptions {
  database: Database;
  security: SecurityConfig;
  server: serverConfig;
}

type Environment = "development" | "production" | "staging";

const requiredEnvs = ["DATABASE_URL", "JWT_SECRET", "ALLOWED_HOSTS", "API_URL"];

export class AppConfig {
  private static instance: AppConfig;
  private readonly config: AppConfigOptions;

  private constructor() {
    this.config = this.loadOptions();
  }

  private loadOptions(): AppConfigOptions {
    this.validateEnv();
    return {
      database: {
        url: this.getRequiredEnv("DATABASE_URL", true),
        poolSize: parseInt(process.env.DATABASE_POOL_SIZE || "10"),
      },
      security: {
        jwtSecret: this.getRequiredEnv("JWT_SECRET", true),
        corsOrigins: this.parseCorsOrigins(),
        allowedHosts: this.parseAllowedHosts(),
      },
      server: {
        port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
        apiUrl: this.getRequiredEnv("API_URL"),
        logLevel: (process.env.LOG_LEVEL as LogLevel) || "info",
      },
    };
  }

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      console.log("New Instance");
      AppConfig.instance = new AppConfig();
    }
    console.log("returning old instance");
    return AppConfig.instance;
  }

  private validateEnv() {
    const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);
    if (missingEnvs.length > 0) {
      throw new Error(
        `Missing environment variables: ${missingEnvs.join(", ")}`,
      );
    }
  }

  //the reason we are using force because here specifically some env is important for configuration and some are not, so those which are important we are define dit in the requiredEnv array but for the whole app if we want to say which env is required then we can use force
  public getRequiredEnv(key: string, force: boolean = false): string {
    const value = process.env[key];
    if (force && !value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value || "";
  }

  private parseCorsOrigins(): string[] {
    const originString = this.getRequiredEnv("CORS_ORIGINS") || "*";
    return originString.split(",").map((origin) => origin.trim());
  }

  private parseAllowedHosts(): string[] {
    const hosts = this.getRequiredEnv("ALLOWED_HOSTS");
    return hosts.split(",").map((host) => host.trim());
  }

  private parseLogLevel(): LogLevel {
    return (process.env.LOG_LEVEL as LogLevel) || "info";
  }

  get environment(): Environment {
    return (process.env.NODE_ENV || "development") as Environment;
  }

  get isDevelopment() {
    return this.environment === "development";
  }

  get isProduction() {
    return this.environment === "production";
  }

  get isStaging() {
    return this.environment === "staging";
  }

  get database() {
    return this.config.database;
  }

  get security() {
    return this.config.security;
  }

  get server() {
    return this.config.server;
  }
}
