const canvas = document.getElementById("GameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Clase Circle con métodos POO
class Circle {
    constructor(x, y, radius, color, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.originalColor = color;
        this.color = color;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;
    }

    // Dibujar solo el contorno del círculo
    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.lineWidth = 3;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.stroke();
        context.closePath();
    }

    // Actualizar posición y rebotar en los bordes
    update() {
        this.posX += this.dx;
        this.posY += this.dy;

        if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    // Detectar colisión con otro círculo y hacer que reboten
    checkCollision(otherCircle) {
        const dx = this.posX - otherCircle.posX;
        const dy = this.posY - otherCircle.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + otherCircle.radius) {
            // Flasheo en azul
            this.color = "#0000FF";
            otherCircle.color = "#0000FF";

            // Invertir dirección de ambos círculos
            this.dx = -this.dx;
            this.dy = -this.dy;
            otherCircle.dx = -otherCircle.dx;
            otherCircle.dy = -otherCircle.dy;

            // Restaurar color después de 100ms
            setTimeout(() => {
                this.color = this.originalColor;
                otherCircle.color = otherCircle.originalColor;
            }, 100);
        }
    }
}

// Crear 10 círculos con velocidades entre 1 y 5
let circles = [];
for (let i = 0; i < 10; i++) {
    let radius = Math.random() * 20 + 20;
    let x = Math.random() * (canvas.width - 2 * radius) + radius;
    let y = Math.random() * (canvas.height - 2 * radius) + radius;
    let speed = Math.random() * 4 + 1;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    circles.push(new Circle(x, y, radius, color, speed));
}

// Animación
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(circle => {
        circle.update();
        circle.draw(ctx);
    });

    // Verificar colisiones entre círculos
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            circles[i].checkCollision(circles[j]);
        }
    }

    requestAnimationFrame(animate);
}

animate();
