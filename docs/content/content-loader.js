/*
 * Loads the client-editable page copy from docs/content/*.json.
 * Keep this file technical: clients should only edit the JSON files.
 */
(async () => {
  const page = document.documentElement.dataset.contentPage;
  if (!page) return;

  try {
    const response = await fetch(`content/${page}.json`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Could not load ${page}.json`);

    const content = await response.json();
    if (content.title) document.title = content.title;

    for (const field of content.fields || []) {
      const targets = document.querySelectorAll(field.selector);
      if (!targets.length) {
        console.warn(`Content field not found: ${field.label}`);
        continue;
      }

      for (const target of targets) {
        // Copy fields intentionally support a small amount of presentational
        // HTML such as <em> or <br>. Do not put scripts or links in values.
        target.innerHTML = field.value;
      }
    }
  } catch (error) {
    // The original HTML remains visible if a content file has a typo.
    console.error('AGW content could not be loaded.', error);
  }
})();
