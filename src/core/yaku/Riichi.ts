/*
 * Copyright (C) https://github.com/takayama-lily/riichi
 */
import { checkAll, findAllAgariPatterns } from './Agari'
import { hairi } from './Shanten'
import { YAKU } from './Yaku'
import { HaiArr } from './YakuTypes'

const MPSZ = ['m', 'p', 's', 'z']
const KAZE = ['東', '南', '西', '北', '白', '發', '中']

const ceil10 = (num: number)=>{
    return Math.ceil(num/10)*10
}

const ceil100 = (num: number) => {
    return Math.ceil(num/100)*100
}

const isHai = (text: string)=>{
    return typeof text === 'string' && text.length === 2 && !isNaN(Number(text[0])) && MPSZ.includes(text[1])
}

const is19 = (text: string)=>{
    return isHai(text) && (text.includes('1') || text.includes('9') || text.includes('z'))
}

const isFuro = (arr: string[])=>{
    if (arr instanceof Array !== true || arr.length > 4 || arr.length < 2)
        return false
    let set = new Set(arr)
    if (set.size === 1)
        return isHai(arr[0])
    else {
        if (set.size !== 3)
            return false
        let minus1 = parseInt(arr[1]) - parseInt(arr[0])
        let minus2 = parseInt(arr[2]) - parseInt(arr[1])
        if (minus1 !== minus2 || minus1 !== 1)
            return false
    }
    return true
}

/**
 * string型牌 → array型牌
 * 赤dora抽出
 */
const parse = (text: string)=>{
    let tmp: string[] = []
    let aka = 0
    for (let v of text) {
        if (!isNaN(Number(v))) {
            if (v === '0')
                v = '5', aka++
            tmp.push(v)
        }
        if (MPSZ.includes(v)) {
            for (let k in tmp)
                if (!isNaN(Number(tmp[k])))
                    tmp[k] += v
        }
    }
    let res = []
    for (let v of tmp)
        if (isNaN(Number(v)))
            res.push(v)
    return {'res': tmp, 'aka': aka}
}

class Riichi {
    hai: string[]
    haiArray: HaiArr
    furo: string[][]
    agari: string
    dora: string[]
    extra: string
    isTsumo: boolean
    isOya: boolean
    bakaze: number
    jikaze: number
    aka: number
    agariPatterns: any[]
    currentPattern: any
    tmpResult: any
    finalResult: any
    allLocalEnabled: boolean
    localEnabled: string[]
    disabled: string[]
    allowWyakuman: boolean
    allowKuitan: boolean
    allowAka: boolean
    hairi: boolean

    /**
     * @param string data
     */
    constructor(data: string) {
        this.hai = []
        this.haiArray = [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ]
        this.furo = []
        this.agari = ''
        this.dora = []
        this.extra = ''
        this.isTsumo = true
        this.isOya = false
        this.bakaze = 1
        this.jikaze = 2
        this.aka = 0
        this.agariPatterns = []
        this.currentPattern = undefined
        this.tmpResult = {
            'isAgari': false,
            'yakuman': 0,
            'yaku': {},
            'han': 0,
            'fu': 0,
            'ten': 0,
            'name': '',
            'text': '',
            'oya': [0, 0, 0],
            'ko': [0, 0, 0],
            'error': true
        }
        this.finalResult = undefined

        this.allLocalEnabled = false
        this.localEnabled = []
        this.disabled = []
        this.allowWyakuman = true
        this.allowKuitan = true
        this.allowAka = true
        this.hairi = true

        // 初期設定
        if (typeof data !== 'string')
            return
        data = data.toLowerCase()
        let arr = data.split('+')
        let hai = arr.shift()!
        for (let v of arr) {
            if (!v.includes('m') && !v.includes('p') && !v.includes('s') && !v.includes('z'))
                this.extra = v
            else if (v[0] === 'd')
                this.dora = parse(v.substr(1)).res
            else if (isHai(v)) {
                hai += v
                this.isTsumo = false
            } else {
                let tmp = []
                for (let vv of v) {
                    if (MPSZ.includes(vv)) {
                        for (let k in tmp)
                            tmp[k] += vv
                        if (isFuro(tmp))
                            this.furo.push(tmp.sort())
                        tmp = []
                    } else {
                        if (vv === '0')
                            vv = '5', this.aka++
                        tmp.push(vv)
                    }
                }
            }
        }

        let tmp = parse(hai)
        this.hai = tmp.res
        this.aka += tmp.aka
        this.agari = this.hai.slice(-1)[0]

        if (this.hai.length % 3 === 0)
            return
        if (this.hai.length + this.furo.length * 3 > 14)
            return

        // array型手牌 → 複合array型 転換
        for (let v of this.hai) {
            let n = parseInt(v)
            let i = MPSZ.indexOf(v.replace(String(n), ''))
            this.haiArray[i][n-1]++
        }

        // 場風自風設定
        let kaze = this.extra.replace(/[a-z]/g, '')
        if (kaze.length === 1)
            this.jikaze = parseInt(kaze)
        if  (kaze.length > 1) {
            this.bakaze = parseInt(kaze[0])
            this.jikaze = parseInt(kaze[1])
        }
        if (this.jikaze === 1)
            this.isOya = true
        else
            this.isOya = false

        this.tmpResult.error = false
        this.finalResult = JSON.parse(JSON.stringify(this.tmpResult))
    }

