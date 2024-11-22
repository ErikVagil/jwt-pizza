import { sleep, check, group, fail } from 'k6'
import http from 'k6/http'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 5, duration: '30s' },
        { target: 15, duration: '1m' },
        { target: 10, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response

  group('Login and order - https://www.tokenzza.click/', function () {
    // Navigate
    response = http.get('https://www.tokenzza.click/', {
      headers: {
        accept: '*/*',
      },
    })
    sleep(34.5)

    const vars = {}

    // Login
    response = http.put(
      'https://pizza-service.tokenzza.click/api/auth',
      '{"email":"d@jwt.com","password":"diner"}',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: 'https://www.tokenzza.click',
        },
      }
    )
    if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
      console.log(response.body);
      fail('Login was *not* 200');
    }

    vars['token'] = response.json('token');

    sleep(3.6)

    // Menu
    response = http.get('https://pizza-service.tokenzza.click/api/order/menu', {
      headers: {
        accept: '*/*',
        authorization: `Bearer ${vars['token']}`,
        origin: 'https://www.tokenzza.click',
      },
    })

    // Franchise
    response = http.get('https://pizza-service.tokenzza.click/api/franchise', {
      headers: {
        accept: '*/*',
        authorization: `Bearer ${vars['token']}`,
        'content-type': 'application/json',
        origin: 'https://www.tokenzza.click',
      },
    })
    sleep(6.5)

    // Order pizza
    response = http.post(
      'https://pizza-service.tokenzza.click/api/order',
      '{"items":[{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"1","franchiseId":1}',
      {
        headers: {
          accept: '*/*',
          authorization: `Bearer ${vars['token']}`,
          'content-type': 'application/json',
          origin: 'https://www.tokenzza.click',
        },
      }
    )

    vars['jwt'] = response.json('jwt');

    sleep(1.6)

    // Verify token
    response = http.post(
      'https://pizza-factory.cs329.click/api/order/verify',
      `{"jwt":${vars['jwt']}}`,
      {
        headers: {
          accept: '*/*',
          authorization: `Bearer ${vars['token']}`,
          'content-type': 'application/json',
          origin: 'https://www.tokenzza.click',
        },
      }
    )
  })
}