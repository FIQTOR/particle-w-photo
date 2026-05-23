import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraController {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;
        
        // Khởi tạo OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        // Cấu hình controls
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.8;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        
        this.controls.minDistance = 50;
        this.controls.maxDistance = 1500;
        
        // Cho phép xoay tự do nhưng giới hạn một chút để không bị lật camera quá đà nếu cần
        // this.controls.maxPolarAngle = Math.PI * 0.85;
        
        // Thiết lập vị trí ban đầu
        this.camera.position.set(0, 30, 600);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        
        this.isAnimating = false;
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    update() {
        if (this.controls) {
            this.controls.update();
        }
    }

    /**
     * Kích hoạt hiệu ứng camera khi double click/tap
     */
    triggerAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Sử dụng GSAP (đã được load trong index.html)
        const timeline = gsap.timeline({
            onComplete: () => {
                this.isAnimating = false;
            }
        });

        // Lưu lại vị trí cũ
        const originalPos = this.camera.position.clone();
        
        // Animation zoom vào trung tâm rồi quay lại
        timeline.to(this.camera.position, {
            x: 0,
            y: 10,
            z: 200,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                this.controls.update();
            }
        })
        .to(this.camera.position, {
            x: originalPos.x,
            y: originalPos.y,
            z: originalPos.z,
            duration: 2.5,
            delay: 0.5,
            ease: "power3.out",
            onUpdate: () => {
                this.controls.update();
            }
        });
    }
}
