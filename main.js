let tabElement;
let dropdownMenu;
let spacecraft;
let spacecraftModel;
let planetTexture;
let spacecraftTexture 
let backgroundImage;
let lightDistance = 5000;

let infoBox;

let instructionBox;
// The current zoom level
let zoom = 1;

// The current rotation angles around the X and Y axes
let rotationX = 0;
let rotationY = 0;

// The current panning offsets along the X and Y axes
let panX = 0;
let panY = 0;

// The spacecraft movement speed
let speed = 0;

// The spacecraft turning speed
let turnSpeed = 0;
let planetRotationY = 0;

// Add this line at the top of your code
let customCursor;

//changing textures
let currentPlanetTexture;
let planetTextures = [];
let index = 0;

let once = false;
//planet descriptions
let planetDescriptions = [
  'Nonatron- home planet',
  'Skillaron',
  'Projecton ',
  'Contacton'
  // Add more descriptions as needed
];
let currentPlanetDescription;

// Movement keys state
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

//load the sounds
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let collisionSoundBuffer;
let spaceBuffer;

function loadSound(url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function () {
    audioContext.decodeAudioData(request.response, function (buffer) {
      callback(buffer);
    });
  };

  request.send();
}


document.addEventListener('DOMContentLoaded', function () {
  loadSound('portfolio_intro.mp3', function (buffer) {
    collisionSoundBuffer = buffer;
  });

  loadSound('space.mp3', function (buffer) {
    spaceBuffer = buffer;
  });
});


function playSound(buffer) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
}

const planetInfoBoxes = [
  {
    title: 'Greetings, cosmic adventurers! 🌟',
    description: `Welcome aboard the SS Nonna-naut, cosmic voyagers! I am Captain Mbebo Nonna, your interstellar tech wizard, celestial aficionado and code sorcerer. As we embark on this thrilling journey through the uncharted territories of my multifaceted universe, we'll discover untold mysteries about myself!
    <br>Join me as we hop from one cosmic destination to another, unveiling the wonders of my passions and pursuits. Buckle up, fellow space explorers, as we blast off into the mesmerizing realm of Creativus Galaxius.`
  },
  {
    title: 'Skills',
    description: `<ul>
                    <li>
                      <strong>Core Skills:</strong> Game Development, VR Development, Web Development, User Interface Design, Project Management
                    </li>
                    <li>
                      <strong>Technical Skills:</strong> HTML5, CSS3, JavaScript, React.js, Adobe Photoshop, Sketch
                    </li>
                    <li>
                      <strong>Industry-specific Skills:</strong> Responsive Design, Agile Methodology, SEO Best Practice
                    </li>
                    <li>
                      <strong>Soft Skills:</strong> Excellent Communication, Problem-solving, Collaboration, Attention to Detail
                    </li>
                    <li>
                      <strong>Certifications and Training:</strong> Front-End Web Development Bootcamp, Unity Game Developer Associate
                    </li>
                    <li>
                      <strong>Languages:</strong> English (Native), French (Fluent)
                    </li>
                  </ul>`
  },
  {
    title: 'Portfolio',
    description: `<div class="portfolio-grid">
                    <div class="portfolio-item">
                      <h4>1. 30MFF Website</h4>
                      <p>This website features a 30 seconds video featuring nyuad campus cats and their relationship with campus residents</p>
                      <img src="textures/campus_cats.png" alt="Project 1" />
                      <a href="https://a1m2n.github.io/commlab/assignment1" class="project-button">Access the website</a>
                    </div>
                    <div class="portfolio-item">
                      <h4>2. Space Adventures</h4>
                      <p>This project hosts an interactive comic experience that blends storytelling with creativity and sound</p>
                      <img src="textures/space_adven.png" alt="Project 2" />
                      <a href="https://a1m2n.github.io/assignment2/" class="project-button">Access the website</a>
                    </div>
                    <div class="portfolio-item">
                      <h4>3.NYUAD SoundScape</h4>
                      <p>This project features a soundscape of selected areas of the nyuad campus in an interactive discovery fashion</p>
                      <img src="textures/soundscape.png" alt="Project 3" />
                      <a href="https://a1m2n.github.io/soundscape/" class="project-button">Access the website</a>
                    </div>
                    <div class="portfolio-item">
                      <h4>4. Video Project</h4>
                      <p>This video website features a fun and engaging way to discover more about the nyuad experience through the lens of its campus workers</p>
                      <img src="textures/campus_workers.png" alt="Project 4" />
                      <a href="https://a1m2n.github.io/videoproject/" class="project-button">Access the website</a>
                    </div>
                  </div>`
  },
  {
    title: 'Contact',
    description: `<p>Feel free to get in touch with me through any of the following channels:</p>
                  <ul>
                    <li>Email: <a href="mailto:mn3001@nyu.edu">mn3001@nyu.edu</a></li>
                    <li>LinkedIn: <a href="https://www.linkedin.com/in/mbebo-nonna-2645a1206/" target="_blank">LinkedIn Profile</a></li>
                    <li>GitHub: <a href="https://github.com/a1m2n" target="_blank">Mbebo Nonna</a></li>
                    </ul>`
  }
 
];


