// Background script to handle extension button clicks
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Check if the script is already injected
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.butlerExtensionExecuted,
    });

    if (results[0]?.result) {
      console.log("Butler extension already running on this page");
      return;
    }

    // Inject and execute the content script when the extension button is clicked
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  } catch (error) {
    console.error("Error injecting Butler extension:", error);
  }
});
