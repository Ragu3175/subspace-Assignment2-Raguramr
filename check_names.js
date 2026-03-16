async function checkNames() {
  const names = ['todos', 'todo', 'Todos', 'Todo'];
  for (const name of names) {
    const query = `query { ${name} { id } }`;
    try {
      const response = await fetch('https://dgmrckuwwovtmpahvqza.graphql.ap-south-1.nhost.run/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const result = await response.json();
      if (!result.errors) {
        console.log(`Success with: ${name}`);
        return;
      } else {
        console.log(`Failed with: ${name} - ${result.errors[0].message}`);
      }
    } catch (err) {
      console.error(`Error for ${name}:`, err.message);
    }
  }
}

checkNames();
