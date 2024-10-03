const sections = document.querySelectorAll('.content-section');
let currentLanguage = 'hu'; // Default language

const validSections = ['home', 'about', 'classes', 'contact'];
// const customSections = ['about', 'classes', 'contact'];
const navText = {
    en: {
        home: "Home",
        about: "About Us",
        classes: "Classes",
        contact: "Contact Us",
    },
    hu: {
        home: "Főoldal",
        about: "Rólam",
        classes: "Órák",
        contact: "Kapcsolat",
    }
};

// Function to switch between sections
function switchSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Function to parse markdown-like syntax to HTML
function parseMarkdown(text) {
    // Bold: **text**
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: _text_
    text = text.replace(/\_(.+?)\_/g, '<em>$1</em>');
    
    // Code: `code`
    text = text.replace(/\`(.+?)\`/g, '<code>$1</code>');

    // Headers: # Header, ## Header, ### Header
    text = text.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Unordered lists: * item
    text = text.replace(/^\* (.+)$/gm, '<ul><li>$1</li></ul>');

    // Ordered lists: 1. item
    text = text.replace(/^\d+\. (.+)$/gm, '<ol><li>$1</li></ol>');

    // Blockquotes: > quote
    text = text.replace(/^\> (.+)$/gm, '<blockquote>$1</blockquote>');

    // Paragraphs: Double line break -> new paragraph
    text = text.replace(/\n\s*\n/g, '</p><p>');

    // Links: [text](url)
    text = text.replace(/\[([^\[]+)\]\(((mailto:[^\)]+)|(https?:\/\/[^\)]+))\)/g, '<a href="$2">$1</a>');

    // images
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%; height:auto;">');

    // Ensure the text is wrapped in <p> tags
    return `<p>${text}</p>`;
}

// Function to load content based on language and section
function loadContent(section, language) {
    let filePath = `content/${section}_${language}.txt`;

    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const parsedContent = parseMarkdown(data);
            document.getElementById(section).innerHTML = `<p>${parsedContent}</p>`;
        })
        .catch(error => {
            document.getElementById(section).innerHTML = '<p>Error loading content.</p>';
        });
}

// Function to handle URL hash changes
function handleHashChange() {
    const hash = window.location.hash.substring(1); // Remove the '#' character

    if (validSections.includes(hash)) {
        switchSection(hash);
        loadContent(hash, currentLanguage);
    } else {
        switchSection('home'); // Default to home if hash is invalid
    }
}

// Function to update the navigation text
function updateNavText(language) {
    const container = document.querySelector("#menu");
    const navLinks = container.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        link.textContent = navText[language][section]; // Set the text for the current language
    });
}

// Event listener for language switching
document.getElementById('switchToEn').addEventListener('click', () => {
    currentLanguage = 'en';
    updateNavText(currentLanguage); // Update navigation text
    handleHashChange(); // Load the content for the current hash
});

document.getElementById('switchToHu').addEventListener('click', () => {
    currentLanguage = 'hu';
    updateNavText(currentLanguage); // Update navigation text
    handleHashChange(); // Load the content for the current hash
});

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);

// Check the initial hash on page load
if (!window.location.hash) {
    window.location.hash = 'home'; // Default to home if no hash
}
handleHashChange(); // Load initial content
updateNavText(currentLanguage); // Set initial navigation text
