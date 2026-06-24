import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const feedbackData = await request.json();
    
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      console.error("Missing Google Script URL configuration");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Google Apps Script requires standard URL-encoded form data or plain text
    // since we do a direct POST to the Web App. Let's send JSON.
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
      // Depending on the script deployment, redirect might be needed
      redirect: 'follow', 
    });

    const data = await response.text(); // Script might return HTML or text

    if (!response.ok) {
      console.error("Google Script API Error:", data);
      return NextResponse.json({ error: "Failed to sync with Sheet" }, { status: response.status });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Sync Sheet API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
