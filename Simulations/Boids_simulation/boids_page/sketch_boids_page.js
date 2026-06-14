const school = [];

let highlight_toggle;
let highlight_on = false;
let alignment_slider, cohesion_slider, separation_slider, radius_slider, speed_slider, count_slider;

function setup(){
    createCanvas(windowWidth, (windowHeight/4)*3);

    let alignmentDiv = createDiv();
    alignmentDiv.addClass("slider-group");

    let alignLabel = createP("Alignment: ");
    alignLabel.addClass("slider-label");
    alignLabel.parent(alignmentDiv);

    alignment_slider = createSlider(0, 5, 2, 0.1); //lowest, largest, start value, increment
    alignment_slider.addClass('slider');
    alignment_slider.id('alignment');
    alignment_slider.parent(alignmentDiv);

    alignment_value = createSpan(alignment_slider.value());
    alignment_value.parent(alignmentDiv);

    let cohesionDiv = createDiv();
    cohesionDiv.addClass("slider-group");
    let cohesionLabel = createP("Cohesion: ");
    cohesionLabel.addClass("slider-label");
    cohesionLabel.parent(cohesionDiv);
    cohesion_slider = createSlider(0, 5, 2, 0.1);
    cohesion_slider.addClass('slider');
    cohesion_slider.id('cohesion');
    cohesion_slider.parent(cohesionDiv);
    cohesion_value = createSpan(cohesion_slider.value());
    cohesion_value.parent(cohesionDiv);

    let separateDiv = createDiv();
    separateDiv.addClass("slider-group");
    let separateLabel = createP("Separation: ");
    separateLabel.addClass("slider-label");
    separateLabel.parent(separateDiv);
    separation_slider = createSlider(0, 5, 2, 0.1);
    separation_slider.addClass('slider');
    separation_slider.id('separation');
    separation_slider.parent(separateDiv);
    separation_value = createSpan(separation_slider.value());
    separation_value.parent(separateDiv);

    let radiusDiv = createDiv();
    radiusDiv.addClass("slider-group");
    let radiusLabel = createP("Radius: ");
    radiusLabel.addClass("slider-label");
    radiusLabel.parent(radiusDiv);
    radius_slider = createSlider(1, 100, 50, 1);
    radius_slider.addClass('slider');
    radius_slider.id('radius');
    radius_slider.parent(radiusDiv);
    radius_value = createSpan(radius_slider.value());
    radius_value.parent(radiusDiv);

    let speedDiv = createDiv();
    speedDiv.addClass("slider-group");
    let speedLabel = createP("Speed: ");
    speedLabel.addClass("slider-label");
    speedLabel.parent(speedDiv);
    speed_slider = createSlider(1, 8, 4, 0.5);
    speed_slider.addClass('slider');
    speed_slider.id('speed');
    speed_slider.parent(speedDiv);
    speed_value = createSpan(speed_slider.value());
    speed_value.parent(speedDiv);

    let countDiv = createDiv();
    countDiv.addClass("slider-group");
    let countLabel = createP("Count: ");
    countLabel.addClass("slider-label");
    countLabel.parent(countDiv);
    count_slider = createSlider(1, 250, 100, 1);
    count_slider.addClass('slider');
    count_slider.id('count');
    count_slider.parent(countDiv);
    count_value = createSpan(count_slider.value());
    count_value.parent(countDiv);

    highlight_toggle = createCheckbox('Follow a boid', false);
    highlight_toggle.changed(() => {highlight_on = highlight_toggle.checked();});

    for (let i = 0; i<count_slider.value(); i++){school.push(new Boid());}
}

function windowResized(){
    resizeCanvas(windowWidth, (windowHeight/4)*3);
}

function draw(){
    background(50);

    let num = count_slider.value();
    while (school.length < num){school.push(new Boid());}
    while (school.length > num){school.pop();}

    alignment_value.html(alignment_slider.value());
    cohesion_value.html(cohesion_slider.value());
    separation_value.html(separation_slider.value());
    radius_value.html(radius_slider.value());
    speed_value.html(speed_slider.value());
    count_value.html(count_slider.value());

    // for of loops over values, for in loops over indexes
    for (let i = 0; i < school.length; i++){ 
        let boid = school[i];
        boid.walls(); //checks if it hits wall, loops around
        boid.flock(school);
        boid.update();
        boid.show(i, highlight_on);
    }
}