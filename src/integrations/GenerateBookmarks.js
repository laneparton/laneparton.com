import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

function parseBookmarksHtml(html) {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const publishedSection = Array.from(doc.querySelectorAll('dt > h3')).find(h3 => h3.textContent.includes('Published Bookmarks'));
    const links = publishedSection ? publishedSection.nextElementSibling.querySelectorAll('a') : [];
    const bookmarks = Array.from(links).map(link => ({
        title: link.textContent.trim(),
        href: link.getAttribute('href'),
        add_date: new Date(parseInt(link.getAttribute('add_date')) * 1000).toISOString()
    }));
    return bookmarks;
}

function loadAndConvertHtmlFile(filePath) {
    try {
        const htmlContent = fs.readFileSync(filePath, 'utf8');
        return parseBookmarksHtml(htmlContent);
    } catch (error) {
        throw new Error(`Failed to load or parse HTML file: ${filePath}`);
    }
}

async function processBookmarksFolder(folderPath) {
    const allBookmarks = [];  // Array to store all bookmarks

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        if (path.extname(file).toLowerCase() === '.html') {
            const filePath = path.join(folderPath, file);
            try {
                const bookmarks = loadAndConvertHtmlFile(filePath);
                allBookmarks.push(...bookmarks);  // Add bookmarks to the array
            } catch (error) {
                console.log('Error processing file:', file, error);
            }
        }
    }

    // Only write to bookmarks.json if allBookmarks is not empty
    if (allBookmarks.length > 0) {
        const jsonFilePath = path.join(folderPath, 'bookmarks.json');
        fs.writeFileSync(jsonFilePath, JSON.stringify(allBookmarks, null, 2));
        console.log('All bookmarks saved to:', jsonFilePath);
    } else {
        console.log('No bookmarks found. bookmarks.json was not overwritten.');
    }
}

// Astro integration
export function generateBookmarks({ bookmarksPath = './src/content/bookmarks' }) {
    return {
        name: "generate-bookmarks",
        hooks: {
            "astro:build:setup": async ({ logger }) => {
                try {
                    await processBookmarksFolder(bookmarksPath);
                    logger.info("Bookmark generation completed.");
                } catch (e) {
                    logger.error("Error in Bookmark generation:", e);
                }
            }
        }
    };
}