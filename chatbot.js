// ============================================
// RAG Chatbot for Rizqi Maulidi Portfolio
// Uses Google AI Studio Gemini API (Client-Side)
// ============================================

const GEMINI_API_KEY = 'AIzaSyDVw-h2HYD2I7lqZECiomGeB74VlcoosaE';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// ============================================
// KNOWLEDGE BASE - All info about Rizqi Maulidi
// ============================================
const KNOWLEDGE_BASE = `
=== PERSONAL INFO ===
Name: Rizqi Maulidi
Role: Data Scientist & Machine Learning Engineer
Location: Jakarta, Indonesia
Email: rizqimaulidi@gmail.com
GitHub: https://github.com/rizqi-maulidi
LinkedIn: https://www.linkedin.com/in/rizqi-maulidi

=== ABOUT ===
Data Scientist and Machine Learning Engineer with a Mathematics background and hands-on experience in building end-to-end machine learning solutions. Skilled in Python, SQL, and ML frameworks such as Scikit-learn and TensorFlow for data preprocessing, modeling, and evaluation. Passionate about transforming data into actionable insights and intelligent systems that support data-driven decision making.

=== EDUCATION ===
1. UIN Syarif Hidayatullah Jakarta - Bachelor of Mathematics with Data Science concentration (2021 - 2025)
2. SMAN 44 JAKARTA - Department of Mathematics and Natural Sciences (2017 - 2021)

=== SKILLS ===
Programming Languages: Python, R, JavaScript, SQL
Data Visualization: Tableau, Power BI, Streamlit, Matplotlib, Seaborn
Database: PostgreSQL, MongoDB
ML Frameworks: TensorFlow, Scikit-learn, Keras
Tools: Git & GitHub, Docker
NLP: Sentiment Analysis, ABSA, BERT, LSTM, Transformer

=== WORK EXPERIENCE ===
1. Machine Learning Engineer at Naradata ID (Aug 2025 - Present)
   - Designed and implemented data pipelines to ingest and preprocess large-scale Indonesian social media data.
   - Developed and fine-tuned Transformer-based models (BERT) for sentiment, emotion, and topic classification (>90% accuracy).
   - Built a Retrieval-Augmented Generation (RAG) chatbot integrated into a web-based monitoring platform.
   - Conducted EDA and social network analysis (SNA) to identify influence patterns and community clusters.
   - Collaborated with cross-functional teams to translate business requirements into ML solutions.

2. Machine Learning Engineer - Coding Camp 2025 powered by DBS Foundation (Feb 2025 - Jun 2025)
   - Completed 936 hours of training in Python, Data Analysis, SQL, Machine Learning, Deep Learning, and Deployment.
   - Analyzed Olist Ecommerce data to uncover revenue, satisfaction, and demand trends.
   - Developed a Gojek sentiment analysis app using LSTM and Transformer models (92.41% accuracy).
   - Built a churn prediction model to identify at-risk customers.
   - Designed a recommendation system with collaborative and content-based filtering.
   - Deployed full-stack ML apps with modular architecture.

3. Data Scientist at Taudata Analytics (Mar 2024 - Nov 2024)
   - Worked in the Brand Monitoring division for the automotive industry.
   - Conducted NLP project using Aspect-Based Sentiment Analysis (ABSA) on social media data.
   - Fine-tuned a BERT-based model on labeled Indonesian automotive data.
   - Created sentiment analysis and visualizations for Indonesia's top 5 car brands in 2023.

4. Junior Data Analyst at BMKG (Jan 2024 - Feb 2024)
   - Built a logistic regression model in R to predict rainfall for Climate Early Warning System (CEWS).
   - Preprocessed climate datasets and conducted hypothesis testing to optimize model performance.

5. Staff, Department RELASI at HIMATIKA (Mar 2023 - Mar 2024)
   - Organized spiritual and social programs for Mathematics students.
   - Planned and executed programs: INSAN, Kajian HIMATIKA, GAUS, Sharing With Alumni.

=== PROJECTS ===
1. Adopt House - Full-stack web-based pet adoption platform. Led as Project Manager, integrating content-based recommendation and image classification models. Coordinated frontend, backend, and ML divisions. (GitHub: https://github.com/capstoneadoptpet)

2. Customer Churn Prediction - Churn prediction system for telecommunications using Random Forest and XGBoost with SMOTE, achieving 91% accuracy and 0.8843 ROC-AUC score. (GitHub: https://github.com/rizqi-maulidi/Flood-Prediction-Exercise)

3. Olist Ecommerce Analysis - In-depth analytics on Brazil's Olist ecommerce dataset using Python and Streamlit for revenue, customer satisfaction, geospatial distribution, and RFM segmentation. (GitHub: https://github.com/rizqi-maulidi/-Olist-Ecommerce-Analysis)

4. Sentiment Analysis Indonesian Gojek App - Sentiment analysis on Gojek app reviews from Play Store using LSTM and Transformer models achieving 92.41% test accuracy. (GitHub: https://github.com/rizqi-maulidi/Sentiment_Analysis_Gojek)

5. Study Recommendation - Hybrid content-based recommendation system for academic study fields using cosine similarity and rule-based profiling (25.11% accuracy). (GitHub: https://github.com/rizqi-maulidi/Recomendation-System)

6. Udemy Course Segmentation - Segmented 13,608 Udemy courses using KMeans clustering into 3 segments. Built KNN, SVM, and Naive Bayes classifiers for automated segmentation. (GitHub: https://github.com/rizqi-maulidi/Course-Segmentation-Udemy)

=== CERTIFICATIONS ===
1. Applied Machine Learning - Dicoding (25+ hours)
2. Data Analysis with Python - Dicoding (22+ hours)
3. Database Design & SQL Programming - Digital Talent Scholarship 2024 (180 hours)
4. Data Processing Fundamentals - Dicoding (60 hours)
5. Deep Learning Fundamentals - Dicoding (90 hours)
6. Basics of AI - Dicoding (10 hours)
7. Git Basics with GitHub - Dicoding (15 hours)
8. Basic SQL - Dicoding (11 hours)
9. Programming Basic for Software Developer - Dicoding (9 hours)

=== CONTACT ===
Email: rizqimaulidi@gmail.com
LinkedIn: https://www.linkedin.com/in/rizqi-maulidi
GitHub: https://github.com/rizqi-maulidi
`;

