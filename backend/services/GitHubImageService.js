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

export const deleteImageFromGitHub = async (
  imageUrl
) => {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN;

  const githubUrlPrefix =
    `https://raw.githubusercontent.com/` +
    `${owner}/${repo}/${branch}/`;

  if (!imageUrl.startsWith(githubUrlPrefix)) {
    throw new Error(
      "Invalid GitHub image URL."
    );
  }

  const filePath = imageUrl.replace(
    githubUrlPrefix,
    ""
  );

  // Get file SHA
  const fileResponse = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      params: {
        ref: branch,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const fileSha = fileResponse.data.sha;

  // Delete file from GitHub
  await axios.delete(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      data: {
        message: `Delete profile image ${filePath}`,
        sha: fileSha,
        branch: branch,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return true;
};