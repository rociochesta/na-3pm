export async function loadGroupMembers() {
  const res = await fetch("/data/groupMembers.json");
  if (!res.ok) throw new Error("Failed to load group members JSON");
  return await res.json();
}
