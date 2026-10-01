import axios from "axios";
import fs from "fs/promises";

export const uploadImageToGitHub = async (
  file,
  fileName
) => {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN;

  const filePath = `profile-images/${fileName}`;

  // Read image saved by Multer
  const fileBuffer = await fs.readFile(file.path);

  // Convert image to Base64
  const content = fileBuffer.toString("base64");

  // Upload image to GitHub
  const response = await axios.put(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      message: `Add profile image ${fileName}`,
      content: content,
      branch: branch,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const imageUrl =
    `https://raw.githubusercontent.com/` +
    `${owner}/${repo}/${branch}/${filePath}`;

  return {
    imageUrl,
    githubResponse: response.data,
  };
};