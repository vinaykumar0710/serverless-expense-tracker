let nextId = 26;

export const generateId = () => String(nextId++);

export const mockExpenses = [
  { id: '1', title: 'Grocery Shopping', category: 'food', amount: 85.50, date: '2026-07-01', notes: 'Weekly groceries from Whole Foods' },
  { id: '2', title: 'Uber to Airport', category: 'travel', amount: 42.00, date: '2026-07-01', notes: 'Airport ride for business trip' },
  { id: '3', title: 'Netflix Subscription', category: 'entertainment', amount: 15.99, date: '2026-06-30', notes: 'Monthly streaming subscription' },
  { id: '4', title: 'Electric Bill', category: 'bills', amount: 124.75, date: '2026-06-30', notes: 'June electricity bill' },
  { id: '5', title: 'Running Shoes', category: 'shopping', amount: 129.99, date: '2026-06-29', notes: 'Nike Air Max from the mall' },
  { id: '6', title: 'Doctor Visit', category: 'healthcare', amount: 75.00, date: '2026-06-28', notes: 'Annual checkup copay' },
  { id: '7', title: 'Online Course', category: 'education', amount: 49.99, date: '2026-06-28', notes: 'Udemy React masterclass' },
  { id: '8', title: 'Coffee & Snacks', category: 'food', amount: 12.40, date: '2026-06-27', notes: 'Starbucks with colleagues' },
  { id: '9', title: 'Gas Station', category: 'travel', amount: 55.00, date: '2026-06-27', notes: 'Filled up the tank' },
  { id: '10', title: 'Phone Case', category: 'shopping', amount: 29.99, date: '2026-06-26', notes: 'New protective case' },
  { id: '11', title: 'Internet Bill', category: 'bills', amount: 79.99, date: '2026-06-25', notes: 'Monthly internet service' },
  { id: '12', title: 'Movie Tickets', category: 'entertainment', amount: 32.00, date: '2026-06-25', notes: 'Two tickets for evening show' },
  { id: '13', title: 'Lunch Meeting', category: 'food', amount: 45.80, date: '2026-06-24', notes: 'Business lunch at Italian restaurant' },
  { id: '14', title: 'Gym Membership', category: 'healthcare', amount: 49.99, date: '2026-06-24', notes: 'Monthly gym subscription' },
  { id: '15', title: 'Flight Booking', category: 'travel', amount: 350.00, date: '2026-06-23', notes: 'Round trip to San Francisco' },
  { id: '16', title: 'Book Purchase', category: 'education', amount: 24.99, date: '2026-06-22', notes: 'Clean Architecture by Robert Martin' },
  { id: '17', title: 'Dinner Out', category: 'food', amount: 67.50, date: '2026-06-21', notes: 'Anniversary dinner at steakhouse' },
  { id: '18', title: 'Water Bill', category: 'bills', amount: 45.00, date: '2026-06-20', notes: 'Monthly water bill' },
  { id: '19', title: 'Concert Tickets', category: 'entertainment', amount: 120.00, date: '2026-06-19', notes: 'Live music event downtown' },
  { id: '20', title: 'Prescription Meds', category: 'healthcare', amount: 35.50, date: '2026-06-18', notes: 'Monthly prescription' },
  { id: '21', title: 'Taxi Ride', category: 'travel', amount: 18.50, date: '2026-06-17', notes: 'Quick ride to downtown' },
  { id: '22', title: 'Electronics', category: 'shopping', amount: 199.99, date: '2026-06-16', notes: 'Wireless headphones' },
  { id: '23', title: 'Parking Fee', category: 'other', amount: 15.00, date: '2026-06-15', notes: 'Downtown parking garage' },
  { id: '24', title: 'Breakfast', category: 'food', amount: 18.75, date: '2026-06-14', notes: 'Brunch with friends' },
  { id: '25', title: 'Workshop Fee', category: 'education', amount: 150.00, date: '2026-06-13', notes: 'Cloud computing workshop' },
];
