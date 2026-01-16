
import { GoogleGenerativeAI } from "@google/generative-ai";

// Hardcoded API key for seamless experience
const GEMINI_API_KEY = "AIzaSyA6qo5KwtHBnxxE-tvzXRiJ05BujdFI9Ic";


export async function fetchGitHubData(username, apiKey) {
    try {
        const [userRes, eventsRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/events?per_page=100`),
            fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
        ]);

        if (!userRes.ok) {
            if (userRes.status === 404) throw new Error('User not found');
            throw new Error('Failed to fetch user data');
        }

        const user = await userRes.json();
        const events = await eventsRes.json();
        const repos = await reposRes.json();

        return processReceiptData(user, events, repos, apiKey);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function processReceiptData(user, events, repos, apiKey) {
    // Initialize counters
    let commits = 0;
    let pullRequests = 0;
    let newRepos = 0;
    let issuesOpened = 0;
    let languages = {};
    let activeDays = new Set();
    let lateNightCommits = 0; // After 10 PM, before 4 AM
    let weekendCommits = 0;
    let morningCommits = 0; // 4 AM - 12 PM
    let afternoonCommits = 0; // 12 PM - 5 PM
    let eveningCommits = 0; // 5 PM - 10 PM

    // Process events
    events.forEach(event => {
        const date = new Date(event.created_at);
        activeDays.add(date.toDateString());

        const hour = date.getHours();
        const day = date.getDay(); // 0 is Sunday, 6 is Saturday

        if (hour >= 22 || hour < 4) lateNightCommits++;
        else if (hour >= 4 && hour < 12) morningCommits++;
        else if (hour >= 12 && hour < 17) afternoonCommits++;
        else eveningCommits++;

        if (day === 0 || day === 6) weekendCommits++;

        switch (event.type) {
            case 'PushEvent':
                commits += event.payload.size;
                break;
            case 'PullRequestEvent':
                if (event.payload.action === 'opened') pullRequests++;
                break;
            case 'CreateEvent':
                if (event.payload.ref_type === 'repository') newRepos++;
                break;
            case 'IssuesEvent':
                if (event.payload.action === 'opened') issuesOpened++;
                break;
        }
    });

    // Language Breakdown
    let totalLanguageCount = 0;
    repos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
            totalLanguageCount++;
        }
    });

    const languageBreakdown = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang, count]) => ({
            lang,
            percent: Math.round((count / totalLanguageCount) * 100)
        }));

    // Normalize to ensure sum = 100%
    if (languageBreakdown.length > 0) {
        const sum = languageBreakdown.reduce((acc, l) => acc + l.percent, 0);
        if (sum !== 100) {
            // Adjust the largest percentage to make total = 100
            languageBreakdown[0].percent += (100 - sum);
        }
    }

    const topLanguage = languageBreakdown[0]?.lang || 'Unknown';

    // Coding Style Logic (Expanded & Specific)
    let codingStyle = 'CASUAL COMMITTER';
    const totalEvents = commits + pullRequests + issuesOpened + newRepos;

    if (totalEvents === 0) {
        codingStyle = 'GHOSTWARE ENGINEER';
    } else if (lateNightCommits > totalEvents * 0.4) {
        codingStyle = 'VAMPIRE CODER';
    } else if (weekendCommits > totalEvents * 0.4) {
        codingStyle = 'WEEKEND WARRIOR';
    } else if (morningCommits > totalEvents * 0.5) {
        codingStyle = 'CAFFEINE DRIVEN';
    } else if (commits > 100) {
        codingStyle = '10X ENGINEER';
    } else if (pullRequests > commits) {
        codingStyle = 'CODE REVIEWER';
    } else if (issuesOpened > commits) {
        codingStyle = 'QA IN DISGUISE';
    } else if (topLanguage === 'CSS' || topLanguage === 'HTML') {
        codingStyle = 'DIV CENTERER';
    } else if (topLanguage === 'JavaScript' || topLanguage === 'TypeScript') {
        codingStyle = 'CONSOLE.LOG(DEBUG)';
    } else if (topLanguage === 'Python') {
        codingStyle = 'SNAKE CHARMER';
    } else if (topLanguage === 'Rust') {
        codingStyle = 'MEMORY SAFE';
    } else if (topLanguage === 'Go') {
        codingStyle = 'GOPHER';
    } else if (newRepos > 5) {
        codingStyle = 'THE ARCHITECT';
    } else {
        codingStyle = 'FULL STACK OVERFLOW';
    }

    // Date Range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    const dateRange = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`;

    // Generate quirky prices (consistent per username)
    const quirkify = (base, variance = 0.3) => {
        const hash = user.login.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const seed = (hash % 100) / 100; // 0-1 based on username
        const randomFactor = 0.8 + (seed * variance); // 0.8 to 1.1
        const price = base * randomFactor;
        // Ensure quirky decimals (.37, .99, .69, .88, etc.)
        const quirkySuffixes = [0.37, 0.99, 0.69, 0.88, 0.42, 0.13, 0.77, 0.21, 0.66, 0.11];
        const intPart = Math.floor(price);
        const decimalPart = quirkySuffixes[hash % quirkySuffixes.length];
        return parseFloat(`${intPart}.${decimalPart.toString().split('.')[1]}`);
    };

    // Generate Items with per-user quirky prices
    const items = [
        { qty: commits, desc: 'COMMITS PUSHED', price: quirkify(1.8) },
        { qty: pullRequests, desc: 'PULL REQUESTS', price: quirkify(5.0) },
        { qty: newRepos, desc: 'NEW REPOS', price: quirkify(12.0) },
        { qty: issuesOpened, desc: 'ISSUES OPENED', price: quirkify(2.5) },
        { qty: activeDays.size, desc: 'ACTIVE SESSIONS', price: quirkify(4.0) },
        { qty: 1, desc: 'IMP. SYNDROME', price: 13.37 }, // Always 1337
    ].filter(item => item.qty > 0);

    // Generate Tax/Surcharge
    let surcharge = generateSurcharge({ commits, topLanguage, lateNightCommits, weekendCommits, pullRequests });

    // AI Generation (Always enabled with hardcoded key)
    try {
        const aiContent = await generateAIContent(GEMINI_API_KEY, {
            username: user.login,
            topLanguage,
            commitTimes: lateNightCommits > morningCommits ? 'Mostly between 12AM–4AM' : 'Mostly Daytime',
            activeDays: activeDays.size,
            commits,
            prsOpened: pullRequests,
            weekendActivity: weekendCommits > 0 ? 'Yes' : 'No'
        });

        if (aiContent) {
            surcharge = { label: aiContent.toUpperCase(), amount: 15.00 };
        }
    } catch (e) {
        console.error("AI Generation failed, falling back to heuristic", e);
        // Keep the heuristic surcharge as fallback
    }

    // Total Effort Score (0-100) with safety check
    const effortScore = commits === 0 && pullRequests === 0 ? 0 : Math.min(100, Math.round(((commits / 50) * 60) + ((pullRequests / 5) * 40)));

    // Random Footer
    const footers = [
        "THANK YOU FOR CODING.",
        "PUSH RESPONSIBLY.",
        "COMMIT WISELY.",
        "MERGE CAREFULLY.",
        "MAY YOUR BUILDS PASS.",
        "NO BUGS ON PRODUCTION.",
        "IT WORKS ON MY MACHINE.",
        "LGTM.",
        "SHIP IT.",
        "APPROVED.",
    ];
    const footer = footers[Math.floor(Math.random() * footers.length)];

    return {
        user: {
            login: user.login,
            name: user.name,
            avatar_url: user.avatar_url,
            html_url: user.html_url,
        },
        stats: {
            commits,
            pullRequests,
            newRepos,
            issuesOpened,
            topLanguage,
            activeDays: activeDays.size,
        },
        items,
        surcharge,
        languageBreakdown,
        codingStyle,
        dateRange,
        effortScore,
        footer,
        receiptId: `#GH-${Math.floor(Math.random() * 0xFFFFF).toString(16).toUpperCase().padStart(5, '0')}`,
        terminalId: `TERM-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
    };
}

function generateSurcharge(stats) {
    const { commits, topLanguage, lateNightCommits, weekendCommits, pullRequests } = stats;

    if (commits < 5) return { label: 'LURKER FEE', amount: 42.00 };
    if (commits > 80) return { label: 'TOUCH GRASS REBATE', amount: -15.00, isPercentage: true };
    if (pullRequests > 10) return { label: 'MERGE CONFLICT TAX', amount: 12.50 };

    if (topLanguage === 'JavaScript' || topLanguage === 'TypeScript') return { label: 'NODE_MODULES HEAVINESS', amount: 8.99 };
    if (topLanguage === 'CSS') return { label: '!IMPORTANT SURCHARGE', amount: 5.50 };
    if (topLanguage === 'Python') return { label: 'WHITESPACE CLEANUP', amount: 3.14 };
    if (topLanguage === 'Java') return { label: 'BOILERPLATE FEE', amount: 10.01 };
    if (topLanguage === 'C++' || topLanguage === 'C') return { label: 'SEGFAULT INSURANCE', amount: 20.48 };

    // Context-aware taxes (only if triggered)
    if (lateNightCommits > 10) return { label: 'BURNOUT PREVENTION', amount: 25.25 };
    if (weekendCommits > 5) return { label: 'NO LIFE SURCHARGE', amount: 14.99 };

    const randomTaxes = [
        { label: 'WORKS ON MY MACHINE', amount: 15.15 },
        { label: 'TECH DEBT INTEREST', amount: 29.99 },
        { label: 'CONTEXT SWITCHING', amount: 8.88 },
        { label: 'YAK SHAVING FEE', amount: 6.66 },
        { label: 'PREMATURE OPTIMIZATION', amount: 11.11 },
        { label: 'COPY-PASTE ROYALTY', amount: 4.04 },
        { label: 'DARK MODE SURCHARGE', amount: 5.55 },
        { label: 'UNNECESSARY REFACTOR', amount: 13.37 },
    ];

    return randomTaxes[Math.floor(Math.random() * randomTaxes.length)];
}

async function generateAIContent(apiKey, stats) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    INPUT:
    Username: ${stats.username}
    Top Language: ${stats.topLanguage}
    Commit Times: ${stats.commitTimes}
    Active Days: ${stats.activeDays}
    Commits: ${stats.commits}
    PRs Opened: ${stats.prsOpened}
    Weekend Activity: ${stats.weekendActivity}

    SYSTEM / INSTRUCTION PROMPT:
    You are generating a SINGLE line item for a developer "coding receipt".

    Your task:
    Generate ONE humorous but subtle "Fee" or "Tax" based on the developer's activity.

    Rules:
    - Output ONLY ONE line
    - Max 4–5 words
    - No emojis
    - No punctuation at the end
    - Must sound like a receipt charge
    - Must be playful, not insulting
    - Must NOT explain anything
    - Must NOT mention AI, GitHub, or analysis

    Tone:
    Dry, deadpan, understated, slightly sarcastic.

    Use these patterns ONLY:
    - TIME-BASED behavior
    - LANGUAGE stereotypes (light, respectful)
    - CODING HABITS (overworking, refactoring, late-night coding)

    Never:
    - Be motivational
    - Be verbose
    - Be generic
    - Repeat the same fee often

    Return ONLY the fee name.
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim().replace(/['"]/g, '');
}
