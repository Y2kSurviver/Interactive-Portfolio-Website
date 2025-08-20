class Button {
    constructor(x, y, w, h) {
        this.dom = document.createElement('p');
        this.dom.style.position = 'absolute';
        this.setPos(x, y);
        this.dom.style.width = `${w}px`;
        this.dom.style.height = `${h}px`;
        this.dom.innerText = 'ABOUT';

        this.body = Bodies.rectangle(x, y, w, h);
        Composite.add(engine.world, this.body);
        screen.appendChild(this.dom);
    }

    setPos(x, y) {
        this.dom.style.top = `${x}px`;
        this.dom.style.left = `${y}px`;
    }

    update() {
        Events.on(engine, 'afterUpdate', () => {
            console.log(this.body.position.x);
        });
    }
}
