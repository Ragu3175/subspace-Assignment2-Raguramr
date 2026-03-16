const query = `
  query {
    __schema {
      queryType {
        fields {
          name
        }
      }
    }
  }
`;

async function checkSchema() {
  try {
    const response = await fetch('https://dgmrckuwwovtmpahvqza.graphql.ap-south-1.nhost.run/v1/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const result = await response.json();
    if (result.errors) {
      console.error('Errors:', JSON.stringify(result.errors, null, 2));
    } else {
      const fields = result.data.__schema.queryType.fields.map(f => f.name);
      console.log('Available fields in query_root:', fields.filter(f => !f.startsWith('__')));
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

checkSchema();
