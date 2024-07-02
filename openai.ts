import OpenAI from "openai";

const openai = new OpenAI({
    organization: "org-1hDhZPpQsratK0yBJGtIBLkT",
    project: "proj_vayRI5tE5Dv2f0850auMdh7X",
    apiKey: process.env.OPENAI_APIKEY_SECRET,
});

export default openai;