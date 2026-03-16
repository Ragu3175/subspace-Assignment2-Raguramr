async function checkNames() {
  const names = ['todos', 'todo'];
  for (const name of names) {
    const query = `query { ${name} { id } }`;
    try {
      const response = await fetch('https://dgmrckuwwovtmpahvqza.graphql.ap-south-1.nhost.run/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const text = await response.text();
      console.log(`Response for ${name}:`, text);
    } catch (err) {
      console.error(`Error for ${name}:`, err.message);
    }
  }
}

checkNames();
