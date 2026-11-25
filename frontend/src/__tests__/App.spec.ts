import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  it('renders the logo and navigation links', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('NOVO')

    const links = wrapper.findAll('nav a').map((link) => link.text())
    expect(links).toEqual(['Home', 'Women', 'Men'])
  })
})