// ============================================
// SYSTEM PROMPT
// ============================================
const SYSTEM_PROMPT = `You are Rizqi Maulidi's personal portfolio assistant chatbot. Your name is "RizqiBot".
You MUST answer questions ONLY based on the knowledge base provided below. 
You should respond in the SAME LANGUAGE as the user's question (if user asks in Indonesian, reply in Indonesian; if in English, reply in English).

RULES:
1. ONLY answer questions about Rizqi Maulidi - his experience, skills, projects, education, certifications, and contact information.
2. If the user asks something OUTSIDE the scope of Rizqi's portfolio (e.g., general knowledge, coding help, or unrelated topics), respond with: "Maaf, pertanyaan Anda di luar konteks portfolio Rizqi Maulidi. Saya hanya bisa menjawab pertanyaan seputar pengalaman, skill, project, dan kontak Rizqi. 😊" (or the English equivalent if asked in English).
3. Be friendly, professional, and concise.
4. Use emojis sparingly to keep it friendly.
5. When mentioning projects or links, include the GitHub URLs if available.
6. Format responses nicely with line breaks for readability.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}`;

// ============================================
// CHAT STATE
// ============================================
let chatHistory = [];
let isTyping = false;

// ============================================
// INITIALIZE CHATBOT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        chatToggle.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
            // Show welcome message if first time
            if (chatMessages.children.length === 0) {
                addBotMessage("Halo! 👋 Saya RizqiBot, asisten portfolio Rizqi Maulidi. Silakan tanyakan apa saja tentang pengalaman, skill, project, atau kontak Rizqi!");
            }
        }
    });

    // Close chat
    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        chatToggle.classList.remove('active');
    });

    // Send on Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Send on button click
    chatSend.addEventListener('click', sendMessage);
});

// ============================================
// SEND MESSAGE
// ============================================
async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (!message || isTyping) return;

    // Add user message to UI
    addUserMessage(message);
    chatInput.value = '';

    // Add to history
    chatHistory.push({ role: 'user', parts: [{ text: message }] });

    // Show typing indicator
    isTyping = true;
    const typingId = showTypingIndicator();

    try {
        const response = await callGeminiAPI(message);
        removeTypingIndicator(typingId);
        addBotMessage(response);
        chatHistory.push({ role: 'model', parts: [{ text: response }] });
    } catch (error) {
        removeTypingIndicator(typingId);
        addBotMessage("Maaf, terjadi kendala teknis. Silakan coba lagi nanti. 🙏");
        console.error('Chatbot error:', error);
    }

    isTyping = false;
}

// ============================================
// CALL GEMINI API
// ============================================
async function callGeminiAPI(userMessage) {
    const requestBody = {
        system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: chatHistory,
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
    };

    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak ada respons.";
}

// ============================================
// UI HELPERS
// ============================================
function addUserMessage(text) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message user-message';
    msgDiv.innerHTML = `<div class="message-bubble user-bubble">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
}

function addBotMessage(text) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message bot-message';
    // Convert markdown-like formatting
    const formattedText = formatBotMessage(text);
    msgDiv.innerHTML = `
        <div class="bot-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-bubble bot-bubble">${formattedText}</div>
    `;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="bot-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-bubble bot-bubble">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
    return 'typingIndicator';
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatBotMessage(text) {
    // Convert **bold** to <strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert *italic* to <em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Convert URLs to links
    text = text.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" style="color: var(--accent-secondary);">$1</a>');
    // Convert newlines to <br>
    text = text.replace(/\n/g, '<br>');
    return text;
}
