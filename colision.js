const canvas = document.getElementById("GameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let circles = [];
let clickedCount = 0; // Contador de clics en los círculos

// Función para oscurecer un color (para el contorno)
function darkenColor(hex, amount = 30) {
    let color = parseInt(hex.slice(1), 16);
    let r = Math.max((color >> 16) - amount, 0);
    let g = Math.max(((color >> 8) & 0x00FF) - amount, 0);
    let b = Math.max((color & 0x0000FF) - amount, 0);
    return `rgb(${r}, ${g}, ${b})`;
}

// Clase Circle con métodos POO
class Circle {
    constructor(x, radius, color, speed) {
        this.posX = x;
        this.posY = -radius; // Inicia justo después del margen superior
        this.radius = radius;
        this.color = color;
        this.borderColor = darkenColor(color, 50);
        this.speed = speed;
    }

    // Dibujar círculo con relleno degradado y contorno
    draw(context) {
        let gradient = context.createRadialGradient(
            this.posX, this.posY, this.radius * 0.3, // Centro del degradado
            this.posX, this.posY, this.radius // Extensión total
        );
        gradient.addColorStop(0, "white"); // Centro más claro
        gradient.addColorStop(1, this.color); // Borde con color base

        context.beginPath();
        context.fillStyle = gradient; // Aplicar degradado
        context.strokeStyle = this.borderColor; // Contorno oscuro
        context.lineWidth = 3;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.closePath();
    }

    // Mover círculo hacia abajo e inicializarlo arriba si se sale del canvas
    update() {
        this.posY += this.speed;

        // Si el círculo sale del canvas, reaparece en la parte superior
        if (this.posY - this.radius > canvas.height) {
            this.resetPosition();
        }
    }

    // Reiniciar la posición del círculo cuando desaparece o es clickeado
    resetPosition() {
        this.posY = -this.radius;
        this.posX = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.speed = Math.random() * 3 + 2; // Velocidad aleatoria entre 2 y 5
    }

    // Verificar si un clic está dentro del círculo
    isClicked(mouseX, mouseY) {
        const dx = this.posX - mouseX;
        const dy = this.posY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.radius;
    }
}

// Crear 10 círculos con velocidades entre 2 y 5
for (let i = 0; i < 10; i++) {
    let radius = Math.random() * 20 + 20;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let speed = Math.random() * 3 + 2; // Velocidad aleatoria entre 2 y 5
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
    circles.push(new Circle(x, radius, color, speed));
}

// Detectar clic y reiniciar círculo en la parte superior
canvas.addEventListener("click", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    circles.forEach(circle => {
        if (circle.isClicked(mouseX, mouseY)) {
            circle.resetPosition(); // Regresa el círculo arriba
            clickedCount++; // Incrementa el contador
        }
    });
});

// Dibujar contador de clics en la esquina superior derecha
function drawCounter() {
    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    ctx.fillText(`Clics: ${clickedCount}`, canvas.width - 150, 30);
}

// Animación
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(circle => {
        circle.update();
        circle.draw(ctx);
    });

    drawCounter(); // Mostrar contador de clics

    requestAnimationFrame(animate);
}

animate();
