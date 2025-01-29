class AppConfig {
  private static instance: AppConfig;
  private constructor(public apiUrl: string) {}

  static getInstance() {
    if (!AppConfig.instance) {
      console.error("New Instance");
      AppConfig.instance = new AppConfig("http://localhost:3000/");
      return AppConfig.instance;
    }
    console.log("returning old instance");
    return AppConfig.instance;
  }

  //utility
  static isProduction() {
    return process.env.NODE_ENV === "production";
  }

  static isDevelopment() {
    return process.env.NODE_ENV !== "production";
  }
}

const config = AppConfig.getInstance();
const config1 = AppConfig.getInstance();

AppConfig.isProduction();
