const username = 'dinuargo79';
const apiKey = 'ddef221077c15d57433783de3d8641aa1efb0884';

// Function to fetch all contests from the API
async function fetchAllContests(resource) {
    const url = `https://clist.by/api/v2/json/contest/?username=${username}&api_key=${apiKey}&resource=${resource}&limit=100000`; // Large limit to fetch all contests

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Filter for upcoming contests and sort by start date
        const upcomingContests = data.objects
            .map(contest => ({
                id: contest.id,
                event: contest.event,
                start: new Date(contest.start),
                end: new Date(contest.end),
                href: contest.href
            }))
            .filter(contest => contest.start > new Date())  // Filter only upcoming contests
            .sort((a, b) => a.start - b.start);  // Sort by start date

        return upcomingContests;
    } catch (error) {
        console.error('Error fetching contests:', error);
        return [];
    }
}

// Function to load contests into the DOM
async function loadContests(resource) {
    const contests = await fetchAllContests(resource);
    const contestSection = document.getElementById('contest-section');
    contestSection.innerHTML = '';  // Clear previous contests

    contests.forEach(contest => {
        const contestCard = document.createElement('div');
        contestCard.className = 'contest-card';

        contestCard.innerHTML = `
            <div class="card-body">
                <h3 class="card-title">${contest.event}</h3>
                <p class="card-text">Start: ${contest.start.toLocaleString()}</p>
                <p class="card-text">End: ${contest.end.toLocaleString()}</p>
                <p class="card-text">
                    <a href="${contest.href}" target="_blank" rel="noopener noreferrer" class="btn btn-contest-link">
                        Contest Link <i class="fas fa-external-link-alt"></i>
                    </a>
                </p>
            </div>
        `;

        contestSection.appendChild(contestCard);
    });
}

// Load the default contests (e.g., Codeforces) on initial page load
document.addEventListener('DOMContentLoaded', () => {
    loadContests('codeforces.com');
});
