export const CATEGORIES = [
  { id: 'food', name: 'Food', icon: 'UtensilsCrossed', color: '#F97316' },
  { id: 'travel', name: 'Travel', icon: 'Plane', color: '#3B82F6' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#A855F7' },
  { id: 'bills', name: 'Bills', icon: 'Receipt', color: '#EF4444' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Gamepad2', color: '#EC4899' },
  { id: 'healthcare', name: 'Healthcare', icon: 'Heart', color: '#22C55E' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: '#06B6D4' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: '#64748B' },
];

export const getCategoryById = (id) => CATEGORIES.find((c) => c.id === id);

export const getCategoryColor = (id) => {
  const cat = getCategoryById(id);
  return cat ? cat.color : '#64748B';
};
