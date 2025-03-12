import axios from "axios";

export default async function handler(req, res) {
    try {
        const deepseekResponse = await axios.post(
            "https://api.deepseek.com/v1/chat/completions",
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "user",
                        content: "Fetch top 10 trending news headlines with summaries and source links for today."
                    }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
                }
            }
        );

        const qwenResponse = await axios.post(
            "https://api.qwen.com/v1/completions",
            {
                model: "qwen-model",
                messages: [
                    {
                        role: "user",
                        content: "Get the latest trending news with summaries and source links."
                    }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.QWEN_API_KEY}`
                }
            }
        );

        const geminiResponse = await axios.post(
            "https://api.gemini.com/v1/completions",
            {
                model: "gemini-model",
                messages: [
                    {
                        role: "user",
                        content: "Give today's top 10 news headlines with summaries and source links."
                    }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GEMINI_API_KEY}`
                }
            }
        );

        const news = [
            ...deepseekResponse.data.news,
            ...qwenResponse.data.news,
            ...geminiResponse.data.news
        ];

        res.status(200).json({ news });
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Failed to fetch news from AI" });
    }
}
