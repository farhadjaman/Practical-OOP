class TextProcessor {
  constructor(private text: string) {}

  // Instance method: Truncate with ellipsis
  truncate(maxLength: number): TextProcessor {
    this.text =
      this.text.length > maxLength
        ? `${this.text.substring(0, maxLength - 3)}...`
        : this.text;
    return this;
  }

  // Instance method: Sanitize HTML
  sanitizeHTML(): TextProcessor {
    this.text = this.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return this;
  }

  // Instance method: Capitalize first letter of each word
  capitalizeWords(): TextProcessor {
    this.text = this.text.replace(/\b\w/g, (char) => char.toUpperCase());
    return this;
  }

  // Instance method: Remove extra whitespace
  normalizeWhitespace(): TextProcessor {
    this.text = this.text.replace(/\s+/g, " ").trim();
    return this;
  }

  // Instance method: Count words
  wordCount(): number {
    return this.text.trim().split(/\s+/).length;
  }

  // Get the final processed value
  value(): string {
    return this.text;
  }

  // Static method: Validate email format
  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Static method: Extract hashtags
  static extractHashtags(text: string): string[] {
    const matches = text.match(/#[a-zA-Z0-9_]+/g);
    return matches ? matches : [];
  }

  // Static method: Extract mentions
  static extractMentions(text: string): string[] {
    const matches = text.match(/@[a-zA-Z0-9_]+/g);
    return matches ? matches : [];
  }

  // Static method: Generate URL slug
  static toSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Static method: Validate URL format
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Static method: Generate random string
  static generateRandomString(length: number): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  }
}

// Usage
const comment = new TextProcessor(
  '<script>alert("hi")</script>Too long comment here #example #test @user',
);
console.log(comment.sanitizeHTML().truncate(20).value()); // "&lt;script&gt;alert..."
console.log(
  TextProcessor.extractHashtags(
    '<script>alert("hi")</script>Too long comment here #example #test @user',
  ),
); // ["#example", "#test"]
console.log(
  TextProcessor.extractMentions(
    '<script>alert("hi")</script>Too long comment here #example #test @user',
  ),
); // ["@user"]
console.log(comment.wordCount()); // 6

const text = new TextProcessor("  hello   world  ");
console.log(text.normalizeWhitespace().value()); // "hello world"
console.log(text.capitalizeWords().value()); // "Hello World"

console.log(TextProcessor.isValidEmail("test@example.com")); // true
console.log(TextProcessor.toSlug("Hello World! 2024")); // "hello-world-2024"
console.log(TextProcessor.isValidURL("https://example.com")); // true
console.log(TextProcessor.generateRandomString(10)); // "aB3kP9mN2x"
