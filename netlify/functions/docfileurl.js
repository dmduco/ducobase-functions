const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { path } = event;
    const [documentId, language] = path.split('/').slice(-2); // Extract documentId and language from URL

    // Fetch data from Grist
    const response = await fetch(`https://{subdomain}.getgrist.com/api/docs/{docId}/tables/Documentfile/records?filter=Document_ID == "${documentId}" AND Language LIKE "%${language}%" AND Is_most_recent_final_file == true`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.API_KEY}` // Replace with your Grist API key
        }
    });

    if (!response.ok) {
        return { statusCode: response.status, body: response.statusText };
    }

    const data = await response.json();
    const record = data[0]; // Assuming the first record is the most recent one

    // Redirect to the URL of the file
    return {
        statusCode: 301,
        headers: {
            Location: record.URL
        }
    };
};
