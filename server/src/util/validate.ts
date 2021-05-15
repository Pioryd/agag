export default function validate(data: { name?: string; message?: string }) {
  if (data.name != null) {
    if (data.name.trim().length < 3 || data.name.length > 15)
      throw new Error("Name must be between 3-15 characters");
  }

  if (data.message != null) {
    if (data.message.trim().length === 0)
      throw new Error("Message cannot be empty.");
    if (data.message.length > 256)
      throw new Error("Message is to long. Max 256 characters.");
  }
}
