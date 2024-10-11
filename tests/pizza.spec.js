import { test, expect } from 'playwright-test-coverage';

test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});

test('static pages', async ({ page }) => {
  // Home page
  await page.goto('/');

  // Franchise page
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByText('So you want a piece of the')).toBeVisible();

  // Register page
  await page.getByRole('link', { name: 'Register' }).click();
  await expect(page.getByPlaceholder('Full name')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();

  // About page
  await page.goto('/');
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByText('The secret sauce')).toBeVisible();

  // History page
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
  
  // Docs page
  await page.goto('/docs');
  await expect(page.getByText('JWT Pizza API')).toBeVisible();

  // Page not found
  await page.goto('/404');
  await expect(page.getByText('Oops')).toBeVisible();
});

test('register and logout', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'POST') {
      const registerReq = { name: 'a', email: 'd@jwt.com', password: 'a' };
      const registerRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(registerReq);
      await route.fulfill({ json: registerRes });
    } else if (route.request().method() === 'DELETE') {
      expect(route.request().method()).toBe('DELETE');
      expect(await route.request().headerValue('Authorization')).toMatch('Bearer abcdef');
      await route.fulfill({ json: { message: 'logout successful' } });
    }
  });

  // Home page
  await page.goto('/');

  // Test register
  await page.getByRole('link', { name: 'Register' }).click();

  await page.getByPlaceholder('Full name').click();
  await page.getByPlaceholder('Full name').fill('a');
  await page.getByPlaceholder('Full name').press('Tab');

  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');

  await page.getByPlaceholder('Password').fill('a');

  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();

  // Test logout
  await page.goto('/');
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
});

test('admin', async ({ page }) => {
  let isFirstGetCall = true;
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'a', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() === 'GET') {
      if (isFirstGetCall) {
        await route.fulfill({ json: [{ name: 'base', admins: [{ email: 'b@jwt.com', id: 15, name: 'b'}], id: 1 , stores: [] }] })
      } else {
        await route.fulfill({ json: [{ name: 'test', admins: [{ email: 'a@jwt.com', id: 3, name: 'a'}], id: 2 , stores: [] }]})
      }
    } else if (route.request().method() === 'POST') {
      const createReq = { name: 'test', admins: [{ email: 'a@jwt.com' }]};
      const createRes = { name: 'test', admins: [{ email: 'a@jwt.com', id: 3, name: 'a'}], id: 2 };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(createReq);
      await route.fulfill({ json: createRes });
    }
  });

  // Home page
  await page.goto('/');

  // Login as admin
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Go to dashboard and create/delete franchise
  await page.getByRole('link', { name: 'Admin' }).click();
  isFirstGetCall = false;
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByText('Create franchise', { exact: true })).toBeVisible();
  await page.getByPlaceholder('franchise name').click();
  await page.getByPlaceholder('franchise name').fill('test');
  await page.getByPlaceholder('franchisee admin email').click();
  await page.getByPlaceholder('franchisee admin email').fill('a@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'a' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('create store', async ({ page }) => {
  let isFirstGetCall = true;
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'a', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/franchise/*', async (route) => {
    if (route.request().method() === 'GET') {
      if (isFirstGetCall) {
        route.fulfill({ json: [{ name: 'test', admins: [{ email: 'a@jwt.com', id: 3, name: 'a'}], id: 2, stores: [] }] });
      } else {
        route.fulfill({ json: [
          { 
            name: 'test', 
            admins: [
              { email: 'a@jwt.com', id: 3, name: 'a'}
            ], 
            id: 2, 
            stores: [
              { id: 1, totalRevenue: 0, name: 'north' }
            ]
          }
        ] });
      }
    } else {
      route.fallback();
    }
  });
  
  await page.route('*/**/api/franchise/*/store', async (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({ json: { id: 1, franchiseId: 2, name: 'north' } });
    } else {
      route.fallback();
    }
  });
  
  await page.route('*/**/api/franchise/*/store/*', async (route) => {
    if (route.request().method() === 'DELETE') {
      route.fulfill({ json: { id: 1, franchiseId: 2, name: 'north' } });
    } else {
      route.fallback();
    }
  });

  await page.goto('/');

  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'login', exact: true }).click();

  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('test')).toBeVisible();
  isFirstGetCall = false;
  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByPlaceholder('store name').click();
  await page.getByPlaceholder('store name').fill('north');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'north' })).toBeVisible();
  await page.getByRole('row', { name: 'north 0 ₿ Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();
});