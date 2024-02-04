async function onInvite(email: string, role: 'member' | 'owner') {
  const response = await fetch('/api/teams/invite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role }),
  });

  const body = await response.json();

  return body;
}
