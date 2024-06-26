class Car {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.speed = 0
    this.acceleration = 0.2
    this.maxSpeed = 3
    this.maxSpeedReverse = this.maxSpeed / 2
    this.friction = 0.05
    this.angle = 0
    this.damaged = false

    this.sensor = new Sensor(this)
    this.controls = new Controls()
  }

  update(roadBorders) {
    if (this.damaged) return
    this.#move()
    this.polygon = this.#createPolygon()
    this.damaged = this.#assessDamage(roadBorders)
    this.sensor.update(roadBorders)
  }

  #createPolygon() {
    const points = []

    const rad = Math.hypot(this.width, this.height) / 2
    const alpha = Math.atan2(this.width, this.height)
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    })

    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    })

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    })

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    })

    return points
  }

  #assessDamage(roadBorders) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true
      }
    }

    return false
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration
    }

    if (this.speed >= this.maxSpeed) {
      this.speed = this.maxSpeed
    }

    if (this.speed < -this.maxSpeedReverse) {
      this.speed = -this.maxSpeedReverse
    }

    if (this.speed > 0) {
      this.speed -= this.friction
    }

    if (this.speed < 0) {
      this.speed += this.friction
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0
    }
    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1
      if (this.controls.left) {
        this.angle += 0.03 * flip
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip
      }
    }
    this.x -= Math.sin(this.angle) * this.speed
    this.y -= Math.cos(this.angle) * this.speed
  }

  draw(ctx) {
    //ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ctx.save()
    // ctx.translate(this.x, this.y)
    // ctx.rotate(this.angle)
    // ctx.beginPath()
    // ctx.rect(
    //   //position
    //   -this.width / 2,
    //   -this.height / 2,
    //   //size
    //   this.width,
    //   this.height
    // )
    // ctx.fill()
    // ctx.restore()
    if (this.damaged) {
      ctx.fillStyle = "green"
    } else {
      ctx.fillStyle = "black"
    }
    ctx.beginPath()
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y)

    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
    }
    ctx.fill()

    this.sensor.draw(ctx)
  }
}
