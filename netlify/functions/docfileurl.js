exports.handler = async function(event, context) {
    const GRIST_SUBDOMAIN = process.env.GRIST_SUBDOMAIN;
    const DOC_ID = process.env.DOC_ID;
    const TABLE_ID = process.env.TABLE_ID;
    const API_KEY = process.env.API_KEY;

    const response = await fetch(`https://${GRIST_SUBDOMAIN}.getgrist.com/api/docs/${DOC_ID}/tables/${TABLE_ID}/data`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_KEY}`
        }
    });

    const data = await response.json();

    const documentId = event.pathParameters.documentId;
    const language = event.pathParameters.language;

    const row = data.find(row => row['Document_ID'] === documentId && row['Language'].includes(language) && row['Is_most_recent_final_file']);

    return {
        statusCode: 301,
        headers: {
            Location: row['URL']
        },
        body: ''
    };
};
