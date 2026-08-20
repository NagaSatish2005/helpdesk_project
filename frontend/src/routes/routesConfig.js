export const publicRoutes = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
}

export const protectedRoutes = {
  dashboard: '/dashboard',
  tickets: '/tickets',
  createTicket: '/tickets/create',
  ticketDetail: '/tickets/:id',
  myTickets: '/my-tickets',
  profile: '/profile',
  editProfile: '/profile/edit',
}

export const adminRoutes = {
  users: '/admin/users',
  departments: '/admin/departments',
  reports: '/admin/reports',
  settings: '/admin/settings',
}
