async function testUrls() {
  const urls = [
    'https://dgmrckuwwovtmpahvqza.graphql.ap-south-1.nhost.run/v1/graphql',
    'https://dgmrckuwwovtmpahvqza.nhost.run/v1/graphql',
    'https://dgmrckuwwovtmpahvqza.graphql.nhost.run/v1/graphql'
  ];
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'query { __typename }' })
      });
      console.log(`URL: ${url} - Status: ${response.status}`);
      const text = await response.text();
      console.log(`Response: ${text.substring(0, 100)}`);
    } catch (err) {
      console.error(`Error for ${url}:`, err.message);
    }
  }
}

testUrls();
