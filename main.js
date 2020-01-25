function setup() {
    createCanvas(windowWidth, windowHeight);
}

function calculate_theta(x, y) {
    if (x == 0) {
        // y-axis
        if (y > 0) {
            return Math.PI / 2;
        }
        else {
            return 3 * (Math.PI / 2);
        }  
    }
    else if (y == 0) {
        // x-axis
        if (x > 0) {
            return 0;
        }
        else {
            return Math.PI;
        }
    }
    else if (x > 0 && y > 0) {
        // quadrant 1
        return Math.atan(y / x);
    }
    else if (x < 0 && y > 0) {
        // quadrant 2
        return Math.PI - Math.atan(y / -x);
    }
    else if (x < 0 && y < 0) {
        // quadrant 3
        return Math.PI + Math.atan(y / x);
    }
    else {
        // quadrant 4
        return 2 * Math.PI - Math.atan(-y / x);
    }
}

function draw() {
    const now = new Date();

    // prepare for red
    const max_dist = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
    let lota;
    if (width > height) {
        lota = Math.atan(width / height);
    }
    else {
        lota = Math.atan(height / width);
    }
    const max_shift = 245;
    const min_shift = 255 * (1 - Math.cos(lota));

    // calculate blue [second]
    const blue = Math.floor((255 * now.getSeconds()) / 59);

    // calculate alpha [year]
    const alpha = Math.round(255 * (1 - min(1, (now.getFullYear() - 2020) / (10000 - 2020))));

    for (let x = -width / 2; x < width / 2; x++) {
        for (let y = -height / 2; y < height / 2; y++) {
            // calculate red [hour]
            const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            let red = Math.floor((dist / max_dist) * 255 + max_shift - (max_shift - min_shift) * (now.getHours() / 24));
            if (red > 255) {
                red -= 255;
            }

            // calculate green [minute]
            const beta = (now.getMinutes() * Math.PI) / 30;
            let angle = (3 * Math.PI / 2 - calculate_theta(x, y)) + beta;
            if (angle > 2 * Math.PI) {
                angle -= 2 * Math.PI;
            }
            else if (angle < 0) {
                angle += 2 * Math.PI;
            }
            const green = Math.round((angle / (2 * Math.PI)) * 255);

            // set rgba
            const c = color(red, green, blue, alpha);
            set(x + width / 2, y + height / 2, c);
        }
    }
    updatePixels();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}