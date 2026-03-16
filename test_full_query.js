const GET_TODOS = `
  query GetTodos {
    todos(order_by: { created_at: desc }) {
      id
      title
      is_completed
    }
  }
`;

async function testFullQuery() {
  try {
    const response = await fetch('https://dgmrckuwwovtmpahvqza.graphql.ap-south-1.nhost.run/v1/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: GET_TODOS })
    });
    const result = await response.json();
    if (result.errors) {
      console.error('Errors:', JSON.stringify(result.errors, null, 2));
    } else {
      console.log('Success! Data:', JSON.stringify(result.data, null, 2));
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

testFullQuery();
