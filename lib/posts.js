import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  const filesnames = fs.readdirSync(postsDirectory);

  const allFilesData = filesnames.map((fn) => {
    const id = fn.replace(/\.md/, "");

    const fullPath = path.join(postsDirectory, fn);
    const fileContents = fs.readFileSync(fullPath);

    const matterResults = matter(fileContents);
    return {
      id,
      ...matterResults.data,
    };
  });

  return allFilesData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getAllPostsId() {
  const filenames = fs.readdirSync(postsDirectory);
  return filenames.map((fn) => ({
    params: {
      id: fn.replace(/\.md$/, ""),
    },
  }));
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
