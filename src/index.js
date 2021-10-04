import init, { World } from '../wasm/pkg/chainreaction.js'

async function main() {
    let initResult = await init()
    let memory = initResult.memory

    let world = World.new(16, 16)
    let data = new Uint8Array(
        memory.buffer,
        world.cells(),
        world.width() * world.height()
    )

    let state = {
        offsetX: 0,
        offsetY: 0,
        resolution: 32,
        world,
        data,
        mouseMoved: false,
        mouseDown: false,
        mouse: null,
    }
    window.state = state

    let canvas = document.getElementById('canvas')

    // setInterval(() => {
    //     if (state.mouseDown && !state.mouseMoved) inc_at_mouse(state)
    // }, 0.125)

    canvas.addEventListener('mousedown', (e) => {
        state.mouseDown = true
        state.mouseMoved = false
        state.mouse = [e.offsetX, e.offsetY]
    })

    canvas.addEventListener('mousemove', (e) => {
        state.mouseMoved = true

        if (!state.mouseDown) return
        state.offsetX += e.movementX
        state.offsetY += e.movementY
    })

    canvas.addEventListener('mouseup', (e) => {
        state.mouseDown = false

        if (state.mouseMoved) return

        state.mouse = [e.offsetX, e.offsetY]
        inc_at_mouse(state)
        state.mouse = null
    })

    mainloop(canvas, state)
}

function inc_at_mouse(state) {
    let [mx, my] = state.mouse
    let [x, y] = [
        (mx - state.offsetX) / state.resolution,
        (my - state.offsetY) / state.resolution,
    ].map(Math.floor)

    state.world.inc_cell(x, y)
    state.world.update(x, y)
}

function mainloop(canvas, state) {
    drawGrid(canvas, state)
    requestAnimationFrame(() => mainloop(canvas, state))
}

function circle(ctx, state, x, y, size_div) {
    ctx.arc(
        x * state.resolution + state.offsetX,
        y * state.resolution + state.offsetY,
        state.resolution / size_div,
        0,
        Math.PI * 2
    )
}

function drawGrid(canvas, state) {
    let { world, data, resolution } = state
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1

    ctx.beginPath()
    for (let x = 0; x <= canvas.width; x += resolution) {
        ctx.moveTo(x + state.offsetX, state.offsetY)
        ctx.lineTo(x + state.offsetX, canvas.height + state.offsetY)
    }
    ctx.stroke()
    ctx.beginPath()
    for (let y = 0; y <= canvas.height; y += resolution) {
        ctx.moveTo(state.offsetX, y + state.offsetY)
        ctx.lineTo(canvas.width + state.offsetX, y + state.offsetY)
    }
    ctx.stroke()

    ctx.fillStyle = '#fff'

    for (let x = 0; x < world.width(); x++) {
        for (let y = 0; y < world.height(); y++) {
            ctx.beginPath()
            switch (data[x * world.width() + y]) {
                case 0:
                    break
                case 1:
                    circle(ctx, state, x + 0.5, y + 0.5, 4)
                    break
                case 2:
                    circle(ctx, state, x + 0.25, y + 0.25, 5)
                    circle(ctx, state, x + 0.75, y + 0.75, 5)
                    break
                case 3:
                    circle(ctx, state, x + 0.5, y + 0.25, 5)
                    circle(ctx, state, x + 0.25, y + 0.75, 5)
                    ctx.fill()
                    ctx.beginPath()
                    circle(ctx, state, x + 0.75, y + 0.75, 5)
                    break
                case 4:
                    circle(ctx, state, x + 0.25, y + 0.25, 5)
                    circle(ctx, state, x + 0.75, y + 0.25, 5)
                    ctx.fill()
                    ctx.beginPath()
                    circle(ctx, state, x + 0.25, y + 0.75, 5)
                    circle(ctx, state, x + 0.75, y + 0.75, 5)
                default:
            }
            ctx.fill()
        }
    }
}

main()