function preload() {

  spacecraftModel = loadModel('warship.obj');
  spacecraftTexture = loadImage('textures/warship.png');
  backgroundImage = loadImage('textures/space.png');

  // Replace 'planet-texture.jpg' with the filename of your texture image
  planetTextures.push(loadImage('textures/nebula.png'));
  planetTextures.push(loadImage('textures/alphagoria.jpeg'));
  planetTextures.push(loadImage('textures/venus.jpg'));
  planetTextures.push(loadImage('textures/haumea.jpg'));
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  spacecraft = new Spacecraft();
  playSound(spaceBuffer);
  cursorCanvas = createGraphics(windowWidth, windowHeight);
  cursorCanvas.position(0, 0);

  tabElements = selectAll('.tab');
  dropdownMenu = select('.dropdown-menu');
  dropdownMenu.hide();
  dropdownMenu.addClass('hidden');

  // Add event listener for the click event
  tabElements.forEach(tabElement => {
    tabElement.mouseClicked(() => {
      if (dropdownMenu.hasClass('hidden')) {
        dropdownMenu.removeClass('hidden');
        dropdownMenu.show();
      } else {
        dropdownMenu.addClass('hidden');
        dropdownMenu.hide();
      }
    });
  });


  planetLinks = selectAll('a');

  planetLinks.forEach(link => {
    link.mouseClicked((event) => {
      event.preventDefault();
      let selectedPlanet = link.html();
      if(selectedPlanet == "Nonatron"){
          index = 0;
          currentPlanetTexture = planetTextures[index];
          currentPlanetDescription = planetDescriptions[index];
          currentPlanetInfoBox = planetInfoBoxes[index];

          updateDescription(currentPlanetDescription);
          updateInfoBoxTitle(currentPlanetInfoBox.title);
          updateInfoBoxDescription(currentPlanetInfoBox.description);
      }
      else if(selectedPlanet == "Skillaron"){
          index = 1;
          currentPlanetTexture = planetTextures[index];
          currentPlanetDescription = planetDescriptions[index];
          currentPlanetInfoBox = planetInfoBoxes[index];

          updateDescription(currentPlanetDescription);
          updateInfoBoxTitle(currentPlanetInfoBox.title);
          updateInfoBoxDescription(currentPlanetInfoBox.description);
      }
      else if (selectedPlanet == "Projecton"){
          index = 2;
          currentPlanetTexture = planetTextures[index];
          currentPlanetDescription = planetDescriptions[index];
          currentPlanetInfoBox = planetInfoBoxes[index];

          updateDescription(currentPlanetDescription);
          updateInfoBoxTitle(currentPlanetInfoBox.title);
          updateInfoBoxDescription(currentPlanetInfoBox.description);
        }
      else{
          index = 3;
          currentPlanetTexture = planetTextures[index];
          currentPlanetDescription = planetDescriptions[index];
          currentPlanetInfoBox = planetInfoBoxes[index];

          updateDescription(currentPlanetDescription);
          updateInfoBoxTitle(currentPlanetInfoBox.title);
          updateInfoBoxDescription(currentPlanetInfoBox.description);
      }
      infoBox.addClass('hidden');
      dropdownMenu.addClass('hidden');
      spacecraft.x = -100; // Adjust the offset value as needed
      spacecraft.y = 0;
      spacecraft.z = -530;
      spacecraft.yaw = 0.2;
      spacecraft.pitch = 0.4;
      spacecraft.roll = 0;
      spacecraft.speed = 0;
      dropdownMenu.hide();
    });
  });

  infoBox = select('#info-box');
  instructionBox = select("#instructions-box");
  instructionBox.removeClass('hidden');
  infoBox.addClass('hidden');
  infoBox.addClass('content-center');

  currentPlanetDescription = planetDescriptions[0];
  currentPlanetTexture = planetTextures[index];

}

