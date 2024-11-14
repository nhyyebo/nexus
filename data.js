const scripts = [
    {
        id: 1,
        title: "Azure V4 Mobile",
        description: "A powerful combat and PvP script for mobile games.",
        downloadUrl: "scripts/azure-v4-mobile.txt",
        tags: ["Combat", "PvP"],
        date: "2024-01-15",
        downloads: 2891
    },
    {
        id: 2,
        title: "Auto Farm Pro",
        description: "Powerful auto-farming script with smart pathfinding and auto-collect features. Supports multiple games.",
        downloadUrl: "scripts/auto-farm-pro.txt",
        tags: ["Auto-Farm", "Grinding"],
        date: "2024-01-16",
        downloads: 1672
    },
    {
        id: 3,
        title: "Admin Commands Plus",
        description: "Extended admin commands with over 100+ features. Great for game testing and moderation.",
        downloadUrl: "scripts/admin-commands-plus.txt",
        tags: ["Admin", "Universal"],
        date: "2024-01-17",
        downloads: 4102
    }
    // Add more scripts here as needed
];

// Assuming the downloadButton and downloadScript function are defined elsewhere in the code
// The downloadButton event listener should be updated to pass script content directly instead of URL
// Here's an example of how the updated event listener might look:
downloadButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    downloadScript(script.title, script.downloadUrl);
});
