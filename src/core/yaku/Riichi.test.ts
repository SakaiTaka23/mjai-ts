import { describe, it } from "vitest"
import { Riichi } from "./Riichi"

describe('Basic Examples', () => {
    it('usage', () => {
        const riichi = new Riichi('112233456789m11s')
        console.log(riichi.calc())
    })
})
