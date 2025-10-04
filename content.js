// Content script that runs only when extension button is clicked
;(function () {
    // Prevent multiple executions
    if (window.butlerExtensionExecuted) {
        console.log('Butler extension already executed on this page')
        return
    }
    window.butlerExtensionExecuted = true

    console.log('Butler extension activated!')

    const options = {
        tone: 'more-casual',
        format: 'plain-text',
        length: 'shorter',
    }

    // Function to process content on the page using the rewriter
    async function processPageContent(rewriter) {
        try {
            // Find textarea elements on the page that could benefit from rewriting
            const textSelectors = ['textarea']

            let processedCount = 0

            for (const selector of textSelectors) {
                const elements = document.querySelectorAll(selector)

                for (const element of elements) {
                    // Skip if element is empty or already processed
                    if (
                        !element.textContent.trim() ||
                        element.dataset.butlerProcessed
                    ) {
                        continue
                    }

                    // Skip very short text (less than 10 characters)
                    if (element.textContent.trim().length < 10) {
                        continue
                    }

                    try {
                        console.log(
                            'Processing element:',
                            element.textContent.substring(0, 50) + '...'
                        )

                        // Use the rewriter to improve the text content
                        const result = await rewriter.rewrite(
                            element.textContent,
                            {
                                context:
                                    'Ensure the text has not spelling mistakes or grammar mistakes',
                            }
                        )

                        // Update the element with the rewritten content
                        element.textContent = result
                        element.dataset.butlerProcessed = 'true'
                        processedCount++

                        console.log('Successfully processed element')
                    } catch (rewriteError) {
                        console.warn('Failed to rewrite element:', rewriteError)
                    }
                }
            }

            console.log(
                `Butler extension processed ${processedCount} elements on the page`
            )

            // Show a notification to the user
            if (processedCount > 0) {
                showNotification(
                    `Butler processed ${processedCount} text elements on this page!`
                )
            } else {
                showNotification('No suitable text content found to process.')
            }
        } catch (error) {
            console.error('Error processing page content:', error)
        }
    }

    // Function to show a simple notification to the user
    function showNotification(message) {
        // Create a temporary notification element
        const notification = document.createElement('div')
        notification.textContent = message
        notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `

        document.body.appendChild(notification)

        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification)
            }
        }, 3000)
    }

    // Main execution function
    async function runButler() {
        try {
            const available = await Rewriter.availability()
            let rewriter

            if (available === 'unavailable') {
                // The Rewriter API isn't usable.
                console.log('Rewriter API is unavailable')
                return
            }

            if (available === 'available') {
                // The Rewriter API can be used immediately.
                rewriter = await Rewriter.create(options)
                console.log('Rewriter created successfully')
            } else {
                // The Rewriter can be used after the model is downloaded.
                rewriter = await Rewriter.create(options)
                rewriter.addEventListener('downloadprogress', e => {
                    console.log('Download progress:', e.loaded, e.total)
                })
                console.log('Rewriter created, downloading model...')
            }

            // Now use the rewriter to process content on the page
            await processPageContent(rewriter)
        } catch (error) {
            console.error('Error running Butler extension:', error)
        }
    }

    // Execute the main function
    runButler()
})() // End of IIFE
