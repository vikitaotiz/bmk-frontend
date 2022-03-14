const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // {path: '', component: () => import('pages/Home.vue')},
      // {path: '', component: () => import('pages/Dashboard.vue')},
      {path: '/Dashboard2', component: () => import('pages/Dashboard2.vue')},
      {path: '/Profile', component: () => import('pages/UserProfile.vue')},
      {path: '/Map', component: () => import('pages/Map.vue')},
      {path: '/MapMarker', component: () => import('pages/MapMarker.vue')},
      {path: '/TreeTable', component: () => import('pages/TreeTable.vue')},
      {path: '/StreetView', component: () => import('pages/StreetView.vue')},
      {path: '/Cards', component: () => import('pages/Cards.vue')},
      {path: '/Tables', component: () => import('pages/Tables.vue')},
      {path: '/Contact', component: () => import('pages/Contact.vue')},
      {path: '/Checkout', component: () => import('pages/Checkout.vue')},
      {path: '/Ecommerce', component: () => import('pages/ProductCatalogues.vue')},
      {path: '/Pagination', component: () => import('pages/Pagination.vue')},
      {path: '/Charts', component: () => import('pages/Charts.vue')},
      {path: '/Calendar', component: () => import('pages/Calendar.vue')},
      {path: '/Directory', component: () => import('pages/Directory.vue')},
      {path: '/Footer', component: () => import('pages/Footer.vue')},
      {path: '/CardHeader', component: () => import('pages/CardHeader.vue')},

      {path: '/PropertyCategories', component: () => import('pages/PropertyCategories.vue')},
      {path: '/CarCategories', component: () => import('pages/CarCategories.vue')},
      {path: '/Countries', component: () => import('pages/Countries.vue')},
      {path: '/Cities', component: () => import('pages/Cities.vue')},
      {path: '/Addresses', component: () => import('pages/Addresses.vue')},
      {path: '/Cars', component: () => import('pages/Cars.vue')},
      {path: '/Properties', component: () => import('pages/Properties.vue')},
      {path: '/Users', component: () => import('pages/Users.vue')},
      {path: '/Roles', component: () => import('pages/Roles.vue')},

      // Not completed yet
      // {path: '/Taskboard', component: () => import('pages/TaskBoard.vue')},
    ]
  },

  {
    path: '',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
    {path: '', component: () => import('pages/Home1.vue')},
    {
      path: '/PropertyCategory/:id', component: () => import('pages/PropertyCategory.vue')
    },
    {
      path: '/Account/:id', component: () => import('pages/Account.vue')
    },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  
  // {
  //   path: '',
  //   component: () => import('pages/Home1.vue')
  // },
  // {
  //   path: '/PropertyCategory/:id', component: () => import('pages/PropertyCategory.vue')
  // },
  // {
  //   path: '/Account/:id', component: () => import('pages/Account.vue')
  // },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  },
  {path: '/Login', component: () => import('pages/Login.vue')},
  {path: '/Register', component: () => import('pages/Register.vue')},
  {
    path: '/Mail',
    component: () => import('layouts/Mail.vue')
  },
  {
    path: '/Maintenance',
    component: () => import('pages/Maintenance.vue')
  },
  {
    path: '/Pricing',
    component: () => import('pages/Pricing.vue')
  },
  {
    path: '/Login-1',
    component: () => import('pages/Login-1.vue')
  },
  {
    path: '/Lock',
    component: () => import('pages/LockScreen.vue')
  },
  {
    path: '/Lock-2',
    component: () => import('pages/LockScreen-2.vue')
  }
]

export default routes
