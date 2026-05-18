const school = [];

// let alignment_slider, cohesion_slider, separation_slider, radius_slider, speed_slider, count_slider;

function setup(){
    createCanvas(360, 360);

    // let alignLabel = createP("Alignment");
    // alignLabel.addClass("slider-label");
    // alignment_slider = createSlider(0, 5, 1, 0.1); //lowest, largest, start value, increment
    // alignment_slider.addClass('slider');
    // alignment_slider.id('alignment');

    // let cohesionLabel = createP("Cohesion");
    // cohesionLabel.addClass("slider-label");
    // cohesion_slider = createSlider(0, 5, 1, 0.1);
    // cohesion_slider.addClass('slider');
    // cohesion_slider.id('cohesion');

    // let separateLabel = createP("Separation");
    // separateLabel.addClass("slider-label");
    // separation_slider = createSlider(0, 5, 1, 0.1);
    // separation_slider.addClass('slider');
    // separation_slider.id('separation');

    // let radiusLabel = createP("Radius");
    // radiusLabel.addClass("slider-label");
    // radius_slider = createSlider(1, 100, 50, 1);
    // radius_slider.addClass('slider');
    // radius_slider.id('radius');

    // let speedLabel = createP("Speed");
    // speedLabel.addClass("slider-label");
    // speed_slider = createSlider(1, 8, 4, 0.5);
    // speed_slider.addClass('slider');
    // speed_slider.id('speed');

    // let coundLabel = createP("Count");
    // coundLabel.addClass("slider-label");
    // count_slider = createSlider(1, 150, 75, 1);
    // count_slider.addClass('slider');
    // count_slider.id('count');

    for (let i = 0; i<100; i++){school.push(new Boid());}
}

function draw(){
    background(0); //makes background black

    // for of loops over values, for in loops over indexes
    for (let boid of school){ 
        boid.walls(); //checks if it hits wall, loops around
        boid.flock(school);
        boid.update();
        boid.show();
    }
}