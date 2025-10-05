import mongoose from "mongoose";

export async function GET() {
const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI as string;

  try {
    // Kết nối thử tới MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return new Response(
      JSON.stringify({ message: "✅ API & DB OK" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "❌ DB connect fail", detail: error.message }),
      { status: 500 }
    );
  }
}
