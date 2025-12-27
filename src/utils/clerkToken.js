// utils/clerkToken.js
export const getClerkToken = async () => {
  if (!window.Clerk || !window.Clerk.session) return null;
  return await window.Clerk.session.getToken({ template: "backend-access",});
};

