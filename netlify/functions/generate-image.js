export async function handler(event) {
  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt missing" }),
      };
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        input: prompt,
        size: "1024x1024"
      }),
    });

    const data = await response.json();

    const imageBase64 = data.output?.[0]?.content?.[0]?.image_base64;

    if (!imageBase64) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No image returned", raw: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        image: `data:image/png;base64,${imageBase64}`,
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
