const maxStars = 100
function random (min, max) {
    if (arguments.length < 2) {
        max = min
        min = 0
    }
    if (min > max) {
        let hold = max
        max = min
        min = hold
    }
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function maxOrbit (x, y) {
    let max = Math.max(x, y)
    let diameter = Math.round(Math.sqrt(max * max + max * max))
    return diameter / 2
}

export default class {
    constructor (w, h, ctx, ctx2, canvas2) {
        this.ctx = ctx
        this.ctx2 = ctx2
        this.canvas2 = canvas2
        this.orbitRadius = random(maxOrbit(w, h))
        this.radius = random(60, this.orbitRadius) / 15
        if (this.radius > 19) {
            this.radius = 19
        }
        this.orbitX = w / 2
        this.orbitY = h / 2
        this.timePassed = random(0, maxStars)
        this.speed = random(this.orbitRadius) / 800000
        this.alpha = random(2, 10) / 10
    }
    draw () {
        let x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX
        let y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY
        // let twinkle = random(10)
        // if (twinkle === 1 && this.alpha > 0) {
        //     this.alpha -= 0.05
        // } else if (twinkle === 2 && this.alpha < 1) {
        //     this.alpha += 0.05
        // }
        this.ctx.globalAlpha = this.alpha
        this.ctx.drawImage(this.canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius)
        this.timePassed += this.speed
    }
}
