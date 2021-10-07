use wasm_bindgen::prelude::*;
use js_sys::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: String);
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    height: usize,
    cells: Vec<u8>,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, height: usize) -> World {
        World {
            width: width,
            height: height,
            cells: vec![0; width * height],
        }
    }

    pub fn update(&mut self, x: usize, y: usize) {
        if self.cell(x, y) == 4 {
            self.set_cell(x, y, self.cell(x, y) - 4);
            for (nx, ny) in self.neighbours(x, y) {
                self.inc_cell(nx, ny);
                self.update(nx, ny);
            }
        }
    }

    fn neighbours(&self, x: usize, y: usize) -> Vec<(usize, usize)> {
        vec![
            ((x + 1) % self.width, y),
            ((x - 1) % self.width, y),
            (x, (y + 1) % self.height),
            (x, (y - 1) % self.height),
        ]
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn height(&self) -> usize {
        self.height
    }

    pub fn cells(&self) -> Uint8Array {
        unsafe { Uint8Array::view(&self.cells) }
    }

    pub fn cell(&self, x: usize, y: usize) -> u8 {
        self.cells[self.width * x + y]
    }

    pub fn set_cell(&mut self, x: usize, y: usize, value: u8) {
        self.cells[self.width * x + y] = value;
    }

    pub fn inc_cell(&mut self, x: usize, y: usize) {
        let idx = self.width * x + y;
        self.cells[idx] += 1;
        if self.cells[idx] > 4 {
            self.cells[idx] = 4;
        }
    }
}
