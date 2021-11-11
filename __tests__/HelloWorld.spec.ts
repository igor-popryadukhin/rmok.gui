// src/components/__tests__/HelloWorld.spec.ts
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '../src/components/HelloWorld/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  test('отрисовывает props.msg, если они переданы', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })

    expect(wrapper.text()).toMatch(msg)
  })
})
