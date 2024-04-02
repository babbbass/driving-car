class Car {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.speed = 0
    this.acceleration = 0.2
    this.maxSpeed = 3
    this.maxSpeedReverse = -this.maxSpeed / 2
    this.friction = 0.05
    this.angle = 0

    this.controls = new Controls()
  }

  update() {
    this.#move()
  }

  #move() {
    if (this.speed !== 0) {
      this.flip = this.speed < 0 ? -1 : 1
      if (this.controls.left) {
        this.angle -= 0.03 * this.flip
      }
      if (this.controls.right) {
        this.angle += 0.03 * this.flip
      }
    }
    if (this.controls.forward) {
      this.speed += this.acceleration
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration
    }

    if (this.speed >= this.maxSpeed) {
      this.speed = this.maxSpeed
    }

    if (this.speed <= this.maxSpeedReverse) {
      this.speed = this.maxSpeedReverse
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
    this.y -= Math.cos(this.angle) * this.speed
    this.x += Math.sin(this.angle) * this.speed
  }

  draw(ctx) {
    //ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.beginPath()
    ctx.rect(
      //position
      -this.width / 2,
      -this.height / 2,
      //size
      this.width,
      this.height
    )
    ctx.fill()
    ctx.restore()
  }
}
