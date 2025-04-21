import { 
    Engine, 
    Scene, 
    Vector3, 
    HemisphericLight, 
    MeshBuilder,
    StandardMaterial,
    Color3,
    ArcRotateCamera
} from '@babylonjs/core';

export class GameScene {
    private scene: Scene;
    private ball: any;
    private onClick: () => void;

    constructor(canvas: HTMLCanvasElement, onClick: () => void) {
        const engine = new Engine(canvas, true);
        this.scene = new Scene(engine);
        this.onClick = onClick;

        this.createCamera();
        this.createLight();
        this.createBall();

        engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });
    }

    private createCamera() {
        const camera = new ArcRotateCamera(
            'camera',
            0,
            Math.PI / 3,
            10,
            Vector3.Zero(),
            this.scene
        );
        camera.setTarget(Vector3.Zero());
    }

    private createLight() {
        new HemisphericLight(
            'light',
            new Vector3(0, 1, 0),
            this.scene
        );
    }

    private createBall() {
        this.ball = MeshBuilder.CreateSphere(
            'ball',
            { diameter: 2 },
            this.scene
        );

        // Set initial color
        this.setColor('#ffffff');

        // Add click action
        this.ball.actionManager = this.scene.actionManager;
        this.ball.isPickable = true;
        this.scene.onPointerDown = () => {
            this.onClick();
        };
    }

    public setColor(hexColor: string) {
        const material = new StandardMaterial('ballMaterial', this.scene);
        material.diffuseColor = Color3.FromHexString(hexColor);
        this.ball.material = material;
    }

    public disableClicks() {
        this.ball.isPickable = false;
    }

    public getCurrentColor(): string {
        const material = this.ball.material as StandardMaterial;
        return material.diffuseColor.toHexString();
    }
}
