import { NhostClient } from '@nhost/nhost-js';

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
    // Try todos
    const res = await nhost.graphql.request(GET_TODOS);
    if (res.error) {
       console.log('Todos Error:', res.error[0].message);
    } else {
       console.log('Todos Success!');
    }
    
    // Try todo
    const res2 = await nhost.graphql.request('query { todo { id } }');
    if (res2.error) {
       console.log('Todo Error:', res2.error[0].message);
    } else {
       console.log('Todo Success!');
    }

  } catch (err) {
    console.error('Fatal:', err.message);
  }
}

testNhost();
