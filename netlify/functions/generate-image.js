export async function handler(event) {
  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No prompt provided" })
      };
    }

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

    if (!data.data || !data.data[0].b64_json) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No image returned" })
      };
    }

    const imageBase64 = `data:image/png;base64,${data.data[0].b64_json}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ image: imageBase64 })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
