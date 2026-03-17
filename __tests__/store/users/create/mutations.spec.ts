
import mutations from './../../../../src/store/users/create/mutations'
import { State } from './../../../../src/store/users/create/state'

const state: State = {
  country_id: 0,
  email: '',
  first_name: '',
  group_id: 0,
  last_name: '',
  login: '',
  middle_name: '',
  password: '',
  phone: '',
  role_id: 0
}

describe('Мутации модуля users/create', () => {
  test('Мутация "country_id" заполняет данные "10"', () => {
    mutations.country_id(state, 10)
    expect(state.country_id).toBe(10)
  })

  test('Мутация "email" заполняет данные "email@example.com"', () => {
    mutations.email(state, 'email@example.com')
    expect(state.email).toBe('email@example.com')
  })

  test('Мутация "first_name" заполняет данные "Иван"', () => {
    mutations.first_name(state, 'Иван')
    expect(state.first_name).toBe('Иван')
  })

  test('Мутация "last_name" заполняет данные "Иванов"', () => {
    mutations.last_name(state, 'Иванов')
    expect(state.last_name).toBe('Иванов')
  })

  test('Мутация "middle_name" заполняет данные "Иванович"', () => {
    mutations.middle_name(state, 'Иванович')
    expect(state.middle_name).toBe('Иванович')
  })

  test('Мутация "login" заполняет данные "ivanov.ivan"', () => {
    mutations.login(state, 'ivanov.ivan')
    expect(state.login).toBe('ivanov.ivan')
  })

  test('Мутация "password" заполняет данные "Sd243wdff433sS#2"', () => {
    mutations.password(state, 'Sd243wdff433sS#2')
    expect(state.password).toBe('Sd243wdff433sS#2')
  })

  test('Мутация "phone" заполняет данные "+79250000000"', () => {
    mutations.phone(state, '+79250000000')
    expect(state.phone).toBe('+79250000000')
  })

  test('Мутация "group_id" заполняет данные "54"', () => {
    mutations.group_id(state, 54)
    expect(state.group_id).toBe(54)
  })

  test('Мутация "role_id" заполняет данные "10"', () => {
    mutations.role_id(state, 10)
    expect(state.role_id).toBe(10)
  })
})
