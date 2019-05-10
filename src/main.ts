import DisplayManager from "./render_engine/renderer/display_manager";
import RenderEngine from "./render_engine/render_engine";
import Loader from "./loader/loader";
import Model from "./render_engine/model/model";
import Texture, { TextureType } from "./render_engine/model/texture";
import Material from "./render_engine/model/material";
import { MaterialShader } from "./render_engine/shader/shader_config";
import RenderDefaults from "./render_engine/render_defaults";
import Entity from "./render_engine/Enitity/entity";
import { vec3 } from "gl-matrix";
import SimLoop from "./sim_loop";

export default class Main {
  private static display = DisplayManager.getInstance();
  private static renderEngine: RenderEngine;
  private static simLoop: SimLoop;

  private static renderLoopCall: (frameTime: number) => void;

  public static main(): void {
    this.display.createCanvas([window.innerWidth, window.innerHeight]);
    RenderDefaults.getInstance().loadResource();

    this.renderEngine = new RenderEngine();
    this.simLoop = new SimLoop(this.renderEngine);

    /* Load resource */
    let loader = new Loader((model: Model, name: string, loadedCnt: number) => {
      if (name == "goat") {
        let image = new Image();
        image.onload = () => {
          let mat = new Material({
            diffuseMap: new Texture(image, TextureType.DIFFUSE_MAP),
            materialShader: MaterialShader.LIT_MATERIAL_TEXTURE_SHADER
          });
          model.material = mat;
          this.renderEngine.addModel(model, name);
        };
        image.src = "res/texture.png";
      }
      if (loadedCnt == 0) {
        /* loading completet */
        this.animationLoop(0);
      }
    });

    loader.loadModels(["res/goat.obj"]);
  }

  private static animationLoop(frameTime: number): void {
    Main.simLoop.run(frameTime);
    Main.renderEngine.renderFrame(frameTime);
    window.requestAnimationFrame(Main.animationLoop);
  }
}
