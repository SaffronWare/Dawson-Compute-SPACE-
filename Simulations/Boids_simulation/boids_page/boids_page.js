class Boid {
    constructor(){
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector(0,0);
        this.maxForce = 0.2;
        this.maxSpeed = 5.0;
    }

    walls(){
        if (this.position.y > height){this.position.y = 0;}
        else if (this.position.y < 0) { this.position.y = height;}
        if (this.position.x > width){this.position.x = 0;}
        else if (this.position.x < 0) { this.position.x = width;}
    }

    // Aligns this boid with the average of the other boids in the given array (boids in the radius x)
    align(boids){
        //alignment.mult(alignment_slider.value());
        let view = radius_slider.value();  //this is the radius that 'this' is seeing
        let average = createVector();
        let boids_near = 0;
        for (let other of boids){ //loops over elements in boids
            let d = Math.sqrt(((this.position.x - other.position.x)**2) + ((this.position.y - other.position.y)**2));
            if (other != this && d < view){
                average.add(other.velocity); //vector addition, not +=
                boids_near +=1;
            }
        }
        if (boids_near >0){
            average.div(boids_near); //vector division, not /=
            average.setMag(this.maxSpeed);
            average.sub(this.velocity);
            average.limit(this.maxForce); //caps the amount of force that can be applied
        } //the average velocity is the boids desired velocity/the steering force
        return average;
    }

    separation(boids){
        let view = radius_slider.value();  //this is the radius that 'this' is seeing
        let average = createVector();
        let boids_near = 0;
        for (let other of boids){ //loops over elements in boids
            let d = Math.sqrt(((this.position.x - other.position.x)**2) + ((this.position.y - other.position.y)**2));
            if (other != this && d < view){
                let difference = p5.Vector.sub(this.position, other.position);
                difference.div(d); //inversly proportional to the distance -> the farther the lower the pull/push
                average.add(difference);
                boids_near +=1;
            }
        }
        if (boids_near >0){
            average.div(boids_near); //vector division, not /=
            average.setMag(this.maxSpeed);
            average.sub(this.velocity);
            average.limit(this.maxForce); //caps the amount of force that can be applied
        } //the average velocity is the boids desired velocity/the steering force
        return average;
    }

    //Copy of align code except matches position rather than velocity
    cohesion(boids){
        let view = radius_slider.value();  //this is the radius that 'this' is seeing
        let average = createVector();
        let boids_near = 0;
        for (let other of boids){ //loops over elements in boids
            let d = Math.sqrt(((this.position.x - other.position.x)**2) + ((this.position.y - other.position.y)**2));
            if (other != this && d < view){
                average.add(other.position); //vector addition, not +=
                boids_near +=1;
            }
        }
        if (boids_near >0){
            average.div(boids_near); //vector division, not /=
            average.sub(this.position); //subtracts the average velocity from this velocity
            average.setMag(this.maxSpeed);
            average.sub(this.velocity);
            average.limit(this.maxForce); //caps the amount of force that can be applied
        } //the average velocity is the boids desired velocity/the steering force
        return average;
    }

    flock(num_boids){
        let alignment = this.align(num_boids);
        let cohesion = this.cohesion(num_boids);
        let separation = this.separation(num_boids);

// Scale them according to the slider
        alignment.mult(alignment_slider.value());
        cohesion.mult(cohesion_slider.value());
        separation.mult(separation_slider.value());

        //this.acceleration = alignment; //in a world where m=1, F=A
        //this.acceleration = cohesion;
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    update(){
        this.maxSpeed = speed_slider.value();
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.set(0,0); //acceleration shouldn't accumulate over time
    }

    show(index, highlight_on){
        let angle = this.velocity.heading(); //returns direction angle in rad
        if (highlight_on && index === school.length-1){
            fill(255, 23, 135);
            stroke(255, 23, 135);
            push();
            translate(this.position.x, this.position.y);
            rotate(angle);
            triangle(8,0, -10,6, -10,-6);
            pop();
        }
        else{
            fill(255);
            stroke(255);
            push();
            translate(this.position.x, this.position.y);
            rotate(angle);
            triangle(6,0, -8,4, -8,-4);
            pop();
        }
    }

}