    /**
     * 門前判定
     */
    isMenzen() {
        for (let v of this.furo)
            if (v.length > 2)
                return false
        return true
    }

    /**
     * dora枚数計算
     */
    calcDora() {
        if (!this.tmpResult.han)
            return
        let dora = 0
        for (let v of this.hai) {
            for (let vv of this.dora) {
                if (v === vv)
                    dora++
            }
        }
        for (let v of this.furo) {
            if (v.length === 2)
                v = v.concat(v)
            for (let vv of v) {
                for (let vvv of this.dora) {
                    if (vvv === vv)
                        dora++
                }
            }
        }
        if (dora) {
            this.tmpResult.han += dora
            this.tmpResult.yaku['ドラ'] = dora + '飜'
        }
        if (this.allowAka && this.aka) {
            this.tmpResult.han += this.aka
            this.tmpResult.yaku['赤ドラ'] = this.aka + '飜'
        }
    }

    /**
     * 符計算
     */
    calcFu() { 
        let fu = 0
        if (this.tmpResult.yaku['七対子']) {
            fu = 25
        } else if (this.tmpResult.yaku['平和']) {
            fu = this.isTsumo ? 20 : 30
        } else {
            fu = 20
            let hasAgariFu = false
            if (!this.isTsumo && this.isMenzen())
                fu += 10
            for (let v of this.currentPattern) {
                if (typeof v === 'string') {
                    if (v.includes('z')) 
                        for (let vv of [this.bakaze, this.jikaze, 5, 6, 7])
                            if (parseInt(v) === vv)
                                fu += 2
                    if (this.agari === v)
                        hasAgariFu = true
                } else {
                    if (v.length === 4)
                        fu += is19(v[0]) ? 16 : 8
                    else if (v.length === 2)
                        fu += is19(v[0]) ? 32 : 16
                    else if (v.length === 1)
                        fu += is19(v[0]) ? 8 : 4
                    else if (v.length === 3 && v[0] === v[1])
                        fu += is19(v[0]) ? 4 : 2
                    else if (!hasAgariFu) {
                        if (v[1] === this.agari)
                            hasAgariFu = true
                        else if (v[0] === hasAgariFu && parseInt(v[2]) === 9)
                            hasAgariFu = true
                        else if (v[2] === hasAgariFu && parseInt(v[0]) === 1)
                            hasAgariFu = true
                    }
                }
            }

            if (hasAgariFu)
                fu += 2
            if (this.isTsumo)
                fu += 2

            fu = ceil10(fu)
            if (fu < 30)
                fu = 30
        }
        this.tmpResult.fu = fu
    }

    /**
     * 点数計算
     */
    calcTen() {
        this.tmpResult.name = ''
        let base
        this.tmpResult.text = `(${KAZE[this.bakaze]}場`
        this.tmpResult.text += KAZE[this.jikaze] + '家)'
        this.tmpResult.text += this.isTsumo ? '自摸' : '栄和'
        if (this.tmpResult.yakuman) {
            base = 8000 * this.tmpResult.yakuman
            this.tmpResult.name = this.tmpResult.yakuman > 1 ? (this.tmpResult.yakuman + '倍役満') : '役満'
        } else {
            if (!this.tmpResult.han)
                return
            base = this.tmpResult.fu * Math.pow(2, this.tmpResult.han + 2)
            this.tmpResult.text += ' ' + this.tmpResult.fu + '符' + this.tmpResult.han + '飜'
            if (base > 2000) {
                if (this.tmpResult.han >= 13) {
                    base = 8000
                    this.tmpResult.name = '数え役満'
                } else if (this.tmpResult.han >= 11) {
                    base = 6000
                    this.tmpResult.name = '三倍満'
                } else if (this.tmpResult.han >= 8) {
                    base = 4000
                    this.tmpResult.name = '倍満'
                } else if (this.tmpResult.han >= 6) {
                    base = 3000
                    this.tmpResult.name = '跳満'
                } else {
                    base = 2000
                    this.tmpResult.name = '満貫'
                }
            }
        }
        this.tmpResult.text += (this.tmpResult.name ? ' ' : '') + this.tmpResult.name
        if (this.isTsumo) {
            this.tmpResult.oya = [ceil100(base*2),ceil100(base*2),ceil100(base*2)]
            this.tmpResult.ko = [ceil100(base*2),ceil100(base),ceil100(base)]
        } else {
            this.tmpResult.oya = [ceil100(base*6)]
            this.tmpResult.ko = [ceil100(base*4)]
        }
        this.tmpResult.ten = this.isOya ? eval(this.tmpResult.oya.join('+')) : eval(this.tmpResult.ko.join('+'))
        this.tmpResult.text += ' ' + this.tmpResult.ten + '点'
        if (this.isTsumo) {
            this.tmpResult.text += '('
            if (this.isOya)
                this.tmpResult.text += this.tmpResult.oya[0] + 'all'
            else
                this.tmpResult.text += this.tmpResult.ko[0] + ',' + this.tmpResult.ko[1]
            this.tmpResult.text += ')'
        }

    }