function updateDescription(description) {
  let descriptionElement = select('#first-planet');
  descriptionElement.html(description);
}


function updateInfoBoxTitle(title) {
  let infoBoxTitleElement = select('#info-box-title');
  infoBoxTitleElement.html(title);
}

function updateInfoBoxDescription(description) {
  let infoBoxDescriptionElement = select('#info-box-description');
  infoBoxDescriptionElement.html(description);
}


function updatePlanetTexture() {
  if(index == planetTextures.length-1){
    index = 0;
  }else{
    index +=1;
  }

  if(index == 0){
    instructionBox.removeClass('hidden');
  }else{
    instructionBox.addClass('hidden');
    infoBox.removeClass('content-center');
  }
  currentPlanetTexture = planetTextures[index];
  currentPlanetDescription = planetDescriptions[index];
  currentPlanetInfoBox = planetInfoBoxes[index];

  updateDescription(currentPlanetDescription);
  updateInfoBoxTitle(currentPlanetInfoBox.title);
  updateInfoBoxDescription(currentPlanetInfoBox.description);
}




function draw() {
  push();
  imageMode(CENTER);
  image(backgroundImage, 0, 0, width, height);
  pop();

  planetRotationY += 0.002; 
  ambientLight(50);
  rotateY(9);
  //pointLight(255, 255, 255, mouseX - width / 2, mouseY - height / 2, 200);


  // Apply the zoom, rotation, and panning transformations to the camera
  applyTransformations();

  spacecraft.update();
  spacecraft.display();
  displayPlanet();

  const planetX = 0;
  const planetY = 0;
  const planetZ = 0;
  const planetRadius = 400;

  if (spacecraft.collidesWithSphere(planetX, planetY, planetZ, planetRadius)) {
    //console.log('Collision detected!');
    // Perform any actions you want to take when a collision is detected
    infoBox.removeClass('hidden');

      // Play the collision sound
    if (index == 0 && collisionSoundBuffer && once == false) {
      playing = playSound(collisionSoundBuffer);
      once = true;
    }
  }
}

function applyTransformations() {
  // Apply the zoom transformation
  let scaleFactor = 1 / zoom;
  scale(scaleFactor);

  // Apply the rotation transformations
  rotateX(rotationX);
  rotateY(rotationY);

  // Apply the panning transformation
  translate(panX, panY);
}

// Handle mouse wheel events for zooming in/out
function mouseWheel(event) {
  // Increase or decrease the zoom level based on the mouse wheel delta
  zoom += event.delta / 1000;
  // Clamp the zoom level to a minimum of 0.1 and a maximum of 10
  zoom = constrain(zoom, 0.1, 10);
}


function keyPressed() {
  if (keyCode === UP_ARROW) {
    moveForward = true;
  } else if (keyCode === DOWN_ARROW) {
    moveBackward = true;
  } else if (keyCode === LEFT_ARROW) {
    moveLeft = true;
  } else if (keyCode === RIGHT_ARROW) {
    moveRight = true;
  } else if (keyCode === 65 /* 'A' key */) {
    moveUp = true;
  } else if (keyCode === 90 /* 'Z' key */) {
    moveDown = true;
  }else if (keyCode === 87 /* 'W' key */) {
    spacecraft.speed += 2; // set the speed to 2 when the 'W' key is pressed
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW) {
    moveForward = false;
  } else if (keyCode === DOWN_ARROW) {
    moveBackward = false;
  } else if (keyCode === LEFT_ARROW) {
    moveLeft = false;
  } else if (keyCode === RIGHT_ARROW) {
    moveRight = false;
  } else if (keyCode === 65 /* 'A' key */) {
    moveUp = false;
  } else if (keyCode === 90 /* 'Z' key */) {
    moveDown = false;
  }else if (keyCode === 87 /* 'W' key */) {
    spacecraft.speed = 0; // set the speed back to 0 when the 'W' key is released
  }
}

function rotateVectorAroundAxis(vec, axis, angle) {
  let u = axis.copy();
  let p = vec.copy();
  u.normalize();

  let ux = u.x;
  let uy = u.y;
  let uz = u.z;
  let cosTheta = Math.cos(angle);
  let sinTheta = Math.sin(angle);
  let oneMinusCosTheta = 1 - cosTheta;

  let x = (ux * ux * oneMinusCosTheta + cosTheta) * p.x +
          (ux * uy * oneMinusCosTheta - uz * sinTheta) * p.y +
          (ux * uz * oneMinusCosTheta + uy * sinTheta) * p.z;

  let y = (ux * uy * oneMinusCosTheta + uz * sinTheta) * p.x +
          (uy * uy * oneMinusCosTheta + cosTheta) * p.y +
          (uy * uz * oneMinusCosTheta - ux * sinTheta) * p.z;

  let z = (ux * uz * oneMinusCosTheta - uy * sinTheta) * p.x +
          (uy * uz * oneMinusCosTheta + ux * sinTheta) * p.y +
          (uz * uz * oneMinusCosTheta + cosTheta) * p.z;

  return createVector(x, y, z);
}

