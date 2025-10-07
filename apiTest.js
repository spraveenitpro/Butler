console.log('API Test page loaded')

// Declare session variable in global scope so it can be accessed by both functions
let session

// Download the model

async function downloadModel() {
    session = await LanguageModel.create({
        monitor(m) {
            m.addEventListener('downloadprogress', e => {
                console.log(`Download ${e.loaded * 100}%`)
            })
        },
    })
}

async function testAvailability() {
    const availability = await LanguageModel.availability()
    console.log('LanguageModel availability:', availability)
    const params = await LanguageModel.params()
    console.log('LanguageModel params:', params)
}
testAvailability()

async function createSession() {
    try {
        const params = await LanguageModel.params()
        session = await LanguageModel.create({
            language: ['en'],
            initialPrompts: [
                {
                    role: 'system',
                    content: 'You are a helpful and friendly assistant.',
                },
                { role: 'user', content: 'What is the capital of Italy?' },
                { role: 'assistant', content: 'The capital of Italy is Rome.' },
                { role: 'user', content: 'What language is spoken there?' },
                {
                    role: 'assistant',
                    content: 'The official language of Italy is Italian. [...]',
                },
            ],
            temperature: Math.max(params.defaultTemperature * 1.2, 2.0),
            topK: params.defaultTopK,
        })
        console.log('Session created:', session)
        return session
    } catch (error) {
        console.error('Error creating session:', error)
    }
}

async function createPrompt() {
    if (!session) {
        console.error(
            'Session not created yet. Please call createSession() first.'
        )
        return
    }

    try {
        const prompt = await session.prompt(
            'Write me a poem about Rome the eternal city'
        )
        console.log('Prompt:', prompt)
    } catch (error) {
        console.error('Error creating prompt:', error)
    }
}

async function promptStreaming() {
    const stream = await session.promptStreaming(
        'Write me a poem about the spanish steps'
    )
    let poem = ''
    for await (const chunk of stream) {
        poem += chunk
        console.clear()
        console.log(poem)
    }
}

// Call the functions in sequence to ensure session is created before using it
async function runTest() {
    await downloadModel()
    await createSession()
    await createPrompt()
    //await promptStreaming()
    await session.destroy()
}

runTest()
