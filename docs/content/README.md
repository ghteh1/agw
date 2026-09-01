# Editing website wording

This folder is the only place clients need to edit for normal wording updates.

## Files to edit

| Page | File |
| --- | --- |
| Home | `index.json` |
| About | `about.json` |
| Products | `products.json` |
| Environment | `environment.json` |

## Safe editing rules

1. Change **only** the text after `"value":`.
2. Do not edit `label` or `selector`.
3. Keep the opening and closing quotation marks around each value.
4. To italicise a word, write `<em>word</em>`. To add a line break, write `<br>`.
5. Do not paste links, scripts, or embed code into these files.
6. Do not edit files outside this `content` folder unless your web developer asks you to.

## Preview and publish

1. Open the repository in **GitHub Desktop**.
2. Click **Repository → Open in Visual Studio Code**.
3. Edit the relevant JSON file in this folder and save it.
4. In GitHub Desktop, review that only files in `docs/content/` changed.
5. Write a short summary, such as `Update Biochar product wording`, then click **Commit to main**.
6. Click **Push origin**.
7. Wait about 1–2 minutes, then check <https://asiagreenwood.com/> in a private/incognito browser window.

Git history keeps every version. If a published change is wrong, do not try to repair the page code: ask the site owner to restore the previous commit in GitHub Desktop.

## Before publishing

- Ask ChatGPT to proofread the text, but verify all product claims, certifications, statistics and dates with Asia Green Wood before publishing.
- Keep paragraphs roughly the same length where possible so the design remains balanced.
- Never share or add API keys, passwords, Cloudflare settings, or Resend credentials to this repository.
