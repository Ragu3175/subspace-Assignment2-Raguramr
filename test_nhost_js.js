const { NhostClient } = require('@nhost/nhost-js');

const nhost = new NhostClient({
  subdomain: 'dgmrckuwwovtmpahvqza',
  region: 'ap-south-1'
});

const GET_TODOS = `
  query GetTodos {
    todos {
      id
    }
  }
`;

async function testNhost() {
  try {
    console.log('Nhost URL:', nhost.graphql.getUrl());
    const res = await nhost.graphql.request(GET_TODOS);
    if (res.error) {
      console.log('Error:', JSON.stringify(res.error, null, 2));
    } else {
      console.log('Data:', JSON.stringify(res.data, null, 2));
    }
    
    // Test singular
    const res2 = await nhost.graphql.request('query { todo { id } }');
    console.log('Singular Error:', res2.error ? res2.error[0].message : 'None');

  } catch (err) {
    console.error('Fatal:', err.message);
  }
}

testNhost();
