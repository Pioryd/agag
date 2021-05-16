export default function validate(data: { name?: string; message?: string }) {
  if (data.name != null) {
    if (data.name.trim().length < 3 || data.name.length > 15)
      throw new Error("Name must be between 3-15 characters");
  }
}