    /**
     * 手役計算
     */
    calcYaku() {
        this.tmpResult.yaku = {}
        this.tmpResult.yakuman = 0
        this.tmpResult.han = 0
        for (let k in YAKU) {
            let v = YAKU[k as keyof typeof YAKU]
            if (this.disabled.includes(k))
                continue
            if (v.isLocal && !this.allLocalEnabled && !this.localEnabled.includes(k))
                continue
            if (this.tmpResult.yakuman && !v.yakuman)
                continue
            if (v.isMenzenOnly && !this.isMenzen())
                continue
            if (v.check(this)) {
                if (v.yakuman) {
                    let n = this.allowWyakuman ? v.yakuman : 1
                    this.tmpResult.yakuman += n
                    this.tmpResult.yaku[k] = n > 1 ? 'ダブル役満' : '役満'
                } else {
                    let n = v.han!
                    if (v.isFuroMinus && !this.isMenzen())
                        n--
                    this.tmpResult.yaku[k] = n + '飜'
                    this.tmpResult.han += n
                }
            }
        }
    }

    // api exports ↓ ----------------------------------------------------------------------------------------------------

    disableWyakuman() { //二倍役満禁止
        this.allowWyakuman = false
    }
    disableKuitan() { //喰断禁止
        this.allowKuitan = false
    }
    disableAka() { //赤dora禁止
        this.allowAka = false
    }
    enableLocalYaku(name: '大七星' | '人和') { //指定local役有効
        this.localEnabled.push(name)
    }
    disableYaku(name: string) { //指定役禁止
        this.disabled.push(name)
    }

    // supported local yaku list
    // 大七星 役満(字一色別)
    // 人和 役満
    // 

    disableHairi() {
        this.hairi = false
    }

    /**
     * main
     */
    calc() {
        if (this.tmpResult.error) {
            return this.tmpResult
        }
        this.tmpResult.isAgari = checkAll(this.haiArray)
        if (!this.tmpResult.isAgari || this.hai.length + this.furo.length * 3 !== 14) {
            if (this.hairi) {
                this.tmpResult.hairi = hairi(this.haiArray)
                this.tmpResult.hairi7and13 = hairi(this.haiArray, true)
            }
            return this.tmpResult
        }

        this.finalResult.isAgari = true
        if (this.extra.includes('o'))
            this.allLocalEnabled = true
        
        this.agariPatterns = findAllAgariPatterns(this.haiArray)
        if (!this.agariPatterns.length)
            this.agariPatterns.push([])
        for (let v of this.agariPatterns) {
            if (!this.isTsumo) {
                for (let k in v) {
                    let vv = v[k]
                    if (vv.length === 1 && vv[0] === this.agari) {
                        let i = MPSZ.indexOf(this.agari[1])
                        if (this.haiArray[i][parseInt(this.agari)-1] < 4)
                            v[k] = [vv[0], vv[0], vv[0]]
                    }
                }
            }
            this.currentPattern = v.concat(this.furo)
            this.calcYaku()
            if (!this.tmpResult.yakuman && !this.tmpResult.han)
                continue
            if (this.tmpResult.han) {
                this.calcDora()
                this.calcFu()
            }
            this.calcTen()
            if (this.tmpResult.ten > this.finalResult.ten)
                this.finalResult = JSON.parse(JSON.stringify(this.tmpResult))
            else if (this.tmpResult.ten === this.finalResult.ten && this.tmpResult.han > this.finalResult.han)
                this.finalResult = JSON.parse(JSON.stringify(this.tmpResult))
        }

        if (!this.finalResult.ten)
            this.finalResult.text = '無役'
        return this.finalResult
    }
}

export { Riichi }
