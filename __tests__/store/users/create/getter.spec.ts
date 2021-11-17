
import getters from '../../../../src/store/users/create/getters'
import { State } from '../../../../src/store/users/create/state'

const state: State = {
  country_id: 10,
  email: 'email@example.com',
  first_name: 'Иван',
  group_id: 10,
  last_name: 'Иванов',
  login: 'ivanov',
  middle_name: 'Иванович',
  password: 'Sd243wdff433sS#2',
  phone: '+79250000000',
  role_id: 10
}

describe('Мутации модуля users/create', () => {
  test(`Геттер "country_id" возвращает "${state.country_id}"`, () => {
    expect(getters.country_id(state)).toBe(state.country_id)
  })

  test(`Геттер "email" возвращает "${state.email}"`, () => {
    expect(getters.email(state)).toBe(state.email)
  })

  test(`Геттер "first_name" возвращает "${state.first_name}"`, () => {
    expect(getters.first_name(state)).toBe(state.first_name)
  })

  test(`Геттер "last_name" возвращает "${state.last_name}"`, () => {
    expect(getters.last_name(state)).toBe(state.last_name)
  })

  test(`Геттер "middle_name" возвращает "${state.middle_name}"`, () => {
    expect(getters.middle_name(state)).toBe(state.middle_name)
  })

  test(`Геттер "login" возвращает "${state.login}"`, () => {
    expect(getters.login(state)).toBe(state.login)
  })

  test(`Геттер "password" возвращает "${state.password}"`, () => {
    expect(getters.password(state)).toBe(state.password)
  })

  test(`Геттер "phone" возвращает "${state.phone}"`, () => {
    expect(getters.phone(state)).toBe(state.phone)
  })

  test(`Геттер "group_id" возвращает "${state.group_id}"`, () => {
    expect(getters.group_id(state)).toBe(state.group_id)
  })

  test(`Геттер "role_id" возвращает "${state.role_id}"`, () => {
    expect(getters.role_id(state)).toBe(state.role_id)
  })
})