class Spacecraft {
  constructor() {
    this.x = -100; // Adjust the offset value as needed
    this.y = 0;
    this.z = -530;
    this.yaw = 0.2;
    this.pitch = 0.4;
    this.roll = 0;
    this.speed = 0;
  }

  update() {
    // Implement spacecraft movement controls
    if (keyIsDown(LEFT_ARROW)) {
      this.yaw -= 0.02;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.yaw += 0.02;
    }
    if (keyIsDown(UP_ARROW)) {
      this.pitch -= 0.02;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.pitch += 0.02;
    }
    if (keyIsDown(65)) { // 'A' key
      this.roll -= 0.02;
    }
    if (keyIsDown(90)) { // 'Z' key
      this.roll += 0.02;
    }

    let forward = createVector(0, 0, this.speed);
    forward = rotateVectorAroundAxis(forward, createVector(1, 0, 0), this.pitch);
    forward = rotateVectorAroundAxis(forward, createVector(0, 1, 0), this.yaw);
    forward = rotateVectorAroundAxis(forward, createVector(0, 0, 1), this.roll);
    this.x += forward.x; 
    this.y += forward.y;
    this.z += forward.z;
    
    //let edgeX = (-340) / (1 / zoom);
    if (this.x < -340) {
      this.x = -100; // Adjust the offset value as needed
      this.y = 0;
      this.z = -530;
      this.yaw = 0.2;
      this.pitch = 0.4;
      this.roll = 0;
      this.speed = 0;
      updatePlanetTexture(); // Update the current planet texture
      infoBox.addClass('hidden');
    }
  }


  display() {
    push();
    translate(this.x, this.y, this.z);

    // Set up the point lights relative to the spacecraft's position
    let lightColor = color(255, 255, 255);
    let lightOffset = 100;
    pointLight(lightColor, this.x - lightOffset, this.y, this.z);
    pointLight(lightColor, this.x + lightOffset, this.y, this.z);
    pointLight(lightColor, this.x, this.y - lightOffset, this.z);
    pointLight(lightColor, this.x, this.y + lightOffset, this.z);
    pointLight(lightColor, this.x, this.y, this.z - lightOffset);
    pointLight(lightColor, this.x, this.y, this.z + lightOffset);

    rotateZ(this.roll);
    rotateY(this.yaw);
    rotateX(this.pitch);
    scale(2); // Adjust the size of the model, if necessary
    noStroke();
    texture(spacecraftTexture);

    model(spacecraftModel);
    //box(10);
    pop();
  }


  collidesWithSphere(sphereX, sphereY, sphereZ, sphereRadius) {
    const dx = this.x - sphereX;
    const dy = this.y - sphereY;
    const dz = this.z - sphereZ;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
    // You might need to adjust the spacecraftRadius to match the actual size of your spacecraft model
    const spacecraftRadius = 10;

    if (distance <= (sphereRadius + spacecraftRadius)) {
      // Move the spacecraft to the top of the screen
      this.y = -50;
      this.z = -500;
      this.x = -200;
      this.yaw = -1;
      this.pitch = 0.1;
    }
    return distance <= (sphereRadius + spacecraftRadius);
  }
}

function displayPlanet() {
  push();
  translate(0, 0, 0); // Adjust the position of the planet relative to the spacecraft
  texture(currentPlanetTexture);

  rotateY(planetRotationY);

  // Set the position of the point light relative to the planet
  let lightX = windowWidth / 2 + lightDistance;
  let lightY = windowHeight / 2;
  let lightZ = 0;

  for (let i = 0; i < 4; i++) {
    pointLight(255, 255, 255, lightX, lightY, lightZ);
  }

  noStroke();
  sphere(280); // Adjust the size of the planet
  pop();

   
}

function mouseMoved() {
  let customCursor = document.getElementById('custom-cursor');
  customCursor.style.left = mouseX + 10 + 'px';
  customCursor.style.top = mouseY +'px';
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


