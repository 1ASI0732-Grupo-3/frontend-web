import { environment } from '../../../enviroments/enviroment';

export const API_ENDPOINTS = {
  BASE_URL: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1',
  AUTH: {
    LOGIN: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/user/sign-in',
    REGISTER: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/user/sign-up'
  },
  ANIMALS: {
    LIST: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/bovines',
    CREATE: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/bovines',
    UPDATE: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/bovines/${id}`,
    DELETE: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/bovines/${id}`,
    DETAIL: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/bovines/${id}`
  },
  STABLES: {
    LIST: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/stables',
    CREATE: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/stables',
    UPDATE: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/stables/${id}`,
    DELETE: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/stables/${id}`
  },
  VACCINES: {
    LIST: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/vaccines',
    CREATE: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/vaccines',
    UPDATE: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/vaccines/${id}`,
    DELETE: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/vaccines/${id}`
  },
  CAMPAIGNS: {
    LIST: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/campaigns',
    CREATE: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/campaigns',
    UPDATE: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/campaigns/${id}`,
    DELETE: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/campaigns/${id}`,
    DETAIL: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/campaigns/${id}`
  },
  STAFF: {
    LIST: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/staff',
    CREATE: 'https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/staff',
    UPDATE: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/staff/${id}`,
    DELETE: (id: string) => `https://vacappexpbackend-cahacmh4atbxd0g3.brazilsouth-01.azurewebsites.net/api/v1/staff/${id}`
  }
};

export function createEndpointUrls(baseUrl: string) {
  return {
    auth: {
      login: `${baseUrl}/user/sign-in`,
      register: `${baseUrl}/user/sign-up`
    },
    animals: {
      list: `${baseUrl}/bovines`,
      create: `${baseUrl}/bovines`,
      update: (id: string) => `${baseUrl}/bovines/${id}`,
      delete: (id: string) => `${baseUrl}/bovines/${id}`,
      detail: (id: string) => `${baseUrl}/bovines/${id}`
    },
    stables: {
      list: `${baseUrl}/stables`,
      create: `${baseUrl}/stables`,
      update: (id: string) => `${baseUrl}/stables/${id}`,
      delete: (id: string) => `${baseUrl}/stables/${id}`
    },
    vaccines: {
      list: `${baseUrl}/vaccines`,
      create: `${baseUrl}/vaccines`,
      update: (id: string) => `${baseUrl}/vaccines/${id}`,
      delete: (id: string) => `${baseUrl}/vaccines/${id}`
    },
    campaigns: {
      list: `${baseUrl}/campaigns`,
      create: `${baseUrl}/campaigns`,
      update: (id: string) => `${baseUrl}/campaigns/${id}`,
      delete: (id: string) => `${baseUrl}/campaigns/${id}`,
      detail: (id: string) => `${baseUrl}/campaigns/${id}`
    },
    staff: {
      list: `${baseUrl}/staff`,
      create: `${baseUrl}/staff`,
      update: (id: string) => `${baseUrl}/staff/${id}`,
      delete: (id: string) => `${baseUrl}/staff/${id}`
    }
  };
}
