import fetch from "node-fetch";

export async function handler(event) {
  try {
    // Allow only POST requests
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" })
      };
    }

    // Parse request body
    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt is required" })
      };
    }

    // Call OpenAI Image API
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1024"
      })
    });

    const data = await response.json();

    // Check for API errors
    if (!data || !data.data || !data.data[0] || !data.data[0].url) {
      console.error("OpenAI Error:", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Image generation failed", details: data })
      };
    }

    // Success
    return {
      statusCode: 200,
      body: JSON.stringify({
        image: data.data[0].url
      })
    };

  } catch (error) {
    console.error("Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
}
