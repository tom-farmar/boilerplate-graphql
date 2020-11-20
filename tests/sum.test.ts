import { sum } from '../src/utils/sum'
import { createTypeormConn } from '../src/utils/createTypeormConn'

beforeAll(async () => {
  await createTypeormConn()
})

test('sum tests', () => {
  expect(sum(1, 2)).toBe(3)
})
